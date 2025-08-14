import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt!: Date;

  @Column({ name: 'contact_name', type: 'varchar', length: 180 })
  contactName!: string;

  @Column({ name: 'contact_email', type: 'varchar', length: 180 })
  contactEmail!: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 40, nullable: true })
  contactPhone!: string | null;

  @Column({ name: 'contact_note', type: 'text', nullable: true })
  contactNote!: string | null;

  @Column({ name: 'totals_qty', type: 'int', unsigned: true })
  totalsQty!: number;

  @Column({ name: 'totals_price', type: 'int', unsigned: true })
  totalsPrice!: number;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items!: OrderItem[];
}
