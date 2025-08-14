import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  async findAll() {
    const list = await this.products.findAll();
    return list;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const num = Number(id);
    if (!Number.isFinite(num)) return { error: 'BAD_ID' };
    const prod = await this.products.findOneById(num);
    return prod ?? { error: 'NOT_FOUND' };
  }
}
