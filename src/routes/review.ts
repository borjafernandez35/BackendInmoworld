import express from 'express';
import { reviewController } from '../controller/review';
import { verifyToken, reviewOwner, AdminValidation } from '../middlewares/authJWT';

const router = express.Router();
const review_controller = new reviewController();

router.get('/', verifyToken, (req, res) => {
    review_controller.getAll(req, res);
});

router.get('/:id', verifyToken, (req, res) => {
    review_controller.getReview(req, res);
});

router.post('/', verifyToken, (req, res) => {
    review_controller.createReview(req, res);
});

router.put('/:id', verifyToken, reviewOwner, (req, res) => {
    review_controller.updateReview(req, res);
});

router.delete('/:id', verifyToken, reviewOwner || AdminValidation, (req, res) => {
    review_controller.deleteReview(req, res);
});

export default router;

