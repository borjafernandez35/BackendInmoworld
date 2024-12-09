/* eslint-disable */
import { Server } from 'socket.io';
import ChatSchema from './schema';

const connectedUser = new Set();

const socketService = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Connected successfully', socket.id);
        socket.join("some room");
        connectedUser.add(socket.id);
        io.to("some room").emit('connected-user', connectedUser.size);
    
        socket.on('disconnect', () => {
          console.log('Disconnected successfully', socket.id);
          connectedUser.delete(socket.id);
          io.to("some room").emit('connected-user', connectedUser.size);
        });
    
        socket.on('manual-disconnect', () => {
          console.log('Manual disconnect requested', socket.id);
          socket.disconnect();
        });
    
        socket.on('message',async (data: string) => {
          const chatSchema: { date: Date; message: string } = {
              date: new Date(), // Asigna la fecha actual
              message: data // Asigna el mensaje
          };
          console.log("Entra en message ",chatSchema);
      
          socket.broadcast.to("some room").emit('message-receive', chatSchema);
        });
    
        socket.on('sendMessage', async (data: string) => {
          try {
            const parsedData = JSON.parse(data);
        
            const chat = new ChatSchema({
              receiver: parsedData.receiver, // Usa el ID del socket como usuario
              sender: parsedData.sender,
              message: parsedData.message,
              date: parsedData.timestamp
            });
        
            // Guarda en la base de datos
            await chat.save();
            console.log('Mensaje guardado en la base de datos:', chat);
        
            // Reenvía el mensaje
            socket.broadcast.to(parsedData.receiverId).emit('message-receive', {
              receiver: chat.receiver,
              sender: socket.id,
              message: chat.message,
              timestamp: chat.date,
            });
          } catch (error) {
            console.error('Error procesando el mensaje:', error);
          }
        });   
      });
};

export default socketService;