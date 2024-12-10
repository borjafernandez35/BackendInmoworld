/* eslint-disable */
import express from 'express'
import {userController} from '../controller/user'
import {verifyToken, validateUserOrAdmin} from '../middlewares/authJWT'
/* eslint-disable */

//import toNewUser from '../extras/utils'

const router = express.Router()
const user_controller: userController = new userController();

router.get('/:page/:limit', async(req, res) => {
    console.log('ESTOY EN EL GET ALLL DE LA RUUUUTTTAASSS!!!!',req);
    console.log('el reeeeeessssss eeeeessssss...:',res);
    user_controller.getAll(req, res);
})

 router.get('/:id', async(req, res) => {
    console.log('ESTOY EN EL GET IIIIDDDDDD DE LAS RUTAS!!!!!!');
    user_controller.getUser(req, res);
}) 

router.post('/', async(req, res) => {
    user_controller.register(req, res);
})

router.post('/google', async (req, res) => {
    user_controller.createUserGoogle(req, res);
  })

  router.get('/check/email/:email', async (req, res) => {
    console.log('ESTOY EN EL CHEEECCCKKKK EMAILLLLLL');
    user_controller.checkEmailExists(req, res);
  })

router.post('/register', async(req, res) => {
    user_controller.register(req, res)
})

router.put('/:id',verifyToken,validateUserOrAdmin, async (req, res) => {
    user_controller.updateUser(req, res);
})

router.delete('/:id',verifyToken,validateUserOrAdmin, async(req, res) => {
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
