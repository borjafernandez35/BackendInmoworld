/* eslint-disable */
import express from 'express'
import {userController} from '../controller/user'
import {verifyToken} from '../middlewares/authJWT'
/* eslint-disable */

//import toNewUser from '../extras/utils'

const router = express.Router()
const user_controller: userController = new userController();

 

router.get('/:id', verifyToken, async (req, res) => {
    user_controller.chatStartup(req, res);
})




export default router