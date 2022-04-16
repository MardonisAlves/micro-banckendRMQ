import { Controller, Post, Logger  } from '@nestjs/common';
import { EventPattern, Payload, MessagePattern, Ctx, RmqContext } from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';
@Controller('jogadores')
export class JogadoresController {
private  logger = new Logger(JogadoresController.name);
constructor(private readonly jogadoresService: JogadoresService){}

@EventPattern('new-jogador')
async criarJogador(@Payload() criarJogador:Jogador , @Ctx() context:RmqContext){
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
			return this.jogadoresService.getjogadores()
		}else{
			return this.jogadoresService.getjogadores()
		}
	}catch(error){
		this.logger.log(error)
	}
}
}
