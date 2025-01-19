"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyController = void 0;
const propertiesServices = __importStar(require("../property/service"));
const userServices = __importStar(require("../user/service"));
//import * as usersServices from '../user/service';
class propertyController {
    createProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('CREATEEEEEEEEEE PROPERTYYYYYYYYY!!!!!!', req.body);
            try {
                // this check whether all the filds were send through the request or not
                if (req.body.owner && req.body.price && req.body.description && req.body.location) {
                    const property_params = {
                        location: req.body.location,
                        price: req.body.price,
                        description: req.body.description,
                        owner: req.body.owner,
                        imageUrl: req.body.imageUrl,
                        //active: true
                    };
                    console.log('LA PROPIEDAD EEEEESSSSSSSS EN CONTROLLER:', property_params);
                    const property_data = yield propertiesServices.getEntries.create(property_params);
                    console.log('los datos de la propiedad son......................', property_data);
                    yield propertiesServices.getEntries.addPropertyToUser(req.body.owner, property_data._id);
                    return res.status(201).json({ message: 'Property created successfully', property: property_data });
                }
                else {
                    return res.status(400).json({ error: 'Missing fields' });
                }
            }
            catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
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
    getAllMarkers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("funciona get all");
                const user_filter = { _id: req.userId };
                const user_data = yield userServices.getEntries.filterUser(user_filter);
                if (!user_data) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                const property_data = yield propertiesServices.getEntries.getAll(user_data, parseInt(req.params.distance, 10));
                console.log('PROPIEDADES!!!!!!!!!!!!', property_data);
                if (!property_data) {
                    return res.status(404).json({ message: 'propiedad no encontrada' });
                }
                let sortedProperties = property_data;
                if (req.params.sort && req.params.sort.trim() !== '') {
                    sortedProperties = propertiesServices.getEntries.sortProperties(property_data, req.params.sort);
                }
                console.log('las propiedades SON!!!!!!................:', sortedProperties);
                console.log(sortedProperties);
                return res.status(200).json({ properties: sortedProperties });
            }
            catch (error) {
                console.error('Error en la solicitud:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("funciona get all");
                const user_filter = { _id: req.userId };
                const user_data = yield userServices.getEntries.filterUser(user_filter);
                if (!user_data) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                const property_data = yield propertiesServices.getEntries.getAll(user_data, parseInt(req.params.distance, 10));
                console.log('PROPIEDADES!!!!!!!!!!!!', property_data);
                if (!property_data) {
                    return res.status(404).json({ message: 'propiedad no encontrada' });
                }
                let sortedProperties = property_data;
                if (req.params.sort && req.params.sort.trim() !== '') {
                    sortedProperties = propertiesServices.getEntries.sortProperties(property_data, req.params.sort);
                }
                console.log('las propiedades SON!!!!!!................:', sortedProperties);
                // Paginación
                const total = sortedProperties.length;
                const page = Number(req.params.page); // Convertir a número
                const limit = Number(req.params.limit); // Convertir a número
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                let totalPages = Math.ceil(total / limit);
                const resultProperty = sortedProperties.slice(startIndex, endIndex);
                console.log(resultProperty, totalPages, total);
                return res.status(200).json({ properties: resultProperty, totalPages: totalPages, totalActivity: total });
            }
            catch (error) {
                console.error('Error en la solicitud:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
    }
    getByName(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("funciona get by name");
                const user_filter = { _id: req.userId };
                const user_data = yield userServices.getEntries.filterUser(user_filter);
                if (!user_data) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                const property_data = yield propertiesServices.getEntries.getByName(user_data, parseInt(req.params.distance, 10), req.params.search);
                if (!property_data || property_data.length === 0) {
                    // Si no hay propiedades, retorna una respuesta vacía
                    return res.status(200).json({ properties: [], totalPages: 0, totalActivity: 0 });
                }
                let total = property_data.length;
                const page = Number(req.params.page); // Convertir a número
                const limit = Number(req.params.limit); // Convertir a número
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                let totalPages = Math.ceil(total / limit);
                const resultProperty = property_data === null || property_data === void 0 ? void 0 : property_data.slice(startIndex, endIndex);
                console.log(resultProperty, totalPages, total);
                return res.status(200).json({ properties: resultProperty, totalPages: totalPages, totalActivity: total });
            }
            catch (error) {
                console.error('Error en la solicitud:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
    }
    deleteProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const propertyId = req.params.id;
            return propertiesServices.getEntries.delete(propertyId)
                .then((property) => (property ? res.status(201).json({ property, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
                .catch((error) => res.status(500).json({ error }));
        });
    }
    updateProperty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id) {
                    const property_filter = { _id: req.params.id };
                    // Fetch user
                    const activity_data = yield propertiesServices.getEntries.filterProperty(property_filter);
                    if (!activity_data) {
                        // Send failure response if user not found
                        return res.status(400).json({ error: 'Property not found' });
                    }
                    const property_params = {
                        price: req.body.price,
                        //longitude:req.body.longitude,
                        //latitude:req.body.latitude,
                        //rating: req.body.rating,
                        description: req.body.description,
                        owner: req.body.owner,
                        imageUrl: req.body.imageUrl,
                        //active: true
                    };
                    yield propertiesServices.getEntries.updateProperty(property_params, property_filter);
                    //get new activity data
                    const new_activity_data = yield propertiesServices.getEntries.filterProperty(property_filter);
                    // Send success response
                    return res.status(200).json({ data: new_activity_data, message: 'Successful update' });
                }
                else {
                    // Send error response if ID parameter is missing
                    return res.status(400).json({ error: 'Missing ID parameter' });
                }
            }
            catch (error) {
                // Catch and handle any errors
                console.error("Error updating:", error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.propertyController = propertyController;
