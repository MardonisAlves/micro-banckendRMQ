import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Jogador } from './interfaces/jogador.interface'
import {JogadorEmail} from './interfaces/jogador-email';
import {Model} from 'mongoose';
@Injectable()
export class JogadoresService {
	private logger = new Logger(JogadoresService.name);
	constructor(@InjectModel('Jogador') private readonly jogadorModel:Model<Jogador>){}
	async criarJogador(jogador:Jogador): Promise<Jogador>{
		try{
			const criarjogador = new this.jogadorModel(jogador)
			return await criarjogador.save();
		}catch(error){
			this.logger.log(error)
		}
	}

	async getjogador(_id:string) :Promise<any>{
		try{
		return await this.jogadorModel.findOne({_id}).exec();
		}catch(error){
		this.logger.log(error)		}
	}

	async getjogadores() :Promise<any>{
		try{
		return await this.jogadorModel.find().exec();
		}catch(error){
		this.logger.log(error)
	}
	}

	async getjogadorByEmail(emailjogador:JogadorEmail) : Promise<Jogador>{
		const {email} = emailjogador
		try{
		return this.jogadorModel.findOne({email}).exec();
		}catch(error){
			this.logger.log(error)
		}
	}
}
