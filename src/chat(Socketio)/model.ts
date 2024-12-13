/* eslint-disable */
import mongoose, { Document } from 'mongoose';

export interface IChat  extends Document {
    receiver: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    message: string;
    date: Date;
  }
