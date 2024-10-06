import mongoose, {ObjectID} from "mongoose"
import IUser from "../user/model.ts"
import IProperty from "../property/model.ts"

export interface IReview {
    user: ObjectId,
    property: ObjectId,
    date: string,
    description: string
}