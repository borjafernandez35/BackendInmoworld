/* eslint-disable */
import {  Types } from 'mongoose';
import { IUser } from './model';
import user from './schema';
import * as bcrypt from 'bcrypt';
//import userData from './users.json'

export const getEntries = {
    getAll: async()=>{
    return await user.find();
    },
    findById: (_id: string) => {
      console.log('el _id es:',_id);
      return user.findById(_id); 
    },
    findByIdUser:(_id: Types.ObjectId)=>{console.log('el _id es:',_id);
      return user.findById(_id);},
    findByName: async(username: string) => {
      return await user.findOne({ name: username })
    },
    encryptPassword: async(password: string)=> {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    },
  
  validatePassword:(password: string, person: string)=> {
      return bcrypt.compare(password, person);
    },

    create: async (entry: IUser) => {
      console.log('ccrrrrrrreeeeeeaaaattteeeeeeeee:',entry);
      try {
      return await user.create(entry); 
      } catch (error) {
        throw error;
      }
    },

    createUserGoogle: async (user_params: IUser)=> {
      try {
        // Verificar si ya existe un usuario con el mismo correo electrónico
        const existingUser = await user.findOne({ email: user_params.email });
        if (existingUser) {
          throw new Error('User with this email already exists');
        }
    
        // Si no existe, proceder con la creación del usuario
        const session = new user(user_params);
           
        const result = await session.save();
        const newUser: IUser = { ...result.toObject(), _id: result._id };
        return newUser;
      } catch (error) {
        throw error;
      }
    },


    update: async(id:string,body:object)=>{
        console.log(body);
        return await user.findByIdAndUpdate(id,body,{$new:true});
    },
    updateUser: async(user_params: IUser, user_filter: any): Promise<void> =>{
        try {
          await user.findOneAndUpdate(user_filter, user_params);
        } catch (error) {
          throw error;
        }
      },
    filterUser: async(query: any): Promise<IUser >=> {
        try {
          console.log("que hay aqui",query);
          const activeQuery = { ...query, active: true };
          console.log("activeeeeee",activeQuery);
          return await user.findOne(activeQuery);
        } catch (error) {
          throw error;
        }
      },

      filterUserEmail: async(email:string): Promise<IUser | null>=> {
        try {
          
          return await user.findOne({ email: email });
        } catch (error) {
          throw error;
        }
      },



      checkEmailExists: async(email: string): Promise<boolean>=> {
        try {
          const existingUser = await user.findOne({ email: email });
          return !!existingUser; // Devuelve true si existe el usuario, false si no existe
        } catch (error) {
          throw error;
        }
      },

    delete: async(id:string)=>{
        return await user.findByIdAndDelete(id);
    },
    deleteUser:async(_id: string): Promise<{ deletedCount: number }> =>{
        try {
          
    
          // Luego, eliminar al usuario
          const query = { _id: _id };
          const update = { active: false };
          const result = await user.updateOne(query, update);
    
          return { deletedCount: result.modifiedCount };
        } catch (error) {
          throw error;
        }
      },

    addProperty: async(idUser:string,idExp:string)=>{
        return await user.findByIdAndUpdate(idUser,{$addToSet:{property:idExp}});
    },
    delProperty: async(idUser:string,idExp:string)=>{
        return await user.findByIdAndUpdate(idUser,{$pull:{property:idExp}});
    }
}