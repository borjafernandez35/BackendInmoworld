/* eslint-disable */
import { ObjectId} from "mongoose"


export interface IReview {
    user: ObjectId,
    property: ObjectId,
    date: Date,
    rating: number, 
    description: string
}