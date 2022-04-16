import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

export interface atualizarCategoria extends Document {
    _id:string;
    categoria: string;
    descricao: string;
    eventos: Array<Evento>;
    jogadores: Array<Jogador>;

}

export interface Evento {
    nome: string;
    operacao: string;
    valor: number;
}