//import { IProperty } from './model';
import { Types } from 'mongoose';
import { IProperty } from './model';
import property from './schema';
import user from '../user/schema';

export const getEntries = {
    getAll: async()=>{
    return await property.find();
    },
    findById: async(id:string)=>{
        return await property.findById(id);
    },
    filterProperty: async(query: any): Promise<IProperty | null>=> {
        try {
            return await property.findOne(query);
        } catch (error) {
            throw error;
        }
    },

    addPropertyToUser: async(userId: Types.ObjectId, activityId: Types.ObjectId): Promise<void>=> {
        try {
            // Retrieve the user document by ID
            const users = await user.findById(userId);
            if (!users) {
                throw new Error('User not found');
            }

            // Add the post ID to the user's array of posts
            users.property.push(activityId);

            // Save the updated user document
            await users.save();
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    findUserById: async(id:string)=>{
        return await property.findById(id).populate('owner');
    },
    addParticipant: async(idExp:string,idPart:string)=>{
        return await property.findByIdAndUpdate(idExp,{$addToSet:{participants:idPart}});
    },
    delParticipant: async(idExp:string,idPart:string)=>{
        return await property.findByIdAndUpdate(idExp,{$pull:{participants:idPart}});
    },
    create: async(entry:object)=>{
        return await property.create(entry);
    },
    update: async(id:string,body:object)=>{
        console.log(body);
        return await property.findByIdAndUpdate(id,body,{$new:true});
    },
    updateProperty: async(property_params: IProperty, property_filter: any): Promise<void>=> {
        try {
            await property.findOneAndUpdate(property_filter, {$set: property_params }, { new: true });
        } catch (error) {
            throw error;
        }
    },

    delete: async(id:string)=>{
        return await property.findByIdAndDelete(id);
    }
}