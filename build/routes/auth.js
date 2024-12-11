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
/* eslint-disable */
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const router = express_1.default.Router();
const authController = new authController_1.AuthController();
// Ruta para iniciar sesión
router.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    authController.signIn(req, res);
}));
router.post('/signin/google', (req, res) => {
    console.log('ESTOY EN EL LOGINNN DE GOOGLEEEEE!!!!!');
    authController.signingooggle(req, res);
});
// Ruta para refrescar el token
router.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    authController.refreshToken(req, res);
}));
exports.default = router;
