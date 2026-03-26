import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { OrdersModule } from '../orders/orders.module';
import { JwtSseGuard } from '../auth/guards/jwt-sse.guard';

@Module({
  imports: [OrdersModule, JwtModule],
  providers: [NotificationsService, JwtSseGuard],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
