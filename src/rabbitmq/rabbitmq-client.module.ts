import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBIT_ORDERS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Adjust URL based on your RabbitMQ setup
          queue: 'orders_queue', // Queue name
          queueOptions: {
            durable: true, // Make the queue durable
          },
          prefetchCount:1
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQOrderClientModule {}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBIT_PRODUCTS',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Adjust URL based on your RabbitMQ setup
          queue: 'products_queue', // Queue name
          queueOptions: {
            durable: true, // Make the queue durable
          },
          prefetchCount:1
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQProductClientModule {}
