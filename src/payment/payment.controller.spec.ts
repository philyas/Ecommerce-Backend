import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { Payment } from './entities/payment.entity';
import { Order } from 'src/order/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { OrderItem } from 'src/order-item/entities/order-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { PaymentModule } from './payment.module';

describe('PaymentController', () => {

  let controller: PaymentController
  let service: PaymentService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "postgres",
          host: 'dpg-cq215ltds78s73esdkm0-a.frankfurt-postgres.render.com',
          port: 5432,
          username: 'user_db_zdpm_user',
          password: 'ef6sqfRPTS4bSx1J2M0MlBAMuAjnuJJ8',
          database: 'user_db_zdpm',
          entities: [User, Order, OrderItem, Product, Category, Payment],
          ssl:true,
          synchronize: true,
        }),
        PaymentModule
      ]
    }).compile();

   service = module.get<PaymentService>(PaymentService)
   controller =  module.get<PaymentController>(PaymentController)


  });

  it('should be defined here', async () => {

    const payments = [];

    function getArrayAsync(): Promise<any> {
      // Replace with your actual elements
      return Promise.resolve(payments);
    }

    jest.spyOn(service, 'findAll').mockImplementation(async () => getArrayAsync());

    expect(await controller.findAll()).toBe(payments);

    console.log(await controller.findAll())
  });
});
