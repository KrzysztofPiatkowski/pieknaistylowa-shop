import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findOneById(id: number): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  count(): Promise<number> {
    return this.repo.count();
  }

  async seedDefaults(): Promise<void> {
    const rows: Array<Partial<Product>> = [
      { id: 1, slug: 'analiza-kolorystyczna',   title: 'analiza kolorystyczna',   price: 548 },
      { id: 2, slug: 'analiza-ksztaltu-twarzy', title: 'analiza kształtu twarzy', price: 198 },
      { id: 3, slug: 'analiza-sylwetki',        title: 'analiza sylwetki',        price: 298 },
      { id: 4, slug: 'zakupy-ze-stylistka',     title: 'zakupy ze stylistką',     price: 1798 },
      { id: 5, slug: 'szafa-kapsulowa',         title: 'szafa kapsułowa',         price: 4398 },
      { id: 6, slug: 'przeglad-szafy',          title: 'przegląd szafy',          price: 2448 },
    ];
    await this.repo.save(rows);
  }
}
