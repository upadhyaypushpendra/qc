import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(RefreshToken) private tokenRepo: Repository<RefreshToken>,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({
      email: dto.email,
      passwordHash: hash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    await this.userRepo.save(user);

    return this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.firstName,
      user.lastName,
    );
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.firstName,
      user.lastName,
    );
  }

  async refresh(refreshToken: string) {
    const refreshSecret =
      this.config.get<string>('jwt.refreshSecret') ||
      'dev_jwt_refresh_secret_do_not_use_in_production_12345';

    // Verify JWT signature
    let payload: { sub: string };
    try {
      payload = this.jwt.verify<{ sub: string }>(refreshToken, {
        secret: refreshSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const userId = payload.sub;
    const record = await this.tokenRepo.findOne({
      where: { userId, revoked: false },
    });

    if (!record || !record.expiresAt || new Date() > record.expiresAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const valid = await bcrypt.compare(refreshToken, record.tokenHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Revoke old token
    await this.tokenRepo.update(record.id, { revoked: true });

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.firstName,
      user.lastName,
    );
  }

  async logout(userId: string) {
    await this.tokenRepo.update({ userId }, { revoked: true });
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    firstName?: string,
    lastName?: string,
  ) {
    const payload = { sub: userId, email, role, firstName, lastName };
    const secret =
      this.config.get<string>('jwt.secret') ||
      'dev_jwt_secret_do_not_use_in_production_12345';
    const refreshSecret =
      this.config.get<string>('jwt.refreshSecret') ||
      'dev_jwt_refresh_secret_do_not_use_in_production_12345';

    const accessToken = this.jwt.sign(payload, {
      secret,
      expiresIn: '1h',
    });

    const refreshPayload = {
      ...payload,
      version: crypto.randomBytes(4).toString('hex'),
    };
    const refreshTokenPlain = this.jwt.sign(refreshPayload, {
      secret: refreshSecret,
      expiresIn: '7d',
    });

    const refreshTokenHash = await bcrypt.hash(refreshTokenPlain, 12);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.tokenRepo.save({
      userId,
      tokenHash: refreshTokenHash,
      expiresAt,
      revoked: false,
    });

    return {
      accessToken,
      refreshToken: refreshTokenPlain,
    };
  }
}
