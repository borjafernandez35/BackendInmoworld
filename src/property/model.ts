/* eslint-disable */
import  mongoose from "mongoose";

export interface IProperty{
    //_id?: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId,
    address: string,
    description?: String,
    //rating?: number,
    //coordinate?: [number,number],
    //picture: [string]
}