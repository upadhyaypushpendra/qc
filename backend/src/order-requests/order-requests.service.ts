import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRequest, OrderRequestStatus } from './entities/order-request.entity';
import { WalletService } from '../wallet/wallet.service';

export interface CreateOrderRequestDto {
  orderId: string;
  deliveryPartnerId: string;
  deliveryFee: number;
  pickupLatitude?: number;
  pickupLongitude?: number;
  deliveryLatitude?: number;
  deliveryLongitude?: number;
}

@Injectable()
export class OrderRequestService {
  constructor(
    @InjectRepository(OrderRequest)
    private orderRequestRepo: Repository<OrderRequest>,
    private walletService: WalletService,
  ) {}

  async getPendingRequests(deliveryPartnerId: string): Promise<OrderRequest[]> {
    return this.orderRequestRepo.find({
      where: {
        deliveryPartnerId,
        status: OrderRequestStatus.PENDING,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async acceptOrderRequest(
    orderRequestId: string,
    deliveryPartnerId: string,
  ): Promise<OrderRequest> {
    const orderRequest = await this.orderRequestRepo.findOne({
      where: { id: orderRequestId },
    });

    if (!orderRequest) {
      throw new NotFoundException('Order request not found');
    }

    if (orderRequest.deliveryPartnerId !== deliveryPartnerId) {
      throw new BadRequestException('Not authorized to accept this order');
    }

    orderRequest.status = OrderRequestStatus.ACCEPTED;
    await this.orderRequestRepo.save(orderRequest);

    // Add earnings to wallet
    if (this.walletService) {
      await this.walletService.addPendingEarnings(deliveryPartnerId, orderRequest.deliveryFee);
    }

    return orderRequest;
  }

  async declineOrderRequest(
    orderRequestId: string,
    deliveryPartnerId: string,
  ): Promise<void> {
    const orderRequest = await this.orderRequestRepo.findOne({
      where: { id: orderRequestId },
    });

    if (!orderRequest) {
      throw new NotFoundException('Order request not found');
    }

    if (orderRequest.deliveryPartnerId !== deliveryPartnerId) {
      throw new BadRequestException('Not authorized to decline this order');
    }

    orderRequest.status = OrderRequestStatus.DECLINED;
    await this.orderRequestRepo.save(orderRequest);
  }
}
