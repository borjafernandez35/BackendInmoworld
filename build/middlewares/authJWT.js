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
exports.verifyOwnership = exports.AdminValidation = void 0;
exports.verifyToken = verifyToken;
exports.isOwner = isOwner;
exports.reviewOwner = reviewOwner;
const jwt = __importStar(require("jsonwebtoken"));
const schema_1 = __importDefault(require("../reviews/schema"));
const schema_2 = __importDefault(require("../user/schema"));
const schema_3 = __importDefault(require("../property/schema"));
const userServices = __importStar(require("../user/service"));
const _SECRET = 'api+jwt';
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("verifyToken");
        const token = req.header("x-access-token");
        if (!token)
            return res.status(403).json({ message: "No token provided" });
        console.log(token);
        try {
            const decoded = jwt.verify(token, _SECRET);
            console.log("verifyToken");
            console.log(decoded);
            req.userId = decoded.id;
            const user = yield schema_2.default.findById(decoded.id);
            console.log(user);
            if (!user)
                return res.status(404).json({ message: "No user found" });
            console.log("User verified:", user);
            return next();
        }
        catch (error) {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    });
}
;
function isOwner(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //const user = await users.find({userId: req.body._id});
            const propertyId = req.params.id;
            const property = yield schema_3.default.findById(propertyId);
            if (!property)
                return res.status(403).json({ message: "No user found" });
            if (property.owner != req.body._id)
                return res.status(403).json({ message: "Not Owner" });
            console.log("Ownership verified.");
            return next();
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({ message: error });
        }
    });
}
;
function reviewOwner(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield schema_2.default.findOne({ userId: req.body._id });
            if (!user || !user._id) {
                return res.status(403).json({ message: "User not found" });
            }
            console.log("estas aqui: " + user._id);
            const reviewId = req.params.id;
            const review = yield schema_1.default.findById(reviewId);
            if (!review || !review.user) {
                return res.status(403).json({ message: "Review not found" });
            }
            console.log("Post owner: " + review.user);
            if (req.userId != review.user) {
                return res.status(403).json({ message: "Not the owner" });
            }
            console.log("Review ownership verified.");
            return next();
        }
        catch (error) {
            console.log(error);
            return res.status(500).send({ message: error });
        }
    });
}
;
const AdminValidation = (req, res, next) => {
    var _a;
    console.log('Verifying admin');
    try {
        const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Access Token Missing' });
        }
        const decoded = jwt.verify(token, 'api+jwt'); // Asegúrate de usar la misma clave secreta
        if (!decoded.isAdmin) {
            return res.status(403).json({ message: 'You are not admin' });
        }
        console.log('Admin verified');
        return next();
    }
    catch (error) {
        console.error('Error verifying admin:', error);
        return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }
};
exports.AdminValidation = AdminValidation;
const verifyOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Verificando usuario');
        console.log('user Id:', req.userId);
        // ID del usuario autenticado (decodificado en verifyToken)
        const userIdFromToken = req.userId;
        if (!userIdFromToken) {
            return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
        }
        console.log('el correo es:', req.body.email);
        console.log('el id params es:', req.params.id);
        // Verifica si el email proporcionado corresponde a un usuario
        //const email = req.body.email; 
        const user = yield userServices.getEntries.findByIdUser(userIdFromToken);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('el user es:', user);
        // Compara los IDs para verificar propiedad
        const targetUserId = user._id; // Convertimos a string para comparación
        console.log('el userid es:', userIdFromToken);
        console.log('el target Id es:', targetUserId);
        if (userIdFromToken === targetUserId) {
            console.log('Permiso concedido, pasando al siguiente middleware');
            return next();
        }
        // Si no coincide, retorna error de autorización
        return res.status(403).json({ message: 'Not Owner' });
    }
    catch (error) {
        console.error('Error en verifyOwnership:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.verifyOwnership = verifyOwnership;
