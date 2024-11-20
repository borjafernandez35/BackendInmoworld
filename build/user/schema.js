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
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
/* eslint-disable */
const mongoose_1 = __importStar(require("mongoose"));
//import { IUser } from './model'
exports.schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    //birthday: {type: String, required: false},
    //avatar:{type: String, required: false},
    property: [{ type: mongoose_1.Schema.Types.ObjectId, required: false, ref: 'property' }],
    password: { type: String, required: true },
    //comment: {type: String, required: false}
});
exports.default = mongoose_1.default.model('user', exports.schema);