import { Server } from 'socket.io';


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
          console.log(chatSchema);
      
          socket.broadcast.to("some room").emit('message-receive', chatSchema);
        });
    
        socket.on('sendMessage', async (data: string) => {
          const chatSchema: { date: Date; message: string } = {
              date: new Date(), // Asigna la fecha actual
              message: data // Asigna el mensaje
          };
          console.log(chatSchema);
      
          socket.broadcast.to("some room").emit('message-receive', chatSchema); // Envía el objeto chat
      });
      
      });
};

export default socketService;