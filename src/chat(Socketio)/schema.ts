/* eslint-disable */
import mongoose, { Schema } from "mongoose";
import { IChat } from './model'


const chatSchema: Schema = new Schema({
    receiver: { type: Schema.Types.ObjectId,ref:'user', required: true },
    sender: { type: Schema.Types.ObjectId,ref:'user', required: true },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false } 
  });
  
   export default mongoose.model<IChat>('chat', chatSchema);