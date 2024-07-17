import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NotFoundException } from '@nestjs/common';
import { ProductService } from 'src/product/product.service';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { CreateOrderItemDto } from 'src/order-item/dto/create-order-item.dto';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productService: ProductService,
    @Inject('RABBIT_ORDERS') 
    private readonly orderClient: ClientProxy,
    @Inject('RABBIT_INVENTORY') 
    private readonly inventoryClient: ClientProxy,
    private httpService: HttpService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order | String>  {
    const { userId, orderItems } = createOrderDto;
    const order = new Order();
    order.user = { id: userId } as any; // Assuming userId is an existing
  
    // Optional: Validate if products exist and throw error if not found
    // If Product is an extra microservice, than sending http request to product service
    await this.validateProductsExist(orderItems);

    // function for validating product stock here
    // sending http request to check inventory product stock status (Throw Error Exception, if quantity > stock)
    await this.checkStock(orderItems);
    
    // update stock for all products if stock check successfull
    this.updateStock(orderItems)

    // Create order instance
    order.orderItems = await Promise.all(
      orderItems.map(async (item) => {
        const product = await this.productService.findOne(item.productId);
        const orderItem = new OrderItem();
        orderItem.quantity = item.quantity;
        orderItem.product = product;
        orderItem.price = item.price * item.quantity
        return orderItem;
      }),
    );

    const createdOrder = await this.ordersRepository.save(order);
    // Publish event to RabbitMQ
     this.orderClient.emit('order_created', {
      orderId: createdOrder.id,
      userId: createdOrder.user.id,
      orderItems: createdOrder.orderItems,
      status: createdOrder.status,
    });

    return createdOrder;

  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['orderItems', 'orderItems.product', 'user'] });
  }

  findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne({ where: { id }, relations: ['orderItems', 'orderItems.product', 'user', 'payment'] });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.ordersRepository.update(id, updateOrderDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ordersRepository.delete(id);
  }


  private async validateProductsExist(orderItems: CreateOrderItemDto[]): Promise<void> {
    const productIds = orderItems.map(item => item.productId);
    const products = await this.productService.findMany(productIds);

    const foundProductIds = products.map(product => product.id);
    const missingProductIds = productIds.filter(productId => !foundProductIds.includes(productId));

    if (missingProductIds.length > 0) {
      throw new NotFoundException(`Products with IDs [${missingProductIds.join(', ')}] not found.`);
    }
  }


  private async checkStock(orderItems:CreateOrderItemDto[]){
    for (let orderItem of orderItems) {
      const response = await this.httpService.axiosRef
      .get(`http://localhost:3005/inventory/product/${orderItem.productId}`)

      // Throw exception when at least one product out of stock
      if (response.data.stock  < orderItem.quantity) {
        throw new NotFoundException(`Product with ID ${orderItem.productId} is out of stock`)
      }
    }
  }

  private updateStock(orderItems:CreateOrderItemDto[]){
    for (let orderItem of orderItems) {
       // emit event to update stock for all products in inventory service
       this.inventoryClient.emit('stock_update', { productId:orderItem.productId, quantity: orderItem.quantity })
    }
  }


}
