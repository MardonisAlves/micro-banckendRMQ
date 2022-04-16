import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {CategoriaSchema} from './schemas/categoria.schema';
import {JogadorSchema} from './schemas/jogador.schema';
import { CategoriasService } from './categorias/categorias.service';
import { JogadoresService } from './jogadores/jogadores.service'
import  {CategoriasController} from './categorias/categorias.controller';
import { JogadoresController } from './jogadores/jogadores.controller';
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
  providers: [CategoriasService, JogadoresService]
})
export class AppModule {}
