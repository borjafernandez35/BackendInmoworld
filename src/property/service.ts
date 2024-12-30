/* eslint-disable */
//import { IProperty } from './model';
import { Types } from 'mongoose';
import { IProperty } from './model';
import{IUser}from '../user/model';
import properties from './schema';
import user from '../user/schema';

export const getEntries = {
    getAll: async( user_model: IUser, distance: number): Promise<IProperty[] | null>=> {
      try {
        const currentDate = new Date(); 
          console.log(currentDate);
    return await properties.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [user_model.location?.coordinates[0], user_model.location?.coordinates[1]] // User's coordinates
          },
          $maxDistance: distance // Specify the maximum distance (radius)
        }
      },
      //active: true,
     // date: { $gte: currentDate}
    }) as unknown as
      | IProperty[]
      | null;
  } catch (error) {
    console.error('Error en getAll:', error);
    return null;
  }
},
    findById: async(id:string)=>{
        return await properties.findById(id);
    },
    filterProperty: async(query: any): Promise<IProperty | null>=> {
        try {
            return await properties.findOne(query);
        } catch (error) {
            throw error;
        }
    },

    addPropertyToUser: async(userId: Types.ObjectId, activityId: Types.ObjectId): Promise<void> => {
        try {
          console.log('estoy en addproperty to UUUUSSSEERRR!!!!',userId);
            // Retrieve the user document by ID
            const userDoc = await user.findById(userId);
            
            if (!userDoc) {
                throw new Error('User not found');
            }
    
            // Verifica si 'property' está definido y es un array. Si no, inicializa un array vacío.
            if (!Array.isArray(userDoc.property)) {
                userDoc.property = [];
            }
    
            // Agrega el ID de la actividad a la propiedad 'property' del usuario
            userDoc.property.push(activityId);
    
            // Guarda el documento de usuario actualizado
            await userDoc.save();
        } catch (error) {
            console.log(error);
            throw error;
        }    
    },

    findUserById: async(id:string)=>{
        return await properties.findById(id).populate('owner');
    },
    addParticipant: async(idExp:string,idPart:string)=>{
        return await properties.findByIdAndUpdate(idExp,{$addToSet:{participants:idPart}});
    },
    delParticipant: async(idExp:string,idPart:string)=>{
        return await properties.findByIdAndUpdate(idExp,{$pull:{participants:idPart}});
    },
   /*  create: async(entry:IProperty)=>{
      console.log('estoy en la creación de una PROPIEDAD!!!!',entry);
   try {
         return await property.create(entry); 
         } catch (error) {
           throw error;
         }
       }, */
        create: async(property_data: IProperty): Promise<IProperty>=>{
        try {
          if (!property_data.location || !property_data.location.coordinates) {
            throw new Error('Datos de ubicación incompletos');
          }
          console.log('ESTOY DENTROOOOO DEL TRY!!!!');
          const session = new properties(property_data);
          console.log('la sesion eeeessss....!!!!',session);
          // Valida los datos antes de guardar
          const validationError = session.validateSync();
          if (validationError) {
               throw new Error(`Datos inválidos: ${validationError.message}`);
           }

          console.log('Creando la sesión:', session);
          const result = await session.save();
          console.log('sesion GUARDADA!!!!!!',result);
          const newProperty: IProperty = { ...result.toObject(), _id: result._id };
          return newProperty;
        } catch (error) {
          console.log('error',error);
          throw error;
        }
      },
    update: async(id:string,body:object)=>{
        console.log(body);
        return await properties.findByIdAndUpdate(id,body,{$new:true});
    },
    updateProperty: async(property_params: IProperty, property_filter: any): Promise<void>=> {
        try {
            await properties.findOneAndUpdate(property_filter, {$set: property_params }, { new: true });
        } catch (error) {
            throw error;
        }
    },



    delete: async(id:string)=>{
        await user.updateMany(
            {},
            { $pull: { property: id } },
        );
        return await properties.findByIdAndDelete(id);
    },
    
getByName: async(user: IUser, distance: number, search: string): Promise<IProperty[] | null >=> {
        try {
          const currentDate = new Date();
          return properties.find({
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [user.location?.coordinates[0], user.location?.coordinates[1]] // User's coordinates
                },
                $maxDistance: distance // Specify the maximum distance (radius)
              }
            },
            active: true,
            "name": { "$regex": search, "$options": "i" },
            date: { $gt: currentDate}
          }) as unknown as
            | IProperty[]
            | null;
        } catch (error) {
          console.error('Error en getAll:', error);
          return null;
        }
      },

      sortProperties(list_properties: IProperty[], sortBy: String): IProperty[] {
        try {
            let sortedProperties: IProperty[] = [];
            console.log('la lista de propiedades son.......!!!!',list_properties);
    
            if (!sortBy || sortBy.trim() === "") {  
                // Si sortBy está vacío o es null, devolvemos las propiedades sin ordenar
                sortedProperties = list_properties.slice();
            } else if (sortBy === "Proximity") {
                sortedProperties = list_properties.slice();
            } else if (sortBy === "Price") {
                sortedProperties = list_properties
                    .slice()
                    .sort((a, b) => b.price - a.price);
            } else {
                // Si el parámetro es inválido, lanzar un error
                throw new Error("Invalid sortBy parameter: " + sortBy);
            }
    
            return sortedProperties;
        } catch (error) {
            console.error("Error sorting properties:", error);
            return []; // Retornar un arreglo vacío o manejar el error de otra manera apropiada
        }
    }
    
}