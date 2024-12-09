/* eslint-disable */
import mongoose from 'mongoose';

export default interface IJwtPayload {
    id: mongoose.Types.ObjectId
    isAdmin: boolean
  }