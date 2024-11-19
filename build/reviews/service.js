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
exports.getEntries = void 0;
const schema_1 = __importDefault(require("./schema"));
exports.getEntries = {
    getAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.find();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findById(id);
    }),
    filterReview: (query) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield schema_1.default.findOne(query);
        }
        catch (error) {
            throw error;
        }
    }),
    create: (entry) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(entry);
        return yield schema_1.default.create(entry);
    }),
    update: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(body);
        return yield schema_1.default.findByIdAndUpdate(id, body, { $new: true });
    }),
    updateReview: (review_params, review_filter) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema_1.default.findOneAndUpdate(review_filter, review_params);
        }
        catch (error) {
            throw error;
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndDelete(id);
    }),
    deleteReview: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const query = { id: id };
            const update = { active: false };
            const result = yield schema_1.default.updateOne(query, update);
            return { deletedCount: result.modifiedCount };
        }
        catch (error) {
            throw error;
        }
    })
};
