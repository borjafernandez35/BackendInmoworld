/* eslint-disable */
import express from 'express'
import { reviewController } from '../controller/review'
import {verifyToken,reviewOwner,AdminValidation} from '../middlewares/authJWT'

const router = express.Router()
const review_controller: reviewController = new reviewController();

router.get('/:page/:limit',verifyToken, async(_req, res) => {
    review_controller.getAll(_req, res);
})

router.get('/:id',verifyToken, async(req, res) => {
    review_controller.getReview(req, res);
})

router.post('/',verifyToken, async(req, res) => {
    review_controller.createReview(req, res);
})

router.put('/:id',verifyToken,reviewOwner, async (req, res) => {
    review_controller.updateReview(req, res);
})

router.delete('/:id',verifyToken,reviewOwner||AdminValidation, async(req, res) => {
    review_controller.deleteReview(req, res);
})

export default router
