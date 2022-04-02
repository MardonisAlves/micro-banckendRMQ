import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Categoria } from './interfaces/categoria.interface';
import { Jogador } from './interfaces/jogador.interface';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import {Model} from 'mongoose';


@Injectable()
export class AppService {

  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    @InjectModel('Jogador') private readonly  jogadorModel: Model<Jogador>,
    ) {}

    private logger = new Logger(AppService.name);

async criarCategoria(categoria: Categoria): Promise<Categoria> {

  try {
    const categoriaCriada = new this.categoriaModel(categoria);
    return await categoriaCriada.save();
  } catch (error) {
    this.logger.error(`error: ${JSON.stringify(error.message)}`)
    throw new RpcException(error.message)
  }

}

  async consulterCategoriaById(_id: string): Promise<Categoria> {
    const categoria =  await this.categoriaModel.findOne({_id}).exec();
    if (!categoria) {
      throw new NotFoundException(`categoria com_id ${_id} não foi encontrado`)
    } else {
      return categoria;
    }
  }

  async consulterCategorias(): Promise<Categoria[]> {
    const categorias =  await this.categoriaModel.find().exec();
    if (!categorias) {
      throw new NotFoundException(`categoria  não foi encontrado`)
    } else {
      return categorias;
    }
  }


}
