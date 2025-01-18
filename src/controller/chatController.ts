import { Request, Response } from 'express';
import ChatSchema from '../chat(Socketio)/schema';

export const countUnreadMessages = async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const unreadCount = await ChatSchema.countDocuments({
            receiver: userId,
            read: false,
        }).exec();

        res.status(200).json({ unreadCount });
    } catch (error) {
        res.status(500).json({ error });
    }
};

export const markMessagesAsRead = async (req: Request, res: Response) => {
    try {
        const { userId, senderId } = req.body;

        await ChatSchema.updateMany(
            { receiver: userId, sender: senderId, read: false },
            { $set: { read: true } }
        );

        res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
        res.status(500).json({ error });
    }
};
