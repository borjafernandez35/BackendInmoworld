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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntries = void 0;
const schema_1 = __importDefault(require("./schema"));
const bcrypt = __importStar(require("bcrypt"));
//import userData from './users.json'
exports.getEntries = {
    getAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.find();
    }),
    findById: (_id) => {
        console.log('el _id es:', _id);
        return schema_1.default.findById(_id);
    },
    findByIdUser: (_id) => {
        console.log('el _id es:', _id);
        return schema_1.default.findById(_id);
    },
    findByName: (username) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findOne({ name: username });
    }),
    encryptPassword: (password) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }),
    validatePassword: (password, person) => {
        return bcrypt.compare(password, person);
    },
    create: (entry) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield schema_1.default.create(entry); // El hash de la contraseña se maneja en el middleware del modelo
        }
        catch (error) {
            throw error;
        }
    }),
    update: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(body);
        return yield schema_1.default.findByIdAndUpdate(id, body, { $new: true });
    }),
    updateUser: (user_params, user_filter) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema_1.default.findOneAndUpdate(user_filter, user_params);
        }
        catch (error) {
            throw error;
        }
    }),
    filterUser: (query) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            console.log("que hay aqui", query);
            const activeQuery = Object.assign(Object.assign({}, query), { active: true });
            console.log("activeeeeee", activeQuery);
            return yield schema_1.default.findOne(activeQuery);
        }
        catch (error) {
            throw error;
        }
    }),
    filterUserEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield schema_1.default.findOne({ email: email });
        }
        catch (error) {
            throw error;
        }
    }),
    checkEmailExists: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingUser = yield schema_1.default.findOne({ email: email });
            return !!existingUser; // Devuelve true si existe el usuario, false si no existe
        }
        catch (error) {
            throw error;
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndDelete(id);
    }),
    deleteUser: (_id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Luego, eliminar al usuario
            const query = { _id: _id };
            const update = { active: false };
            const result = yield schema_1.default.updateOne(query, update);
            return { deletedCount: result.modifiedCount };
        }
        catch (error) {
            throw error;
        }
    }),
    addProperty: (idUser, idExp) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndUpdate(idUser, { $addToSet: { property: idExp } });
    }),
    delProperty: (idUser, idExp) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndUpdate(idUser, { $pull: { property: idExp } });
    })
};
