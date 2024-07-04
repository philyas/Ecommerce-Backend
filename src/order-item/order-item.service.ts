import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemsRepository.create(createOrderItemDto);
    return this.orderItemsRepository.save(orderItem);
  }

  findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({ relations: ['order', 'product'] });
  }

  findOne(id: number): Promise<OrderItem> {
    return this.orderItemsRepository.findOne({ where: { id }, relations: ['order', 'product'] });
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto): Promise<OrderItem> {
    await this.orderItemsRepository.update(id, updateOrderItemDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.orderItemsRepository.delete(id);
  }
}
