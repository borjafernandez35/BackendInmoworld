"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = __importDefault(require("./schema"));
const connectedUser = new Set();
const socketService = (io) => {
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
        socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const chatSchema = {
                date: new Date(), // Asigna la fecha actual
                message: data // Asigna el mensaje
            };
            console.log("Entra en message ", chatSchema);
            socket.broadcast.to("some room").emit('message-receive', chatSchema);
        }));
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
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const parsedData = JSON.parse(data);
                const chat = new schema_1.default({
                    receiver: parsedData.receiver,
                    sender: parsedData.sender,
                    message: parsedData.message,
                    date: parsedData.timestamp,
                });
                // Guardar mensaje en la base de datos
                yield chat.save();
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
            }
            catch (error) {
                console.error('Error procesando el mensaje:', error);
            }
        }));
        // Evento para cargar mensajes históricos
        socket.on('load-messages', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const messages = yield schema_1.default.find({
                    $or: [{ sender: userId }, { receiver: userId }],
                }).sort({ date: -1 });
                socket.emit('load-messages-response', messages);
            }
            catch (error) {
                console.error('Error al cargar mensajes:', error);
                socket.emit('error', { message: 'Error al cargar mensajes' });
            }
        }));
        // Evento para marcar mensajes como leídos
        socket.on('mark-as-read', (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, senderId }) {
            try {
                yield schema_1.default.updateMany({ receiver: userId, sender: senderId, read: false }, { $set: { read: true } });
                socket.emit('mark-as-read-success');
            }
            catch (error) {
                console.error('Error al marcar mensajes como leídos:', error);
                socket.emit('error', { message: 'Error al marcar mensajes' });
            }
        }));
        // Evento para contar mensajes no leídos
        socket.on('unread-count', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const unreadCount = yield schema_1.default.countDocuments({
                    receiver: userId,
                    read: false,
                });
                socket.emit('unread-count-response', { unreadCount });
            }
            catch (error) {
                console.error('Error al contar mensajes no leídos:', error);
                socket.emit('error', { message: 'Error al contar mensajes' });
            }
        }));
    });
};
exports.default = socketService;
