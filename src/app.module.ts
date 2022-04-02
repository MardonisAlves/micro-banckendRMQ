import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {CategoriaSchema} from './schemas/categoria.schema';
import {JogadorSchema} from './schemas/jogador.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
