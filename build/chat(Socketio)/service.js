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
        socket.on('sendMessage', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const parsedData = JSON.parse(data);
                const chat = new schema_1.default({
                    receiver: parsedData.receiver, // Usa el ID del socket como usuario
                    sender: parsedData.sender,
                    message: parsedData.message,
                    date: parsedData.timestamp
                });
                // Guarda en la base de datos
                yield chat.save();
                console.log('Mensaje guardado en la base de datos:', chat);
                // Reenvía el mensaje
                socket.broadcast.to(parsedData.receiverId).emit('message-receive', {
                    receiver: chat.receiver,
                    sender: socket.id,
                    message: chat.message,
                    timestamp: chat.date,
                });
            }
            catch (error) {
                console.error('Error procesando el mensaje:', error);
            }
        }));
    });
};
exports.default = socketService;
