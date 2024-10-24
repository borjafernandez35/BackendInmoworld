import { Request, Response } from 'express';
import { IProperty } from '../property/model';
import * as propertiesServices from '../property/service';
//import * as usersServices from '../user/service';

export class propertyController {


    public async createProperty(req: Request, res: Response) {
        try{
            // this check whether all the filds were send through the request or not
            if (req.body.address  && req.body.description && req.body.owner){
                const activity_params:IProperty = {
                    address: req.body.address,
                    //rating: 0,
                    description: req.body.description,
                    owner: req.body.owner,
                    //picture:req.body.picture
                    //active: true
                };
                const activity_data = await propertiesServices.getEntries.create(activity_params);
                await propertiesServices.getEntries.addPropertyToUser(req.body.owner, activity_data._id);
                return res.status(201).json({ message: 'Activity created successfully', activity: activity_data });
            }else{            
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /* public async getProperty(req: Request, res: Response) {
        try{
            if (req.params.id) {
                const activity_filter = { _id: req.params.id };
                // Fetch user
                const post_data = await this.activity_service.populateActivityCommentsUser(activity_filter);
                // Send success response
                return res.status(200).json({ data: post_data, message: 'Successful'});
            } else {
                return res.status(400).json({ error: 'Missing fields' });
            }
        }catch(error){
            return res.status(500).json({ error: 'Internal server error' });
        }
    } */

    public async getAll(req: Request, res: Response) {
        try {
            console.log("funciona get all");
            //const activity_filter = {};
            const property_data = await propertiesServices.getEntries.getAll();
            let total=property_data.length;
            const page = Number(req.params.page); // Convertir a número
            const limit = Number(req.params.limit); // Convertir a número
           
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            let totalPages= Math.ceil(total/limit);
    
            
            const resultProperty = property_data.slice(startIndex, endIndex);
            console.log(resultProperty, totalPages,total);
            return res.status(200).json({properties:resultProperty,totalPages:totalPages,totalActivity:total});
            
        } catch (error) {
            
            console.error('Error en la solicitud:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    public async deleteProperty(req: Request, res: Response) {
        const propertyId = req.params.id;

    return propertiesServices.getEntries.delete(propertyId)
        .then((property) => (property ? res.status(201).json({ property, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
    }

    public async updateProperty(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const property_filter = { _id: req.params.id };
                // Fetch user
                const activity_data = await propertiesServices.getEntries.filterProperty(property_filter);
                if (!activity_data) {
                    // Send failure response if user not found
                    return res.status(400).json({ error: 'Activity not found'});
                }
    
                const property_params: IProperty = {
                    address: req.body.address,
                    //rating: req.body.rating,
                    description: req.body.description,
                    owner: req.body.owner,
                    //picture: req.body.picture
                    //active: true
                };
                const property_data = await propertiesServices.getEntries.create(property_params);
                await propertiesServices.getEntries.addPropertyToUser(req.body.owner, property_data._id);
                await propertiesServices.getEntries.updateProperty(property_params, property_filter);
                //get new activity data
                const new_activity_data = await propertiesServices.getEntries.filterProperty(property_filter);
                // Send success response
                
                return res.status(200).json({ data: new_activity_data, message: 'Successful update'});
            } else {
                // Send error response if ID parameter is missing
                return res.status(400).json({ error: 'Missing ID parameter' });
            }
        } catch (error) {
            // Catch and handle any errors
            console.error("Error updating:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    
} 