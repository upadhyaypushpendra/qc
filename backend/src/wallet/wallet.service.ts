import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepo: Repository<Wallet>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  /**
   * Get or create wallet for user
   */
  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { userId } });

    if (!wallet) {
      wallet = this.walletRepo.create({
        userId,
        balance: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        totalWithdrawn: 0,
      });
      await this.walletRepo.save(wallet);
    }

    return wallet;
  }

  /**
   * Get wallet details
   */
  async getWallet(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findOne({ where: { userId } });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return wallet;
  }

  /**
   * Add earnings to pending (when order is completed)
   */
  async addPendingEarnings(userId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.getOrCreateWallet(userId);

    wallet.pendingEarnings = parseFloat(
      (parseFloat(wallet.pendingEarnings.toString()) + amount).toFixed(2),
    );
    wallet.totalEarnings = parseFloat(
      (parseFloat(wallet.totalEarnings.toString()) + amount).toFixed(2),
    );

    return this.walletRepo.save(wallet);
  }

  /**
   * Move pending earnings to balance (when withdrawal is approved)
   */
  async approvePendingEarnings(userId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (parseFloat(wallet.pendingEarnings.toString()) < amount) {
      throw new BadRequestException('Insufficient pending earnings');
    }

    wallet.pendingEarnings = parseFloat(
      (parseFloat(wallet.pendingEarnings.toString()) - amount).toFixed(2),
    );
    wallet.balance = parseFloat(
      (parseFloat(wallet.balance.toString()) + amount).toFixed(2),
    );

    return this.walletRepo.save(wallet);
  }

  /**
   * Withdraw from wallet
   */
  async withdraw(userId: string, amount: number): Promise<Wallet> {
    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (parseFloat(wallet.balance.toString()) < amount) {
      throw new BadRequestException('Insufficient balance');
    }

    wallet.balance = parseFloat(
      (parseFloat(wallet.balance.toString()) - amount).toFixed(2),
    );
    wallet.totalWithdrawn = parseFloat(
      (parseFloat(wallet.totalWithdrawn.toString()) + amount).toFixed(2),
    );

    return this.walletRepo.save(wallet);
  }

  /**
   * Get wallet summary for user profile
   */
  async getWalletSummary(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const user = await this.userRepo.findOne({ where: { id: userId } });

    return {
      balance: wallet.balance,
      totalEarnings: wallet.totalEarnings,
      pendingEarnings: wallet.pendingEarnings,
      totalWithdrawn: wallet.totalWithdrawn,
      user: {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        identifier: user?.identifier,
        role: user?.role,
      },
    };
  }
}
