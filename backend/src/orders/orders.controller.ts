import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './entities/order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrders(@CurrentUser() user: any) {
    return this.ordersService.getOrders(user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOrder(@CurrentUser() user: any, @Param('id') orderId: string) {
    const order = await this.ordersService.getOrderById(orderId, user.id);
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') orderId: string,
    @Body() { status }: { status: OrderStatus },
  ) {
    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.ordersService.updateOrderStatus(orderId, status);
  }
}
