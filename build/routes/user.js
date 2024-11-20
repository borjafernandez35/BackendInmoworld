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
/* eslint-disable */
//import toNewUser from '../extras/utils'
const router = express_1.default.Router();
const user_controller = new user_1.userController();
router.get('/:page/:limit', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.getAll(_req, res);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.getUser(req, res);
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.register(req, res);
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.login(req, res);
}));
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.register(req, res);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.updateUser(req, res);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    user_controller.deleteUser(req, res);
}));
/* router.delete('/delParticipant/:idUser/:idExp', async(req, res) => {
    const data = await userServices.getEntries.delExperience(req.params.idUser,req.params.idExp)
    return res.json(data);
})

router.post('/add/:idUser/:idExp', async(req, res) => {
    const data = await userServices.getEntries.addExperince(req.params.idUser,req.params.idExp)
    return res.json(data);
}) */
exports.default = router;