import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { PaymentModule } from './payment/payment.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order-item/entities/order-item.entity';
import { Product } from './product/entities/product.entity';
import { Category } from './category/entities/category.entity';
import { Payment } from './payment/entities/payment.entity';
import { OrderService } from './order/order.service';
import { ProductService } from './product/product.service';
import { CategoryService } from './category/category.service';
import { PaymentService } from './payment/payment.service';
import { CategoryController } from './category/category.controller';
import { OrderItemController } from './order-item/order-item.controller';
import { PaymentController } from './payment/payment.controller';
import { ProductController } from './product/product.controller';
import { OrderController } from './order/order.controller';
import { OrderItemService } from './order-item/order-item.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    TypeOrmModule.forRoot({
    type: "postgres",
    host: String(process.env.HOST),
    port: 5432,
    username: String(process.env.USER),
    password: String(process.env.PASSWORD),
    database: String(process.env.DB),
    entities: [User, Order, OrderItem, Product, Category, Payment],
    ssl:true,
    synchronize: true,
  }),
  TypeOrmModule.forFeature([User, Order, OrderItem, Product, Category, Payment]),
    UserModule,
    OrderModule,
    OrderItemModule,
    ProductModule,
    CategoryModule,
    PaymentModule],
  controllers: [AppController, UserController, CategoryController, OrderItemController, PaymentController, ProductController, OrderController],
  providers: [AppService, UserService, OrderService, OrderItemService, ProductService, CategoryService, PaymentService],
})
export class AppModule {}
