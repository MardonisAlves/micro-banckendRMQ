import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { Payload, EventPattern, MessagePattern } from '@nestjs/microservices';
import { Categoria } from './interfaces/categoria.interface';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  logger = new Logger(AppController.name)

  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: Categoria) {
    this.logger.log(`categoria: ${JSON.stringify(categoria)}`)

    await this.appService.criarCategoria(categoria);
  }

  @MessagePattern('consultar-categorias')
  async consultarcategorias(@Payload() _id: string) {
    if (_id) {
      return await this.appService.consulterCategoriaById(_id)
    } else {
      return await this.appService.consulterCategorias();
    }
  }
}
