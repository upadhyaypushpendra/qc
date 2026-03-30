import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { OrderRequestService } from './order-requests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtSseGuard } from '../auth/guards/jwt-sse.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('order-requests')
export class OrderRequestController {
  constructor(private orderRequestService: OrderRequestService) {}

  /**
   * SSE endpoint for listening to order requests in real-time
   */
  @Sse('listen')
  @UseGuards(JwtSseGuard)
  listenToOrderRequests(@CurrentUser() user: any): Observable<MessageEvent> {
    const deliveryPartnerId = user.id;

    return new Observable((subscriber) => {
      // Send initial connection message
      subscriber.next({
        data: JSON.stringify({
          type: 'connected',
          message: 'Connected to order request stream',
          timestamp: new Date().toISOString(),
        }),
      } as MessageEvent);

      // Poll for pending requests every 5 seconds
      const subscription = interval(5000)
        .pipe(
          map(async () => {
            try {
              const requests =
                await this.orderRequestService.getPendingRequests(
                  deliveryPartnerId,
                );

              return {
                type: 'order_request',
                data: requests.map((req) => ({
                  id: req.id,
                  orderId: req.orderId,
                  deliveryFee: req.deliveryFee,
                  pickupLatitude: req.pickupLatitude,
                  pickupLongitude: req.pickupLongitude,
                  deliveryLatitude: req.deliveryLatitude,
                  deliveryLongitude: req.deliveryLongitude,
                  expiresAt: req.expiresAt,
                  createdAt: req.createdAt,
                })),
                timestamp: new Date().toISOString(),
              };
            } catch (error) {
              console.error('Error fetching pending requests:', error);
              return {
                type: 'error',
                message: 'Failed to fetch orders',
                timestamp: new Date().toISOString(),
              };
            }
          }),
        )
        .subscribe(async (messagePromise) => {
          const message = await messagePromise;
          subscriber.next({ data: JSON.stringify(message) } as MessageEvent);
        });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * Get pending order requests for delivery partner
   */
  @Get('pending')
  @UseGuards(JwtAuthGuard)
  async getPendingRequests(@CurrentUser() user: any) {
    const requests = await this.orderRequestService.getPendingRequests(
      user.id,
    );
    return {
      count: requests.length,
      requests: requests.map((req) => ({
        id: req.id,
        orderId: req.orderId,
        deliveryFee: req.deliveryFee,
        pickupLatitude: req.pickupLatitude,
        pickupLongitude: req.pickupLongitude,
        deliveryLatitude: req.deliveryLatitude,
        deliveryLongitude: req.deliveryLongitude,
        expiresAt: req.expiresAt,
        createdAt: req.createdAt,
      })),
    };
  }

  /**
   * Accept an order request
   */
  @Post(':id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptOrderRequest(
    @Param('id') orderRequestId: string,
    @CurrentUser() user: any,
  ) {
    const orderRequest = await this.orderRequestService.acceptOrderRequest(
      orderRequestId,
      user.id,
    );
    return {
      message: 'Order request accepted',
      orderId: orderRequest.orderId,
      deliveryFee: orderRequest.deliveryFee,
    };
  }

  /**
   * Decline an order request
   */
  @Post(':id/decline')
  @UseGuards(JwtAuthGuard)
  async declineOrderRequest(
    @Param('id') orderRequestId: string,
    @CurrentUser() user: any,
  ) {
    await this.orderRequestService.declineOrderRequest(
      orderRequestId,
      user.id,
    );
    return {
      message: 'Order request declined',
    };
  }
}
