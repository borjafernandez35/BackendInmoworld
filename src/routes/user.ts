/* eslint-disable */
import express from 'express'
import {userController} from '../controller/user'
import {verifyToken, validateUserOrAdmin} from '../middlewares/authJWT'
/* eslint-disable */

//import toNewUser from '../extras/utils'

const router = express.Router()
const user_controller: userController = new userController();

router.get('/:page/:limit',verifyToken, async(_req, res) => {
    user_controller.getAll(_req, res);
})

router.get('/:id',verifyToken,validateUserOrAdmin, async(req, res) => {
    user_controller.getUser(req, res);
})

router.post('/', async(req, res) => {
    user_controller.register(req, res);
})

/* router.post('/login', async(req, res) => {
    user_controller.login(req, res)
}) */

router.post('/register', async(req, res) => {
    user_controller.register(req, res)
})

router.put('/:id',verifyToken, validateUserOrAdmin, async (req, res) => {
    user_controller.updateUser(req, res);
})

router.delete('/:id',verifyToken, validateUserOrAdmin, async(req, res) => {
    user_controller.deleteUser(req, res);
})

router.get('/chats/:id', verifyToken, async (req, res) => {
    user_controller.chatStartup(req, res);
})

/* router.delete('/delParticipant/:idUser/:idExp', async(req, res) => {
    const data = await userServices.getEntries.delExperience(req.params.idUser,req.params.idExp)
    return res.json(data);
})

router.post('/add/:idUser/:idExp', async(req, res) => {
    const data = await userServices.getEntries.addExperince(req.params.idUser,req.params.idExp)
    return res.json(data);
}) */


export default router
