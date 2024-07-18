import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { ProductModule } from './product.module';
import { Payment } from 'src/payment/entities/payment.entity';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateProductDto } from './dto/create-product.dto';
import { ResponseProductDto } from './dto/response-product.dto';

describe('ProductController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({isGlobal:true}),
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
        ProductModule
      ]
    }).compile();

    app = module.createNestApplication()
    await app.init()

  });

  it('/products (GET)', async () => {
      const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

      expect(Array.isArray(response.body)).toBe(true)
      expect(Array(response.body).length).toBeGreaterThanOrEqual(0)
  });

  it('/products (POST)', async () => {
    const newProduct:CreateProductDto= {
      name: 'Product Name',
      price: 100,
      categoryIds: [1,2],
      stock:1000,
      description: 'Product Description',
    };

    const response = await request(app.getHttpServer())
      .post('/products')
      .send(newProduct)
      .expect(201);

    expect(response.body).toMatchObject(new ResponseProductDto()); // Assuming the response body contains an 'id' for the new product
  });

 



});
