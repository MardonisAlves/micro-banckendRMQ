import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {CategoriaSchema} from './schemas/categoria.schema';
import {JogadorSchema} from './schemas/jogador.schema';
import { CategoriasService } from './categorias/categorias.service';
import { JogadoresService } from './jogadores/jogadores.service'
import  {CategoriasController} from './categorias/categorias.controller';
import { JogadoresController } from './jogadores/jogadores.controller';
import Twilioservice from './jogadores/services.twilio';
import ZenviaService from './jogadores/zenvia.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.URL_MONGODB),
    MongooseModule.forFeature([
      {name: 'Categoria' , schema: CategoriaSchema},
      {name: 'Jogador' , schema: JogadorSchema}
    ])
  ],

  controllers:[CategoriasController, JogadoresController],
  providers: [CategoriasService, JogadoresService, Twilioservice, ZenviaService]
})
export class AppModule {}
