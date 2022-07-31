const zenvia = require('zenvia');
const Promise = require('bluebird');

export default class ZenviaService{
  constructor(){}
  async sendSms(){
      Promise.promisifyAll(zenvia);
      try {
        return await zenvia.sendAsync({
            to: '5585992590075',
            from: 'agenda0',
            msg: 'Não se esqueça do seu compromisso amanhã às 16h com Pedro. Veja mais em: https://ag0.io/asdfdf',
          });
        
      } catch (error) {
        console.log(error);
        
      }
    }
}