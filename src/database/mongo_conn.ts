/* eslint-disable */
 import { connect, connection } from 'mongoose';

export async function run() {
   
    //await connect('mongodb://localhost:27017/InmoWorld')
   

    await connect('mongodb://mongodb:27017/InmoWorld')
   
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