import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  findAll(): Promise<Payment[]> {
    return this.paymentsRepository.find({ relations: ['order'] });
  }

  findOne(id: number): Promise<Payment> {
    return this.paymentsRepository.findOne({ where: { id }, relations: ['order'] });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    await this.paymentsRepository.update(id, updatePaymentDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.paymentsRepository.delete(id);
  }
}
