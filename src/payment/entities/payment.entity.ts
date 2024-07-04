import { Entity, PrimaryGeneratedColumn, OneToOne, Column } from 'typeorm';
import { Order } from 'src/order/entities/order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Order, order => order.payment)
  order: Order;

  @Column()
  method: string; // e.g., 'credit card', 'paypal'

  @Column()
  status: string; // e.g., 'paid', 'pending', 'failed'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
