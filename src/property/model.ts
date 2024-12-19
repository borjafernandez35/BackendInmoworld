/* eslint-disable */
import  mongoose from "mongoose";

export interface IProperty{
    //_id?: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId,
    address: string,
    description?: String,
    location?: IPoint; 
    //rating?: number,
    //coordinate?: [number,number],
    //picture: [string]
}

interface IPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  }