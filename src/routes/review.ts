import express from 'express'
import { reviewController } from '../controller/review'

const router = express.Router()
const review_controller: reviewController = new reviewController();

router.get('/:page/:limit', async(_req, res) => {
    review_controller.getAll(_req, res);
})

router.get('/:id', async(req, res) => {
    review_controller.getReview(req, res);
})

router.post('/', async(req, res) => {
    review_controller.createReview(req, res);
})

router.put('/:id', async (req, res) => {
    review_controller.updateReview(req, res);
})

router.delete('/:id', async(req, res) => {
    review_controller.deleteReview(req, res);
})

export default router
