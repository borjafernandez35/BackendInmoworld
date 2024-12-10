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
const crypto = __importStar(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
class userController {
    constructor() {
        this._SECRET = 'api+jwt';
        this.refreshTokenSecret = crypto.randomBytes(64).toString('hex');
        this._REFRESH_SECRET = this.refreshTokenSecret;
    }
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
    createUserGoogle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.name &&
                    req.body.email &&
                    req.body.password &&
                    req.body.birthday) {
                    console.log("estoy en register!!!!:", req.body.name);
                    if (typeof req.body.password !== 'string') {
                        throw new Error('Invalid password');
                    }
                    const password = yield userServices.getEntries.encryptPassword(req.body.password);
                    const user_params = {
                        name: req.body.name,
                        email: req.body.email,
                        birthday: req.body.birthday,
                        isAdmin: false,
                        password: password
                    };
                    const user_data = yield userServices.getEntries.createUserGoogle(user_params);
                    const email = req.body.email;
                    const userFound = yield userServices.getEntries.filterUserEmail(email);
                    if (!userFound) {
                        return res.status(404).json({ message: 'User Not Found' });
                    }
                    const session = { id: userFound._id, isAdmin: userFound.isAdmin };
                    const token = jwt.sign(session, this._SECRET, {
                        expiresIn: 86400,
                    });
                    const refreshToken = jwt.sign(session, this._REFRESH_SECRET, {
                        expiresIn: 604800, // 7 days
                    });
                    return res
                        .status(201)
                        .json({ message: 'User created successfully', user: user_data, token: token, refreshToken: refreshToken, id: userFound._id });
                }
                else {
                    return res.status(400).json({ error: 'Missing fields' });
                }
            }
            catch (error) {
                console.log('error', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    checkEmailExists(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.params.email; // Obtener el correo electrónico de los parámetros de la solicitud
                const isEmailRegistered = yield userServices.getEntries.checkEmailExists(email);
                console.log('el isemailregistered es:', isEmailRegistered);
                return res.status(200).json({ isEmailRegistered });
            }
            catch (error) {
                console.error('Error checking email:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("REGiiisssSTERRRRRRR:", req.body.name, req.body.email, req.body.password, req.body.isAdmin, req.body.birthday);
                if (req.body.name && req.body.email && req.body.password && req.body.birthday) {
                    console.log("estoy en register!!!!:", req.body.name);
                    if (typeof req.body.password !== 'string') {
                        throw new Error('Invalid password');
                    }
                    const password = yield userServices.getEntries.encryptPassword(req.body.password);
                    const user_params = {
                        name: req.body.name,
                        email: req.body.email,
                        password: password, // Guarda la contraseña en texto claro y deja que el middleware la cifre
                        isAdmin: req.body.isAdmin,
                        birthday: req.body.birthday
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
                        password: req.body.password || user_data.password,
                        birthday: req.body.birthday || user_data.birthday
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
