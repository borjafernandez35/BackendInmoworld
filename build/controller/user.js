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
exports.userController = void 0;
const userServices = __importStar(require("../user/service"));
//import bcrypt from 'bcryptjs'; // Solo importa bcrypt una vez aquí
class userController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_data = yield userServices.getEntries.getAll();
                const total = user_data.length;
                const page = Number(req.params.page);
                const limit = Number(req.params.limit);
                if (limit == 0 && page == 1) {
                    const totalPages = 1;
                    return res.status(200).json({ users: user_data, totalPages, totalUser: total });
                }
                else {
                    const startIndex = (page - 1) * limit;
                    const endIndex = page * limit;
                    const totalPages = Math.ceil(total / limit);
                    const resultUser = user_data.slice(startIndex, endIndex);
                    return res.status(200).json({ users: resultUser, totalPages, totalUser: total });
                }
            }
            catch (error) {
                console.error('Error en la solicitud:', error);
                return res.status(500).json({ message: 'Error interno del servidor' });
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('el id es:', req.params.id);
                console.log('el _id es:', req.params._id);
                if (req.params.id) {
                    const user_filter = req.params.id;
                    // Usa populate en la consulta activa
                    const user_data = yield userServices.getEntries
                        .findById(user_filter);
                    //.populate('property');
                    console.log('el iser es:', user_data);
                    if (!user_data) {
                        return res.status(404).json({ error: 'User not found' });
                    }
                    return res.status(200).json({ data: user_data, message: 'Successful' });
                }
                else {
                    return res.status(400).json({ error: 'Missing fields' });
                }
            }
            catch (error) {
                console.error('Error fetching user:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    /*  public async login(req: Request, res: Response) {
       try {
           // Verificar si se proporcionaron los campos requeridos
           if (req.body.username && req.body.password) {
               const user_filter = req.body.username;
               const user_data = await userServices.getEntries.findByName(user_filter);
   
               if (user_data) {
                   const inputPassword = req.body.password.trim();
                   const storedHash = user_data.password.trim();
                   console.log('Comparando inputPassword y storedHash...');
                   console.log('inputPassword (longitud):', inputPassword.length, 'Contenido:', inputPassword);
                   console.log('storedHash (longitud):', storedHash.length, 'Contenido:', storedHash);
   
                   const isPasswordValid = await bcrypt.compare(inputPassword, storedHash);
                   console.log('Resultado de bcrypt.compare:', isPasswordValid);
   
                   if (!isPasswordValid) {
                       // Verificar si es el usuario Admin
                       if (user_data.name === 'Admin' && inputPassword === 'Administrador') {
                           return res.status(200).json({ data: user_data, message: 'Admin' });
                       } else {
                         return res.status(401).json({ message: 'Error, wrong username or password' });
                       }
                   } else {
                     return res.status(201).json({ data: user_data, message: 'Login Successful' });
                   }
               } else {
                   return res.status(404).json({ message: 'User not found' });
               }
           } else {
               return res.status(400).json({ message: 'Missing fields' });
           }
       } catch (error) {
           console.error(error);
           return res.status(500).json({ error: 'Internal server error' });
       }
   } */
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("REGiiisssSTERRRRRRR:", req.body.name, req.body.email, req.body.password, req.body.isAdmin);
                if (req.body.name && req.body.email && req.body.password) {
                    console.log("estoy en register!!!!:", req.body.name);
                    if (typeof req.body.password !== 'string') {
                        throw new Error('Invalid password');
                    }
                    const password = yield userServices.getEntries.encryptPassword(req.body.password);
                    const user_params = {
                        name: req.body.name,
                        email: req.body.email,
                        password: password, // Guarda la contraseña en texto claro y deja que el middleware la cifre
                        isAdmin: req.body.isAdmin
                    };
                    const user_data = yield userServices.getEntries.create(user_params);
                    return res.status(201).json({ message: 'User registered successfully', user: user_data });
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
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id) {
                    const user_data = yield userServices.getEntries.findById(req.params.id);
                    if (!user_data) {
                        return res.status(404).json({ error: 'User not found' });
                    }
                    const user_params = {
                        name: req.body.name || user_data.name,
                        email: req.body.email || user_data.email,
                        password: req.body.password || user_data.password
                    };
                    yield userServices.getEntries.updateUser(user_params, { _id: req.params.id });
                    const new_user_data = yield userServices.getEntries.findById(req.params.id);
                    return res.status(200).json({ data: new_user_data, message: 'Successful update' });
                }
                else {
                    return res.status(400).json({ error: 'Missing ID parameter' });
                }
            }
            catch (error) {
                console.error('Error updating:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield userServices.getEntries.delete(userId);
                return user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' });
            }
            catch (error) {
                return res.status(500).json({ error });
            }
        });
    }
}
exports.userController = userController;
