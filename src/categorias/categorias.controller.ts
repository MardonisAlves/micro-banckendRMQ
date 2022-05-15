import { Controller, Logger } from '@nestjs/common';
import { Payload, EventPattern, MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { Categoria } from './interfaces/categoria.interface';
import {atualizarCategoria} from './interfaces/atualizar-categoria.interface';
import {deletarCategoria}  from './interfaces/deletar-caregoria.interface';
import {CategoriasService} from './categorias.service';

@Controller('categorias')
export class CategoriasController {
	 constructor(private readonly categoriasService: CategoriasService) { }
  logger = new Logger(CategoriasController.name)

  @EventPattern('criar-categoria')
  async criarCategoria(@Payload() categoria: Categoria, @Ctx() context:RmqContext) {
    let errorAck = ["E11000"];
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try{
        await this.categoriasService.criarCategoria(categoria);
        await channel.ack(originalMsg)
  }
    catch(error){
       this.logger.log(`error: ${JSON.stringify(error.message)}`)

       const filterError = errorAck.filter(
         ackError => error.message.includes(ackError))
         if(filterError){
          await channel.ack(originalMsg);
         }
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarcategorias(@Payload() _id: string, @Ctx() context:RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try{

      if (_id) {
    return await this.categoriasService.consulterCategoriaById(_id)

    } else {
      return await this.categoriasService.consulterCategorias();
    }

    }finally{
     await channel.ack(originalMsg)
    }
  }


  @EventPattern('atualizar-categoria')
  async atualizarCategoria(@Payload() categoria:atualizarCategoria, @Ctx() context:RmqContext){
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try{
      await this.categoriasService.atualizarCategoria(categoria)
    }finally{
      await channel.ack(originalMsg)
    }

  }

  @EventPattern('deletar-categoria')
  async deletarCategoria(@Payload() _id:deletarCategoria, @Ctx() context:RmqContext){
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try{
      return await this.categoriasService.deletarCategoria(_id)
    }finally{
      await channel.ack(originalMsg)
    }
  }
}
