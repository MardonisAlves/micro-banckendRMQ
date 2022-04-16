import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Categoria } from './interfaces/categoria.interface';
import {atualizarCategoria} from './interfaces/atualizar-categoria.interface';
import {deletarCategoria} from './interfaces/deletar-caregoria.interface'
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';
import {Model} from 'mongoose';

@Injectable()
export class CategoriasService {
	constructor(
    @InjectModel('Categoria') private readonly categoriasModel: Model<Categoria>) {}

    private logger = new Logger(CategoriasService.name);

  async criarCategoria(categoria: Categoria): Promise<Categoria> {

  try {
    const categoriaCriada = new this.categoriasModel(categoria);
    return await categoriaCriada.save();
  } catch (error) {
    this.logger.error(`error: ${JSON.stringify(error.message)}`)
    throw new RpcException(error.message)
  }

}

  async consulterCategoriaById(_id: string): Promise<Categoria> {
    const categoria =  await this.categoriasModel.findOne({_id}).exec();
    if (!categoria) {
      throw new NotFoundException(`categoria com_id ${_id} não foi encontrado`)
    } else {
      return categoria;
    }
  }

  async consulterCategorias(): Promise<Categoria[]> {
    const categorias =  await this.categoriasModel.find().exec();
    if (!categorias) {
      throw new NotFoundException(`categoria  não foi encontrado`)
    } else {
      return categorias;
    }
  }

  async atualizarCategoria(categoria:any): Promise<atualizarCategoria> {
    const {descricao} = categoria.categoria
    try{
      console.log(descricao)
      return await this.categoriasModel.findOneAndUpdate(
      {_id:categoria._id}, {
        $set: {
            descricao:descricao
      }});

    }catch(error){
      this.logger.log(JSON.stringify(error))
    }


}

async deletarCategoria(_id:deletarCategoria) : Promise<any>{
  try{
    return await this.categoriasModel.deleteOne({_id:_id._id}).exec();
  }catch(error){
     this.logger.log(JSON.stringify(error))
  }
}
}
