import { Controller, Post, Logger, Res } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import {AtualizarJogador } from './interfaces/atulzar-jogador.interface';
import {JogadorEmail } from './interfaces/jogador-email';
import { JogadoresService } from './jogadores.service';
import {Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { User } from './interfaces/user.interface';

@Controller('jogadores')
export class JogadoresController {
private  logger = new Logger(JogadoresController.name);
constructor(
	private readonly jogadoresService: JogadoresService,
	private readonly emailService:MailService
	       ){}

@EventPattern('new-jogador')
async criarJogador(@Payload() criarJogador:Jogador , @Ctx() context:RmqContext, @Res() response:Response){

	let errorAck = ["E11000"];
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
	try{
		await this.jogadoresService.criarJogador(criarJogador);
		await channel.ack(originalMsg);

	}catch(error){
		this.logger.log(error)

		const filterError = errorAck.filter(
         ackError => error.message.includes(ackError))
         if(filterError){
          await channel.ack(originalMsg);
         }

	}finally{
		this.logger.log('finally')
	}
}

@MessagePattern('jogadores')
async getjogadores(@Payload() _id:string){
	try{
		if(_id){
			return this.jogadoresService.getjogador(_id)
		}else{
			return this.jogadoresService.getjogadores()
		}
	}catch(error){
		this.logger.log(error)
	}
}

@MessagePattern('getjogador-email')
async getjogadorByEmail(@Payload() email:JogadorEmail){
	try{
		return  this.jogadoresService.getjogadorByEmail(email);
	}catch(error){
	this.logger.log(error)
	}
}

@MessagePattern('atualizar-jogador')
async atualizarJogador(
	@Payload() atualizarJogadorDto:AtualizarJogador,
	@Payload() id:string){
	try{
		
		return this.jogadoresService.atualizarJogador(atualizarJogadorDto, id);
	}catch(error){
		this.logger.log(error)	}
}

@MessagePattern('atualizar-avatar')
async atualizarAvatar(@Payload() atualizarJogadorDto:any){
	try{
		return this.jogadoresService.atualizarAvatar(atualizarJogadorDto);
		
	}catch(error){
		this.logger.log(error)	}
}

@MessagePattern('deletar-jogador')
async deletarJogador(@Payload() _id:string){
	try {
		return  this.jogadoresService.deletarJogadorId(_id);
	} catch (error) {
		this.logger.log(error)
	}
}

@MessagePattern('email')
async enviarEmail(@Payload() user:User){
	try {
	const token = Math.floor(1000 + Math.random() * 9000).toString()
	return await this.emailService.sendUserConfirmation(user, token);	
	} catch (error) {
	console.log(error);
	}
}
}
