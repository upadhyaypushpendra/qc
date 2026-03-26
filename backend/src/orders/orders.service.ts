import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  Order,
  OrderItem,
  OrderStatus,
  OrderStatusEvent,
} from './entities/order.entity';
import { Address } from '../users/entities/address.entity';
import { CartService } from '../cart/cart.service';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStatusEvent) private eventRepo: Repository<OrderStatusEvent>,
    @InjectRepository(Address) private addressRepo: Repository<Address>,
    private cartService: CartService,
    private productsService: ProductsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const address = await this.addressRepo.findOne({
      where: { id: dto.addressId, userId },
    });

    if (!address) {
      throw new BadRequestException('Address not found');
    }

    const cart = await this.cartService.getCart(userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Rebuild order items with fresh product data
    const orderItems: any[] = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = await this.productsService.findBySlug(item.productId);
      if (!product || !product.inStock || product.stockQty < item.quantity) {
        throw new BadRequestException(
          `Product ${item.productName} is no longer available`,
        );
      }

      orderItems.push({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    // Create order
    const order = this.orderRepo.create({
      userId,
      status: OrderStatus.PLACED,
      addressSnapshot: {
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        postcode: address.postcode,
      },
      totalAmount,
    });

    const savedOrder = await this.orderRepo.save(order);

    // Create order items
    for (const item of orderItems) {
      await this.itemRepo.save({
        ...item,
        orderId: savedOrder.id,
      });
    }

    // Create initial status event
    await this.eventRepo.save({
      orderId: savedOrder.id,
      status: OrderStatus.PLACED,
      note: 'Order placed',
    });

    // Clear cart
    await this.cartService.clearCart(userId);

    // Emit event
    this.eventEmitter.emit('order.created', {
      orderId: savedOrder.id,
      userId,
      totalAmount,
    });

    return savedOrder;
  }

  async getOrders(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      relations: ['items', 'statusHistory'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderById(orderId: string, userId: string) {
    return this.orderRepo.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'statusHistory'],
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    if (order.completed) {
      throw new BadRequestException('Cannot update a completed order');
    }

    order.status = status;
    order.completed =
      status === OrderStatus.DELIVERED || status === OrderStatus.CANCELLED;
    await this.orderRepo.save(order);

    // Create status event
    const event = await this.eventRepo.save({
      orderId,
      status,
      note: `Order status updated to ${status}`,
    });

    // Emit event for SSE
    this.eventEmitter.emit('order.status_updated', {
      orderId,
      status,
      timestamp: new Date(),
    });

    return event;
  }
}
