import { ObjectId} from "mongoose"


export interface IReview {
    user: ObjectId,
    property: ObjectId,
    date: Date,
    description: string
}