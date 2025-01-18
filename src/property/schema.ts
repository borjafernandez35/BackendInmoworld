/* eslint-disable */
import mongoose, { Schema } from "mongoose";
import { IProperty } from './model'

export const schema = new Schema<IProperty>({
    owner: {type: Schema.Types.ObjectId, ref:'user', required: true},
    price:{type:Number, required:true},
    description: {type: String, required: false},
    imageUrl:[{type: String, required: false}],
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
        }
      },    
    //rating: {type: Number, required: false},
    //coordinate: [{type: Number, required: false}],
    
})

// Index for geospatial queries
schema.index({ location: '2dsphere' });

export default mongoose.model('properties',schema)