import mongoose, { ObjectId } from "mongoose"


export interface IUser{
    //_id?: mongoose.Types.ObjectId;
    name: string,
    email: string,
    //birthday?: Date,
    password: string,
    //avatar?:string,
    //comment: string,
    property?: ObjectId[]
}
//export type UsersInterfacePublicInfo = Pick<usersInterface, 'id' | 'name' | 'comment'>
//export type newUserInfo = Omit<usersInterface>