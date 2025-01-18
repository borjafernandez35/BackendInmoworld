/* eslint-disable */
import express from 'express'
import {userController} from '../controller/user'
import {verifyToken} from '../middlewares/authJWT'
import { countUnreadMessages, markMessagesAsRead } from '../controller/chatController';
/* eslint-disable */

//import toNewUser from '../extras/utils'

const router = express.Router()
const user_controller: userController = new userController();

 

router.get('/:id', verifyToken, async (req, res) => {
    user_controller.chatStartup(req, res);
})

// Ruta para contar mensajes no leídos
router.get('/unread/:id',verifyToken, countUnreadMessages);

// Ruta para marcar mensajes como leídos
router.post('/mark-as-read',verifyToken, markMessagesAsRead);




export default router