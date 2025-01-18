"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntries = void 0;
const schema_1 = __importDefault(require("./schema"));
const schema_2 = __importDefault(require("../user/schema"));
exports.getEntries = {
    getAll: (user_model, distance) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const currentDate = new Date();
            console.log(currentDate);
            return yield schema_1.default.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [(_a = user_model.location) === null || _a === void 0 ? void 0 : _a.coordinates[0], (_b = user_model.location) === null || _b === void 0 ? void 0 : _b.coordinates[1]] // User's coordinates
                        },
                        $maxDistance: distance // Specify the maximum distance (radius)
                    }
                },
                //active: true,
                // date: { $gte: currentDate}
            });
        }
        catch (error) {
            console.error('Error en getAll:', error);
            return null;
        }
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findById(id);
    }),
    filterProperty: (query) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield schema_1.default.findOne(query);
        }
        catch (error) {
            throw error;
        }
    }),
    addPropertyToUser: (userId, activityId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log('estoy en addproperty to UUUUSSSEERRR!!!!', userId);
            // Retrieve the user document by ID
            const userDoc = yield schema_2.default.findById(userId);
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
            yield userDoc.save();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }),
    findUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findById(id).populate('owner');
    }),
    addParticipant: (idExp, idPart) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndUpdate(idExp, { $addToSet: { participants: idPart } });
    }),
    delParticipant: (idExp, idPart) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndUpdate(idExp, { $pull: { participants: idPart } });
    }),
    /*  create: async(entry:IProperty)=>{
       console.log('estoy en la creación de una PROPIEDAD!!!!',entry);
    try {
          return await property.create(entry);
          } catch (error) {
            throw error;
          }
        }, */
    create: (property_data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!property_data.location || !property_data.location.coordinates) {
                throw new Error('Datos de ubicación incompletos');
            }
            console.log('ESTOY DENTROOOOO DEL TRY!!!!');
            const session = new schema_1.default(property_data);
            console.log('la sesion eeeessss....!!!!', session);
            // Valida los datos antes de guardar
            const validationError = session.validateSync();
            if (validationError) {
                throw new Error(`Datos inválidos: ${validationError.message}`);
            }
            console.log('Creando la sesión:', session);
            const result = yield session.save();
            console.log('sesion GUARDADA!!!!!!', result);
            const newProperty = Object.assign(Object.assign({}, result.toObject()), { _id: result._id });
            return newProperty;
        }
        catch (error) {
            console.log('error', error);
            throw error;
        }
    }),
    update: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(body);
        return yield schema_1.default.findByIdAndUpdate(id, body, { $new: true });
    }),
    updateProperty: (property_params, property_filter) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema_1.default.findOneAndUpdate(property_filter, { $set: property_params }, { new: true });
        }
        catch (error) {
            throw error;
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        yield schema_2.default.updateMany({}, { $pull: { property: id } });
        return yield schema_1.default.findByIdAndDelete(id);
    }),
    getByName: (user, distance, search) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const currentDate = new Date();
            return schema_1.default.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [(_a = user.location) === null || _a === void 0 ? void 0 : _a.coordinates[0], (_b = user.location) === null || _b === void 0 ? void 0 : _b.coordinates[1]] // User's coordinates
                        },
                        $maxDistance: distance // Specify the maximum distance (radius)
                    }
                },
                active: true,
                "name": { "$regex": search, "$options": "i" },
                date: { $gt: currentDate }
            });
        }
        catch (error) {
            console.error('Error en getAll:', error);
            return null;
        }
    }),
    sortProperties(list_properties, sortBy) {
        try {
            let sortedProperties = [];
            console.log('la lista de propiedades son.......!!!!', list_properties);
            if (!sortBy || sortBy.trim() === "") {
                // Si sortBy está vacío o es null, devolvemos las propiedades sin ordenar
                sortedProperties = list_properties.slice();
            }
            else if (sortBy === "Proximity") {
                sortedProperties = list_properties.slice();
            }
            else if (sortBy === "Price") {
                sortedProperties = list_properties
                    .slice()
                    .sort((a, b) => b.price - a.price);
            }
            else {
                // Si el parámetro es inválido, lanzar un error
                throw new Error("Invalid sortBy parameter: " + sortBy);
            }
            return sortedProperties;
        }
        catch (error) {
            console.error("Error sorting properties:", error);
            return []; // Retornar un arreglo vacío o manejar el error de otra manera apropiada
        }
    }
};
