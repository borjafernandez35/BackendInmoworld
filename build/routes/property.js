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
const property_1 = require("../controller/property");
const authJWT_1 = require("../middlewares/authJWT");
const router = express_1.default.Router();
const property_controller = new property_1.propertyController();
router.get('/:page/:limit/:distance/:sort', authJWT_1.verifyToken, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('ESTOOOYYYYYYYYY EN EL GGEEETTT ALLL DE PROPERTIESSS!!!!!', _req.params.distance, _req.params.sort);
    yield property_controller.getAll(_req, res);
}));
/* router.get('/:id', async(req, res) => {
    const data = await experienciasServices.getEntries.findById(req.params.id)
    return res.json(data);
}) */
/* router.get('/user/:id', async(req, res) => {
    const data = await experienciasServices.getEntries.findUserById(req.params.id)
    return res.json(data);
}) */
router.post('/new', authJWT_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('VAMOOOSSSSSS A CREAR UN PORPIEDDAAAADDDDD!!!');
    property_controller.createProperty(req, res);
}));
/* router.post('/addParticipant/:idExp/:idPart', async(req, res) => {
    const data = await experienciasServices.getEntries.addParticipant(req.params.idExp,req.params.idPart)
    return res.json(data);
}) */
router.put('/:id', authJWT_1.verifyToken, authJWT_1.isOwnerorAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('ESTOY EN ACTUALIZAR LAS PROPIEDADES!!!!!!!!!!!!');
    property_controller.updateProperty(req, res);
}));
router.delete('/:id', authJWT_1.verifyToken, authJWT_1.isOwnerorAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('VOY A BORRAR UNA PROPIEDAD!!!!!');
    property_controller.deleteProperty(req, res);
}));
router.get('/by/name/:page/:limit/:id/:distance/:search', authJWT_1.verifyToken, (req, res) => {
    console.log('ESTOY REOCGIENDO LAS PROPIEDAAAADDEEESSSS PARA EL MAPAAAAAA!!!!');
    property_controller.getByName(req, res);
});
/* router.delete('/delParticipant/:idExp/:idPart', async(req, res) => {
    const data = await experienciasServices.getEntries.delParticipant(req.params.idExp,req.params.idPart)
    return res.json(data);
})*/
exports.default = router;
