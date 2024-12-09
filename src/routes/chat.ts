/* eslint-disable */
import { Server } from 'socket.io';
import socketService from '../chat(Socketio)/service';

const initializeSocket = (server: any) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // Permitir conexiones de cualquier origen
            methods: ["GET", "POST"], // Métodos permitidos
        },
    });

    // Logs para verificar que el servidor está inicializado correctamente
    console.log("WebSocket server iniciado y escuchando conexiones...");

    // Pasar la instancia de io al servicio de sockets
    socketService(io);

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

export default initializeSocket;