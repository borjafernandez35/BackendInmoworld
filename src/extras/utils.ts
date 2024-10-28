import { IUser } from '../user/model'
/* eslint-disable */
const parseName = (nameFromRequest:any):string =>{
    if(!isString(nameFromRequest)){
        throw new Error ('Incorrect or missing name')
    }

    return nameFromRequest
}

const parseMail = (mailFromRequest:any):string =>{
    if(!isString(mailFromRequest)){
        throw new Error ('Incorrect or missing mail')
    }
    
    return mailFromRequest
}

const parsePassword = (passwordFromRequest:any):string =>{
    if(!isString(passwordFromRequest)){
        throw new Error ('Incorrect or missing password')
    }
    
    return passwordFromRequest
}

/* const parseComment = (commentFromRequest:any):string =>{
    if(!isString(commentFromRequest)){
        throw new Error ('Incorrect or missing comment')
    }
    
    return commentFromRequest
} */

const isString = (string:any):boolean => {
    return typeof string == 'string' || string instanceof String
}
const toNewUser = (object:any): IUser => {
    const newUser: IUser = {
        name: parseName(object.name),
        email: parseMail(object.email),
        password: parsePassword(object.password),
        //comment: parseComment(object.comment),
        //experince: []
    }
    return newUser
}

export default toNewUser