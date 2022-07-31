import { Controller, Post, Logger, Res } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import {AtualizarJogador } from './interfaces/atulzar-jogador.interface';
import {JogadorEmail } from './interfaces/jogador-email';
import { JogadoresService } from './jogadores.service';
import {Response } from 'express';
import Twilioservice from './services.twilio';
import { Sms } from './interfaces/sms.interface';
import ZenviaService from './zenvia.service';
@Controller('jogadores')
export class JogadoresController {
private  logger = new Logger(JogadoresController.name);
constructor(
	private readonly jogadoresService: JogadoresService,
	private readonly twlioservices:Twilioservice,
	private readonly zenviaservice:ZenviaService
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
		return;
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

@MessagePattern('sms')
async enviarsmsWharsap(@Payload() sms:Sms){
	try {
	return await this.twlioservices.sendMessageWhatsap(sms);	
	} catch (error) {
	console.log(error);
	
	}
}

@MessagePattern('zenvia')
async enviarsms(){
	try {
		return await this.zenviaservice.sendSms();
	} catch (error) {
		console.log(error);
		
	}
}
}
