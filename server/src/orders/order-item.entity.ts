import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity({ name: 'order_items' })
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({ name: 'product_id', type: 'int', unsigned: true })
  productId!: number;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'int', unsigned: true })
  price!: number;

  @Column({ type: 'int', unsigned: true })
  qty!: number;

  @Column({ name: 'line_total', type: 'int', unsigned: true })
  lineTotal!: number;

  @Column({ type: 'text', nullable: true })
  note!: string | null;
}
