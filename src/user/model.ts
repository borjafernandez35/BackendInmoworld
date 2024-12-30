/* eslint-disable */
import mongoose from 'mongoose';



export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    birthday: Date;
    password: string;
    //avatar?:string,
    //comment: mongoose.Types:ObjectId,
    isAdmin?: boolean; 
   property?: mongoose.Types.ObjectId[];
   location?: IPoint;
}

interface IPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  }
