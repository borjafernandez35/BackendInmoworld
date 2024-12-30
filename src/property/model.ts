/* eslint-disable */
import  mongoose from "mongoose";

export interface IProperty{
    _id?: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId,
    //latitude?: number,
    //longitude?:number,
    description?: String,
    location?: IPoint,
    price: number,
    imageUrl?: String[],
    //rating?: number,
    //picture: [string]
}

interface IPoint {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  }
   

