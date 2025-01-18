"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const review_1 = require("../controller/review");
const authJWT_1 = require("../middlewares/authJWT");
const router = express_1.default.Router();
const review_controller = new review_1.reviewController();
router.get('/', authJWT_1.verifyToken, (req, res) => {
    review_controller.getAll(req, res);
});
router.get('/:id', authJWT_1.verifyToken, (req, res) => {
    review_controller.getReview(req, res);
});
router.post('/', authJWT_1.verifyToken, (req, res) => {
    review_controller.createReview(req, res);
});
router.put('/:id', authJWT_1.verifyToken, authJWT_1.reviewOwner, (req, res) => {
    review_controller.updateReview(req, res);
});
router.delete('/:id', authJWT_1.verifyToken, authJWT_1.reviewOwner || authJWT_1.AdminValidation, (req, res) => {
    review_controller.deleteReview(req, res);
});
exports.default = router;
