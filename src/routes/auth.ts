/* eslint-disable */
import express from 'express';
import { AuthController } from '../controller/authController';

const router = express.Router();
const authController = new AuthController();

// Ruta para iniciar sesión
router.post('/signin', async (req, res) => {
  authController.signIn(req, res);
});

router.post('/signin/google', (req, res) => {
  console.log('ESTOY EN EL LOGINNN DE GOOGLEEEEE!!!!!');
  authController.signingooggle(req, res);
});

// Ruta para refrescar el token
router.post('/refresh-token', async (req, res) => {
  authController.refreshToken(req, res);
});

export default router;
