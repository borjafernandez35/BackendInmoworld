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
exports.AuthController = void 0;
const jwt = __importStar(require("jsonwebtoken"));
const crypto = __importStar(require("crypto"));
const userServices = __importStar(require("../user/service"));
class AuthController {
    constructor() {
        this._SECRET = 'api+jwt';
        this.refreshTokenSecret = crypto.randomBytes(64).toString('hex');
        this._REFRESH_SECRET = this.refreshTokenSecret;
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // Verificar que se proporcionen email y password
                if (!email || !password) {
                    return res.status(400).json({ message: 'Missing fields' });
                }
                // Buscar usuario por email
                const user_data = yield userServices.getEntries.filterUserEmail(email);
                if (!user_data) {
                    return res.status(404).json({ message: 'User not found' });
                }
                // Verificar que el password sea válido
                const isPasswordValid = yield userServices.getEntries.validatePassword(password.trim(), user_data.password.trim());
                if (!isPasswordValid) {
                    return res.status(401).json({ message: 'Error, wrong email or password' });
                }
                // Generar tokens JWT
                const session = { id: user_data._id, isAdmin: user_data.isAdmin };
                const token = jwt.sign(session, this._SECRET, { expiresIn: 86400 }); // Token de 1 día
                const refreshToken = jwt.sign(session, this._REFRESH_SECRET, { expiresIn: 604800 }); // Refresh token de 7 días
                // Responder con los datos del usuario y los tokens
                return res.status(201).json({
                    message: 'Login successful',
                    token,
                    refreshToken,
                    user: {
                        id: user_data._id,
                        name: user_data.name,
                        email: user_data.email,
                        birthday: user_data.birthday,
                        isAdmin: user_data.isAdmin,
                    },
                });
            }
            catch (error) {
                console.error('Error in authenticate:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
    signingooggle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const email = req.body.email;
            try {
                const userFound = yield userServices.getEntries.filterUserEmail(email);
                console.log('el userFound es', userFound);
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
                return res.status(200).json({ token: token, refreshToken: refreshToken, user: {
                        id: userFound._id,
                        name: userFound.name,
                        email: userFound.email,
                        birthday: userFound.birthday,
                        isAdmin: userFound.isAdmin,
                    },
                });
            }
            catch (error) {
                console.error('Error during signin:', error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.body.refresh_token;
                if (!refreshToken) {
                    return res.status(400).json({ message: 'Refresh token missing' });
                }
                const decoded = jwt.verify(refreshToken, this._REFRESH_SECRET);
                const userFound = yield userServices.getEntries.filterUser({ _id: decoded.id });
                if (!userFound)
                    return res.status(404).json({ message: 'No user found' });
                const session = { id: userFound._id };
                const new_token = jwt.sign(session, this._SECRET, {
                    expiresIn: 86400,
                });
                const new_refreshToken = jwt.sign(session, this._REFRESH_SECRET, {
                    expiresIn: 604800, // 7 days
                });
                console.log(new_token);
                return res
                    .status(201)
                    .json({ token: new_token, refreshToken: new_refreshToken });
            }
            catch (error) {
                console.error('Error refreshing token:', error);
                return res.status(500).json({ message: 'Internal server error' });
            }
        });
    }
}
exports.AuthController = AuthController;
