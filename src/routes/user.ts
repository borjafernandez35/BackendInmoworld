/* eslint-disable */
import express from 'express'
import {userController} from '../controller/user'
import {verifyToken,verifyOwnership,AdminValidation} from '../middlewares/authJWT'
/* eslint-disable */

//import toNewUser from '../extras/utils'

const router = express.Router()
const user_controller: userController = new userController();

router.get('/:page/:limit',verifyToken, async(_req, res) => {
    user_controller.getAll(_req, res);
})

router.get('/:id',verifyToken,verifyOwnership, async(req, res) => {
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

router.put('/:id',verifyToken,AdminValidation||verifyOwnership, async (req, res) => {
    user_controller.updateUser(req, res);
})

router.delete('/:id',verifyToken,AdminValidation||verifyOwnership, async(req, res) => {
    user_controller.deleteUser(req, res);
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
