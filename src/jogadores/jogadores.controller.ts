import { Controller, HttpException, HttpStatus, Logger, Res } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern, Ctx, RmqContext, CONTEXT } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import {AtualizarJogador } from './interfaces/atulzar-jogador.interface';
import {JogadorEmail } from './interfaces/jogador-email';
import { JogadoresService } from './jogadores.service';
import { MailService } from 'src/mail/mail.service';
import { User } from './interfaces/user.interface';
import UtilsRabbitmq from 'src/utils/utils.rabbitmq';

@Controller('jogadores')
export class JogadoresController {
private  logger = new Logger(JogadoresController.name);
constructor(
	private readonly jogadoresService: JogadoresService,
	private readonly emailService:MailService,
	private readonly utilsrabbitmq:UtilsRabbitmq
	       ){}

@EventPattern('new-jogador')
async criarJogador(@Payload() criarJogador:Jogador , @Ctx() context:RmqContext){

	let errorAck = ["E11000"];
	try{
		await this.jogadoresService.criarJogador(criarJogador);
		await this.utilsrabbitmq.successEmail(context)
	}catch(error){
		const filterError = errorAck.filter(
         ackError => error.message.includes(ackError))
         if(filterError){
			await this.utilsrabbitmq.successEmail(context)
         }

	}finally{
		this.logger.log('finally')
	}
}

@MessagePattern('jogadores')
async getjogadores(@Payload() _id:string, @Ctx() context:RmqContext){
	try{
		if(_id){
			const getjogador = await this.jogadoresService.getjogador(_id)
			await this.utilsrabbitmq.successEmail(context)
			return getjogador;
		}else{
			const getjogador = await this.jogadoresService.getjogadores();
			await this.utilsrabbitmq.successEmail(context)
			return getjogador;
		}
	}catch(error){
		throw new HttpException({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			error: 'Error interno',
		  }, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}

@MessagePattern('getjogador-email')
async getjogadorByEmail(@Payload() email:JogadorEmail, @Ctx() context:RmqContext){
	try{
		const getJogador = await this.jogadoresService.getjogadorByEmail(email);
		await this.utilsrabbitmq.successEmail(context)
		return getJogador;
	}catch(error){
	this.logger.log(error)
	}
}

@MessagePattern('atualizar-jogador')
async atualizarJogador(
	@Payload() atualizarJogadorDto:AtualizarJogador,
	@Payload() id:string, @Ctx() context:RmqContext){
	try{
		const update = await this.jogadoresService.atualizarJogador(atualizarJogadorDto, id);
		await this.utilsrabbitmq.successEmail(context)
		return update;
	}catch(error){
		this.logger.log(error)	}
}

@MessagePattern('atualizar-avatar')
async atualizarAvatar(@Payload() atualizarJogadorDto:any, @Ctx() context:RmqContext){
	try{
		const update =await this.jogadoresService.atualizarAvatar(atualizarJogadorDto);
		await this.utilsrabbitmq.successEmail(context)
		return update;
	}catch(error){
		this.logger.log(error)	}
}

@MessagePattern('deletar-jogador')
async deletarJogador(@Payload() _id:string, @Ctx() context:RmqContext){
	try {
		const delet = await this.jogadoresService.deletarJogadorId(_id);
		await this.utilsrabbitmq.successEmail(context)
		return delet;
	} catch (error) {
		this.logger.log(error)
	}
}

@MessagePattern('email')
async enviarEmail(@Payload() user:User ,@Ctx() context:RmqContext ){
	try {
	const token = Math.floor(1000 + Math.random() * 9000).toString()
	const email = await this.emailService.sendUserConfirmation(user, token)
	await this.utilsrabbitmq.successEmail(context)
	return email;
	} catch (error) {
	console.log(error);
	}
}
}
