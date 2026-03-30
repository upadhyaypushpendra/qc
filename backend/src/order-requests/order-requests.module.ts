import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRequestController } from './order-requests.controller';
import { OrderRequestService } from './order-requests.service';
import { OrderRequest } from './entities/order-request.entity';
import { WalletModule } from '../wallet/wallet.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRequest]),
    WalletModule,
    AuthModule,
  ],
  controllers: [OrderRequestController],
  providers: [OrderRequestService],
  exports: [OrderRequestService],
})
export class OrderRequestsModule {}
