/* eslint-disable */
import mongoose from "mongoose"


export interface IReview {
    user: mongoose.Types.ObjectId,
    property: mongoose.Types.ObjectId,
    date: Date,
    description: string
}