/* eslint-disable */
import { Document } from 'mongoose';

export interface IChat  extends Document {
    receiver: string;
    sender: string;
    message: string;
    date: Date;
  }
