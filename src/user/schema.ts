import mongoose, { Schema } from "mongoose";
//import { IUser } from './model'

export const schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    //birthday: {type: String, required: false},
    //avatar:{type: String, required: false},
    property: [{type: Schema.Types.ObjectId,required: false, ref:'property'}],
    password: {type: String, required: true},
    //comment: {type: String, required: false}
})

export default mongoose.model('user',schema)