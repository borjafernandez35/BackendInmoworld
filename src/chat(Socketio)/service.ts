/* eslint-disable */

import { Server } from 'socket.io';
import ChatSchema from './schema';
import mongoose from 'mongoose';
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
                    
                    // Emitir notificación de nuevo mensaje
                    io.to(receiverSocketId).emit('new-message', {
                        sender: parsedData.sender,
                        message: parsedData.message,
                    });
                } else {
                    console.log(`Usuario ${receiver} no está conectado ${receiverSocketId}`);
                    const unreadCount = await ChatSchema.countDocuments({
                        receiver: parsedData.receiverId,
                        read: false,
                    });
                    socket.emit('unread-count-response', { unreadCount });
                }
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

        // Ultimo mensaje
        socket.on('last-message', async (userId) => {
            try {
                console.log('userId: ', userId);
                console.log('llega la llamada a last-message');
                // Usamos una agregación en MongoDB para obtener el último mensaje de cada remitente
                const messages = await ChatSchema.aggregate([
                { $match: { receiver: new mongoose.Types.ObjectId(userId) } }, // Convertir userId a ObjectId
                { $sort: { date: -1 } }, // Ordenar por la fecha del mensaje (más reciente primero)
                { 
                    $group: { 
                    _id: "$sender", // Agrupar por el campo 'sender'
                    lastMessage: { $first: "$$ROOT" } // Obtener el mensaje más reciente del grupo
                    }
                },
                { 
                    $project: { 
                    _id: 0,
                    sender: "$_id",
                    message: "$lastMessage.message",
                    timestamp: "$lastMessage.date" // Asegúrate de usar 'date' en lugar de 'timestamp'
                    }
                }
                ]);
             
                // Emitimos los mensajes al cliente
                console.log('last message list: ', messages)
                socket.emit('last-message-response', messages);
            } catch (error) {
                console.error('Error al cargar el último mensaje: ', error);
                socket.emit('error', { message: 'Error al cargar el último mensaje' });
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

        // Escuchar el evento "typing" del remitente
        socket.on('typing', ({ receiver }) => {
            const receiverSocketId = userSocketMap.get(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing', { sender: socket.id });
            }
        });

        // Escuchar el evento "stop-typing" del remitente
        socket.on('stop-typing', ({ receiver }) => {
            const receiverSocketId = userSocketMap.get(receiver);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('stop-typing', { sender: socket.id });
            }
        });

            });
        };

export default socketService;