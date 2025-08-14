import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private readonly itemRepo: Repository<OrderItem>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({
      order: { id: 'DESC' },
      relations: ['items'],
    });
  }

  async findOne(id: number): Promise<Order | null> {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
  }

  async create(dto: CreateOrderDto): Promise<Order> {
    if (!dto.items?.length) {
      throw new BadRequestException('Koszyk jest pusty');
    }

    return this.dataSource.transaction<Order>(async (manager) => {
      const ids = dto.items.map((i) => i.id);
      const products = await manager.getRepository(Product).findBy({ id: In(ids) });
      const byId = new Map(products.map((p) => [p.id, p]));

      const items: OrderItem[] = [];
      let sumQty = 0;
      let sumPrice = 0;

      for (const i of dto.items) {
        const prod = byId.get(i.id);
        if (!prod) {
          throw new BadRequestException(`Produkt ID=${i.id} nie istnieje`);
        }
        const qty = Math.max(1, Math.floor(i.qty));
        const lineTotal = prod.price * qty;

        const row = manager.getRepository(OrderItem).create({
          productId: prod.id,
          title: prod.title,
          price: prod.price,
          qty,
          lineTotal,
          note: i.note ?? null,
        });

        items.push(row);
        sumQty += qty;
        sumPrice += lineTotal;
      }

      const order = manager.getRepository(Order).create({
        contactName: dto.contact.name.trim(),
        contactEmail: dto.contact.email.trim(),
        contactPhone: dto.contact.phone?.trim() || null,
        contactNote: dto.contact.note?.trim() || null,
        totalsQty: sumQty,
        totalsPrice: sumPrice,
        items,
      });

      const saved = await manager.getRepository(Order).save(order);
      return saved;
    });
  }
}
