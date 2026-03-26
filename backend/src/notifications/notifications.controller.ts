import {
  Controller,
  Get,
  Param,
  UseGuards,
  Sse,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { NotificationsService } from './notifications.service';
import { OrdersService } from '../orders/orders.service';
import { JwtSseGuard } from '../auth/guards/jwt-sse.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    private ordersService: OrdersService,
  ) {}

  @Get(':id/events')
  @Sse()
  @UseGuards(JwtSseGuard)
  async orderEvents(
    @Param('id') orderId: string,
    @CurrentUser() user: any,
  ): Promise<Observable<MessageEvent>> {
    const order = await this.ordersService.getOrderById(orderId, user.id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }

    const stream = this.notificationsService.getStream(orderId);

    // Send initial status events
    for (const event of order.statusHistory) {
      stream.next({
        data: JSON.stringify({
          orderId,
          status: event.status,
          timestamp: event.timestamp,
          note: event.note,
        }),
      } as any);
    }

    return stream.asObservable();
  }
}
