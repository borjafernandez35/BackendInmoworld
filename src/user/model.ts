/* eslint-disable */
import mongoose from 'mongoose';



export interface IUser {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    //birthday?: Date;
    password: string;
    //avatar?:string,
    //comment: string,
    isAdmin?: boolean; 
   property?: mongoose.Types.ObjectId[];
}
