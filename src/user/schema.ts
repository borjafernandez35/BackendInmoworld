import {model, Schema } from "mongoose";
import { usersInterface } from './model'

export const usersSchema = new Schema<usersInterface>({
    id: Number,
    name: String,
    mail: String,
    experince: [{type: Schema.Types.ObjectId, ref:'experince'}],
    password: String,
    comment: String
})

export const usersofDB = model<usersInterface>('user',usersSchema)