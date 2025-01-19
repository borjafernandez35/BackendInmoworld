/* eslint-disable */
import mongoose, { Schema } from 'mongoose';
import {IUser} from './model';



const schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  birthday:{type:Date,required:true},
  isAdmin: { type: Boolean, default: false },
  property: [{ type: Schema.Types.ObjectId, ref: 'properties', required:false }],
  imageUser:[{type: String, required: false}],
  //comment: [{ type: Schema.Types.ObjectId, ref: 'reviews', required:false }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  }
});



export default mongoose.model<IUser>('user', schema);
