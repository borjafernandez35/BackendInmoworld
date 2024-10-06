import mongoose, { Schema } from "mongoose";

export const schema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  property: { type: Schema.Types.ObjectId, required: true, ref: 'property' },
  date: { type: String, required: true },
  description: { type: String, required: true }
})

export default mongoose.model('review', schema)
