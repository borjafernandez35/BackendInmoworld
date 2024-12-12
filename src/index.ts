/* eslint-disable */
import express, { RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRouter from './routes/user';
import authRouter from './routes/auth';
import propertyRouter from './routes/property';
import reviewRouter from './routes/review';
import { run } from './database/mongo_conn';
import initializeSocket from './routes/chat';

dotenv.config();

const app = express();
app.use(express.json());
run();

app.use(cors());
app.use(express.json() as RequestHandler);

// Utilizar el puerto desde la variable de entorno o establecer un valor predeterminado
const PORT = process.env.PORT;

app.get('/ping', (_req, res) => {
    console.log('ping recibido correctamente');
    res.send('pinged');
});

app.use('/user', userRouter);
app.use('/property', propertyRouter);
app.use('/review', reviewRouter);
app.use('/auth', authRouter);

const server = app.listen(PORT, () => {
    console.log('el servidor está escuchando en el puerto ' + PORT);
});

initializeSocket(server);
