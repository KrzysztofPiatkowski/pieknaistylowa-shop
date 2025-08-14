import { Controller, Post, Get, Param, Body, HttpCode, ParseIntPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    if (!order) return { error: 'NOT_FOUND' };

    return {
      id: order.id,
      createdAt: order.createdAt,
      contact: {
        name: order.contactName,
        email: order.contactEmail,
        phone: order.contactPhone,
        note: order.contactNote,
      },
      items: order.items.map((it) => ({
        id: it.productId,
        title: it.title,
        price: it.price,
        qty: it.qty,
        note: it.note || '',
        lineTotal: it.lineTotal,
      })),
      totals: {
        qty: order.totalsQty,
        price: order.totalsPrice,
      },
    };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() payload: CreateOrderDto) {
    const saved = await this.ordersService.create(payload);
    return { ok: true, orderId: saved.id, createdAt: saved.createdAt };
  }
}
