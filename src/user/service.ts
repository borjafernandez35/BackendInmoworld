import { IUser } from './model';
import user from './schema';
//import userData from './users.json'

export const getEntries = {
    getAll: async()=>{
    return await user.find();
    },
    findById: async(_id:string)=>{
        return await user.findById(_id);
    },
    create: async(entry:object)=>{
        console.log(entry);
        return await user.create(entry);
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