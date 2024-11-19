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
const schema_2 = __importDefault(require("../user/schema"));
exports.getEntries = {
    getAll: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.find();
    }),
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findById(id);
    }),
    filterProperty: (query) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield schema_1.default.findOne(query);
        }
        catch (error) {
            throw error;
        }
    }),
    addPropertyToUser: (userId, activityId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Retrieve the user document by ID
            const users = yield schema_2.default.findById(userId);
            if (!users) {
                throw new Error('User not found');
            }
            // Add the post ID to the user's array of posts
            users.property.push(activityId);
            // Save the updated user document
            yield users.save();
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }),
    findUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findById(id).populate('owner');
    }),
    addParticipant: (idExp, idPart) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndUpdate(idExp, { $addToSet: { participants: idPart } });
    }),
    delParticipant: (idExp, idPart) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndUpdate(idExp, { $pull: { participants: idPart } });
    }),
    create: (entry) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.create(entry);
    }),
    update: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(body);
        return yield schema_1.default.findByIdAndUpdate(id, body, { $new: true });
    }),
    updateProperty: (property_params, property_filter) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema_1.default.findOneAndUpdate(property_filter, { $set: property_params }, { new: true });
        }
        catch (error) {
            throw error;
        }
    }),
    delete: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield schema_1.default.findByIdAndDelete(id);
    })
};
