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
const user_1 = require("../controller/user");
const authJWT_1 = require("../middlewares/authJWT");
const chatController_1 = require("../controller/chatController");
/* eslint-disable */
//import toNewUser from '../extras/utils'
const router = express_1.default.Router();
const user_controller = new user_1.userController();
router.get('/:id', authJWT_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.chatStartup(req, res);
}));
// Ruta para contar mensajes no leídos
router.get('/unread/:id', authJWT_1.verifyToken, chatController_1.countUnreadMessages);
// Ruta para marcar mensajes como leídos
router.post('/mark-as-read', authJWT_1.verifyToken, chatController_1.markMessagesAsRead);
exports.default = router;
