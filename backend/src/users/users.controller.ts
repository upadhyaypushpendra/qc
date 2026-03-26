import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Get('addresses')
  @UseGuards(JwtAuthGuard)
  async getAddresses(@CurrentUser() user: any) {
    return this.usersService.getAddresses(user.id);
  }

  @Get('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async getAddress(@CurrentUser() user: any, @Param('id') addressId: string) {
    return this.usersService.getAddress(user.id, addressId);
  }

  @Post('addresses')
  @UseGuards(JwtAuthGuard)
  async createAddress(@CurrentUser() user: any, @Body() dto: CreateAddressDto) {
    return this.usersService.createAddress(user.id, dto);
  }

  @Patch('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async updateAddress(
    @CurrentUser() user: any,
    @Param('id') addressId: string,
    @Body() dto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(user.id, addressId, dto);
  }

  @Delete('addresses/:id')
  @UseGuards(JwtAuthGuard)
  async deleteAddress(
    @CurrentUser() user: any,
    @Param('id') addressId: string,
  ) {
    return this.usersService.deleteAddress(user.id, addressId);
  }
}
