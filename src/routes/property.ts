import express from 'express';
import {propertyController} from '../controller/property';



const router = express.Router()
const property_controller: propertyController = new propertyController();

router.get('/:page/:limit', async(_req, res) => {
     await property_controller.getAll(_req, res);
})

/* router.get('/:id', async(req, res) => {
    const data = await experienciasServices.getEntries.findById(req.params.id)
    return res.json(data);
}) */

/* router.get('/user/:id', async(req, res) => {
    const data = await experienciasServices.getEntries.findUserById(req.params.id)
    return res.json(data);
}) */

router.post('/:id', async(req, res) => {
    property_controller.createProperty(req, res);
})

/* router.post('/addParticipant/:idExp/:idPart', async(req, res) => {
    const data = await experienciasServices.getEntries.addParticipant(req.params.idExp,req.params.idPart)
    return res.json(data);
}) */

router.put('/:id', async(req, res) => {
    property_controller.updateProperty(req, res);
})

router.delete('/:id', async(req, res) => {
    property_controller.deleteProperty(req, res);
})

/* router.delete('/delParticipant/:idExp/:idPart', async(req, res) => {
    const data = await experienciasServices.getEntries.delParticipant(req.params.idExp,req.params.idPart)
    return res.json(data);
})*/

export default router