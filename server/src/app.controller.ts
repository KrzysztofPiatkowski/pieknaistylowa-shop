import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';

@Controller()
export class AppController {
  private indexPath = join(__dirname, '..', '..', 'client', 'build', 'index.html');

  @Get('/')
  root(@Res() res: any) {
    return res.sendFile(this.indexPath);
  }

  @Get('/koszyk')
  cart(@Res() res: any) {
    return res.sendFile(this.indexPath);
  }

  @Get('/zamowienie')
  checkout(@Res() res: any) {
    return res.sendFile(this.indexPath);
  }

  @Get('/zamowienia')
  orders(@Res() res: any) {
    return res.sendFile(this.indexPath);
  }

  @Get('/dziekujemy/:id')
  thankyou(@Res() res: any) {
    return res.sendFile(this.indexPath);
  }

  @Get('/uslugi/:slug')
  service(@Res() res: any) {
    return res.sendFile(this.indexPath);
  }
}
