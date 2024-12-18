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
exports.markMessagesAsRead = exports.countUnreadMessages = void 0;
const schema_1 = __importDefault(require("../chat(Socketio)/schema"));
const countUnreadMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const unreadCount = yield schema_1.default.countDocuments({
            receiver: userId,
            read: false,
        }).exec();
        res.status(200).json({ unreadCount });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.countUnreadMessages = countUnreadMessages;
const markMessagesAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, senderId } = req.body;
        yield schema_1.default.updateMany({ receiver: userId, sender: senderId, read: false }, { $set: { read: true } });
        res.status(200).json({ message: 'Messages marked as read' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
exports.markMessagesAsRead = markMessagesAsRead;
