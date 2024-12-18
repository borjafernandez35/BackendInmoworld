"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable */
const socket_io_1 = require("socket.io");
const service_1 = __importDefault(require("../chat(Socketio)/service"));
const initializeSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Permitir conexiones de cualquier origen
            methods: ["GET", "POST"], // Métodos permitidos
        },
    });
    // Logs para verificar que el servidor está inicializado correctamente
    console.log("WebSocket server iniciado y escuchando conexiones...");
    // Pasar la instancia de io al servicio de sockets
    (0, service_1.default)(io);
    // Eventos globales de conexión y error
    io.on("connection", (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id}`);
        socket.on("disconnect", (reason) => {
            console.log(`Cliente desconectado (${socket.id}): ${reason}`);
        });
        socket.on("error", (error) => {
            console.error(`Error en el cliente ${socket.id}: ${error}`);
        });
    });
};
exports.default = initializeSocket;
