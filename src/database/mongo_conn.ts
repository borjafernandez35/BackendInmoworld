/* eslint-disable */
import { connect, connection } from 'mongoose';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

export async function run() {
    const mongoURI = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`;

    await connect(mongoURI)
        .then(() => {
            console.log('Database connected!!');
        })
        .catch((err) => {
            console.error('Error connecting to database:', err);
        });
}

export function endConn() {
    connection.close();
}