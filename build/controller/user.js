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
class userController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //const user_filter = {};
                const user_data = yield userServices.getEntries.getAll();
                const total = user_data.length;
                console.log("paginas recibidas:", req.params.page);
                console.log("limite:", req.params.limit);
                const page = Number(req.params.page); // Convertir a número
                const limit = Number(req.params.limit); // Convertir a número
                if (limit == 0 && page == 1) {
                    console.log("los usuarios son:", user_data);
                    const totalPages = 1;
                    return res.status(200).json({ users: user_data, totalPages: totalPages, totalUser: total });
                }
                else {
                    const startIndex = (page - 1) * limit;
                    const endIndex = page * limit;
                    const totalPages = Math.ceil(total / limit);
                    const resultUser = user_data.slice(startIndex, endIndex);
                    console.log(startIndex, endIndex);
                    console.log(resultUser);
                    console.log("numero de usurarios:", total);
                    console.log("Numero de paginas:", totalPages);
                    return res
                        .status(200)
                        .json({ users: resultUser, totalPages: totalPages, totalUser: total });
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
                if (req.params.id) {
                    const user_filter = req.params.id;
                    // Usa populate en la consulta activa
                    const user_data = yield userServices.getEntries
                        .findById(user_filter)
                        .populate('property');
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
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.username && req.body.password) {
                    const user_filter = req.body.username;
                    // look up to this user to see if exists
                    const user_data = yield userServices.getEntries.findByName(user_filter);
                    if (user_data) {
                        if (user_data.name === req.body.username && user_data.password === req.body.password) {
                            if (user_data.name === 'Admin' && user_data.password == 'Admin') {
                                return res.status(200).json({ data: user_data, message: 'Admin' });
                            }
                            else {
                                return res.status(201).json({ data: user_data, message: 'Succesful' });
                            }
                        }
                        else {
                            return res.status(401).json({ message: 'Error, wrong username or password' });
                        }
                    }
                    else {
                        return res.status(404).json({ message: 'User not found' });
                    }
                }
                else {
                    return res.status(400).json({ message: 'Missing fields' });
                }
            }
            catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.name && req.body.email && req.body.password) {
                    const user_params = {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                        //active: true
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
                    const user_filter = { _id: req.params.id };
                    // Fetch user
                    const user_data = yield userServices.getEntries.findById(req.params.id);
                    if (!user_data) {
                        // Send failure response if user not found
                        return res.status(404).json({ error: 'User not found' });
                    }
                    const user_params = {
                        name: req.body.name || user_data.name,
                        email: req.body.email || user_data.email,
                        password: req.body.password || user_data.password
                    };
                    yield userServices.getEntries.updateUser(user_params, user_filter);
                    //get new user data
                    const new_user_data = yield userServices.getEntries.findById(req.params.id);
                    // Send success response
                    return res
                        .status(200)
                        .json({ data: new_user_data, message: 'Successful update' });
                }
                else {
                    // Send error response if ID parameter is missing
                    return res.status(400).json({ error: 'Missing ID parameter' });
                }
            }
            catch (error) {
                // Catch and handle any errors
                console.error('Error updating:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.id;
            return userServices.getEntries.delete(userId)
                .then((user) => (user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
                .catch((error) => res.status(500).json({ error }));
        });
    }
}
exports.userController = userController;
