import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductController } from 'src/product/product.controller';
import { Category } from 'src/category/entities/category.entity';
import { CategoryController } from 'src/category/category.controller';
import { CategoryService } from 'src/category/category.service';
import { RabbitMQOrderClientModule, RabbitMQProductClientModule } from 'src/rabbitmq/rabbitmq-client.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Product, Category]), RabbitMQOrderClientModule, RabbitMQProductClientModule, HttpModule],
  controllers: [OrderController, ProductController, CategoryController],
  providers: [OrderService, ProductService, CategoryService],
})
export class OrderModule {}
