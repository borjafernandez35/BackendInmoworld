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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const reviewServices = __importStar(require("../reviews/service"));
/* eslint-disable */
class reviewController {
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.user && req.body.property && req.body.description) {
                    const review_params = {
                        user: req.body.user,
                        property: req.body.property,
                        description: req.body.description,
                        date: new Date()
                    };
                    const review_data = yield reviewServices.getEntries.create(review_params);
                    return res.status(201).json({ message: 'Review created succesfully', review: review_data });
                }
                else {
                    return res.status(400).json({ error: 'Missing fields' });
                }
            }
            catch (error) {
                return res.status(500).json({ error: 'Error creating a review' });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const review_data = yield reviewServices.getEntries.getAll();
                const total = review_data.length;
                const page = Number(req.params.page);
                const limit = Number(req.params.limit);
                const startIndex = (page - 1) * limit;
                const endIndex = page * limit;
                const totalPages = Math.ceil(total / limit);
                const resultReview = review_data.slice(startIndex, endIndex);
                return res
                    .status(200)
                    .json({ reviews: resultReview, totalPages: totalPages, totalReview: total });
            }
            catch (error) {
                return res.status(500).json({ error: 'Error al extraer todas las reviews' });
            }
        });
    }
    getReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id) {
                    const review_filter = req.params.id;
                    const review_data = yield reviewServices.getEntries.findById(review_filter);
                    return res.status(200).json({ data: review_data, message: 'Successful' });
                }
                else {
                    return res.status(400).json({ error: 'Missing fields' });
                }
            }
            catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    updateReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id) {
                    const review_filter = { _id: req.params.id };
                    console.log(review_filter);
                    const review_data = yield reviewServices.getEntries.filterReview(review_filter);
                    console.log(review_data);
                    if (!review_data) {
                        return res.status(400).json({ error: 'Review not found' });
                    }
                    const review_params = {
                        user: req.body.name || review_data.user,
                        property: req.body.property || review_data.property,
                        description: req.body.description || review_data.description,
                        date: new Date()
                    };
                    yield reviewServices.getEntries.updateReview(review_params, review_filter);
                    const new_review_data = yield reviewServices.getEntries.findById(req.params.id);
                    console.log('update:', new_review_data);
                    return res
                        .status(200)
                        .json({ data: new_review_data, message: 'Successful update' });
                }
                else {
                    return res.status(400).json({ error: 'Missing ID parameter' });
                }
            }
            catch (error) {
                console.error('Error updating:', error);
                return res.status(500).json({ error: 'Error updating review' });
            }
        });
    }
    deleteReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewId = req.params.id;
            return reviewServices.getEntries.delete(reviewId)
                .then((review) => (review ? res.status(201).json({ review, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
                .catch((error) => res.status(500).json({ error }));
        });
    }
}
exports.reviewController = reviewController;
