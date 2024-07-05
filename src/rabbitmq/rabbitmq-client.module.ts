import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'rabbit@7c830cb07675',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:15672'], // Adjust URL based on your RabbitMQ setup
          queue: 'orders_queue', // Queue name
          queueOptions: {
            durable: true, // Make the queue durable
          },
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class RabbitMQClientModule {}
