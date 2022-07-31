
import * as client from 'twilio';
import { Sms } from './interfaces/sms.interface';
import  axios from 'axios';

export default class Twilioservice {
    constructor() { }
    async sendMessageWhatsap(sms:Sms) {

        const options = {
            method: 'POST',
            url: 'https://maytapi-whatsapp.p.rapidapi.com/85992590075/sendMessage',
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': '10da73998dmsh17d3298ecf3fba7p176c78jsn55b84b0fbd02',
              'X-RapidAPI-Host': 'maytapi-whatsapp.p.rapidapi.com'
            },
            data: '{"to_number":"85992590075","type":"text","message":"Hello"}'
          };
          
         return await axios.request(options).then(function (response) {
              console.log(response.data);
              return response.data
          }).catch(function (error) {
              console.error(error);
          });
     }
 }