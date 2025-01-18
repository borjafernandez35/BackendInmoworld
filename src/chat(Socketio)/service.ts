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
    
        /* socket.on('sendMessage', async (data: string) => {
          try {
            const parsedData = JSON.parse(data);

            console.log('ESTAMOS EN SEND MESSAGE!!!!!!');
        
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
          // Emitir notificación de nuevo mensaje al receptor
            socket.broadcast.to(parsedData.receiver).emit('new-message', {
            sender: parsedData.sender,
            message: parsedData.message,
            });


          } catch (error) {
            console.error('Error procesando el mensaje:', error);
          }
        }); */ 
        
          // Evento para enviar mensajes
    socket.on('sendMessage', async (data) => {
      try {
        const parsedData = JSON.parse(data);

        const chat = new ChatSchema({
          receiver: parsedData.receiver,
          sender: parsedData.sender,
          message: parsedData.message,
          date: parsedData.timestamp,
        });

        // Guardar mensaje en la base de datos
        await chat.save();

        // Reenviar mensaje al receptor
        io.to(parsedData.receiverId).emit('message-receive', {
          receiver: chat.receiver,
          sender: chat.sender,
          message: chat.message,
          timestamp: chat.date,
        });

        // Emitir notificación de nuevo mensaje
        io.to(parsedData.receiverId).emit('new-message', {
          sender: parsedData.sender,
          message: parsedData.message,
        });
      } catch (error) {
        console.error('Error procesando el mensaje:', error);
      }
    });


    // Evento para cargar mensajes históricos
    socket.on('load-messages', async (userId) => {
      try {
        const messages = await ChatSchema.find({
          $or: [{ sender: userId }, { receiver: userId }],
        }).sort({ date: -1 });

        socket.emit('load-messages-response', messages);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
        socket.emit('error', { message: 'Error al cargar mensajes' });
      }
    });

    // Evento para marcar mensajes como leídos
    socket.on('mark-as-read', async ({ userId, senderId }) => {
      try {
        await ChatSchema.updateMany(
          { receiver: userId, sender: senderId, read: false },
          { $set: { read: true } }
        );
        socket.emit('mark-as-read-success');
      } catch (error) {
        console.error('Error al marcar mensajes como leídos:', error);
        socket.emit('error', { message: 'Error al marcar mensajes' });
      }
    });

    // Evento para contar mensajes no leídos
    socket.on('unread-count', async (userId) => {
      try {
        const unreadCount = await ChatSchema.countDocuments({
          receiver: userId,
          read: false,
        });
        socket.emit('unread-count-response', { unreadCount });
      } catch (error) {
        console.error('Error al contar mensajes no leídos:', error);
        socket.emit('error', { message: 'Error al contar mensajes' });
      }
    });

      });
};

export default socketService;