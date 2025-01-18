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
const review_1 = require("../controller/review");
const authJWT_1 = require("../middlewares/authJWT");
const router = express_1.default.Router();
const review_controller = new review_1.reviewController();
router.get('/:page/:limit', authJWT_1.verifyToken, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    review_controller.getAll(_req, res);
}));
router.get('/:id', authJWT_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    review_controller.getReview(req, res);
}));
router.post('/', authJWT_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    review_controller.createReview(req, res);
}));
router.put('/:id', authJWT_1.verifyToken, authJWT_1.reviewOwnerorAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    review_controller.updateReview(req, res);
}));
router.delete('/:id', authJWT_1.verifyToken, authJWT_1.reviewOwnerorAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    review_controller.deleteReview(req, res);
}));
exports.default = router;
