
export default class UtilsRabbitmq{
 async successEmail(context){
    const channel = context.getChannelRef();
	const originalMsg = context.getMessage(); 
   return await channel.ack(originalMsg)
    }
}