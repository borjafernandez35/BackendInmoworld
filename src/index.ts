/* eslint-disable */
import express, { RequestHandler } from 'express';
import cors from 'cors';
import chatRouter from './routes/chats';
import userRouter from './routes/user';
import authRouter from './routes/auth';
import propertyRouter from './routes/property';
import reviewRouter from './routes/review';
import { run } from './database/mongo_conn';
import initializeSocket from './routes/chat';


const app = express();
app.use(express.json());
run();

app.use(cors());
app.use(express.json() as RequestHandler);

// Utilizar el puerto desde la variable de entorno o establecer un valor predeterminado
const PORT = 3000;

app.get('/ping', (_req, res) => {
    console.log('ping recibido correctamente');
    res.send('pinged');
});

app.use('/user', userRouter);
app.use('/property', propertyRouter);
app.use('/review', reviewRouter);
app.use('/auth', authRouter);
app.use('/chats', chatRouter);

const server = app.listen(PORT, () => {
    console.log('el servidor está escuchando en el puerto ' + PORT);
});
initializeSocket(server);
