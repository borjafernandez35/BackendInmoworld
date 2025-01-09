/* eslint-disable */
import { Server } from 'socket.io';
import ChatSchema from './schema';

// Mapa para asociar userId con socket.id
const userSocketMap: Map<string, string> = new Map();

// Set para rastrear todos los socket.id conectados
const connectedUser = new Set();

const socketService = (io: Server) => {
    io.on('connection', (socket) => {
        console.log('Usuario conectado con socket.id:', socket.id);

        // Agregar socket.id al Set global
        connectedUser.add(socket.id);
        io.emit('connected-user', connectedUser.size); // Notifica el total de usuarios conectados

        // Registrar el userId con el socket.id
        socket.on('register-user', (userId) => {
            userSocketMap.set(userId, socket.id);
            console.log(`Usuario ${userId} registrado con socket.id ${socket.id}`);
        });

        // Enviar mensaje a un destinatario específico
        socket.on('sendMessage', async (data: string) => {
            try {
                const parsedData = JSON.parse(data);
                const { sender, receiver, message, timestamp } = parsedData;

                // Guardar mensaje en la base de datos
                const chat = new ChatSchema({
                    receiver,
                    sender,
                    message,
                    date: timestamp,
                });
                await chat.save();
                console.log('Mensaje guardado en la base de datos:', chat);

                // Reenviar el mensaje al destinatario
                const receiverSocketId = userSocketMap.get(receiver); // Obtener socket.id del receptor
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('message-receive', {
                        receiver: chat.receiver,
                        sender: chat.sender,
                        message: chat.message,
                        timestamp: chat.date,
                    });
                    console.log(`Mensaje enviado a usuario ${receiver} con socket.id ${receiverSocketId}`);
                } else {
                    console.log(`Usuario ${receiver} no está conectado ${receiverSocketId}`);
                }
            } catch (error) {
                console.error('Error procesando el mensaje:', error);
            }
        });

        // Manejar desconexión
        socket.on('disconnect', () => {
            console.log('Socket desconectado:', socket.id);

            // Eliminar socket.id del Set global
            connectedUser.delete(socket.id);

            // Eliminar userId asociado al socket.id
            for (const [userId, id] of userSocketMap.entries()) {
                if (id === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`Usuario ${userId} eliminado del mapa`);
                    break;
                }
            }

            // Notificar la desconexión
            io.emit('connected-user', connectedUser.size);
        });

        // Desconexión manual
        socket.on('manual-disconnect', () => {
            console.log('Desconexión manual solicitada por el usuario', socket.id);
            socket.disconnect();
        });

        // Escuchar mensajes generales (opcional)
        socket.on('message', (data: string) => {
            const chatSchema = {
                date: new Date(),
                message: data,
            };
            console.log('Mensaje recibido:', chatSchema);

            // Emitir mensaje a todos los usuarios en "some room"
            socket.broadcast.to('some room').emit('message-receive', chatSchema);
        });
    });
};

export default socketService;
