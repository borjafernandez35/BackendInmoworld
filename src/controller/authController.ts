/* eslint-disable */
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import IJwtPayload from '../middlewares/JWTPayload';
import * as userServices from '../user/service';

export class AuthController {
  private _SECRET: string = 'api+jwt';

  refreshTokenSecret = crypto.randomBytes(64).toString('hex');
  private _REFRESH_SECRET: string = this.refreshTokenSecret;

  

  public async signIn(req: Request, res: Response): Promise<Response> {
    try {
      console.log('estoy en el sign in!!!!!!!!',req.body);
      const { email, password } = req.body;

      console.log('el correo es...',email);
      console.log('el password es....',password);

      // Verificar que se proporcionen email y password
      if (!email || !password) {
        return res.status(400).json({ message: 'Missing fields' });
      }

      // Buscar usuario por email
      const user_data = await userServices.getEntries.filterUserEmail(email);

      console.log('el usuario ess........!!!!',user_data);
      if (!user_data) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verificar que el password sea válido
      const isPasswordValid = await userServices.getEntries.validatePassword(password.trim(), user_data.password.trim());
      console.log('el paswword es valido......',isPasswordValid);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Error, wrong email or password' });
      }

      // Generar tokens JWT
      const session = { id: user_data._id, isAdmin: user_data.isAdmin }  as IJwtPayload;
      const token = jwt.sign(session, this._SECRET, { expiresIn: 86400 }); // Token de 1 día
      const refreshToken = jwt.sign(session, this._REFRESH_SECRET, { expiresIn: 604800 }); // Refresh token de 7 días

      // Responder con los datos del usuario y los tokens
      return res.status(201).json({
        message: 'Login successful',
        token,
        refreshToken,
        user: {
          id: user_data._id,
          name: user_data.name,
          email: user_data.email,
          birthday:user_data.birthday,
          isAdmin: user_data.isAdmin,
        },
      });
    } catch (error) {
      console.error('Error in authenticate:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async signingooggle(req: Request, res: Response): Promise<Response> {
    const email = req.body.email;
  
    try {
      const userFound = await userServices.getEntries.filterUserEmail(email);
      console.log('el userFound es',userFound);
  
      if (!userFound) {
        return res.status(404).json({ message: 'User Not Found' });
      }
      const session = { id: userFound._id, isAdmin:userFound.isAdmin } as IJwtPayload;

    const token = jwt.sign(session, this._SECRET, {
      expiresIn: 86400,
    });

    const refreshToken = jwt.sign(session, this._REFRESH_SECRET, {
      expiresIn: 604800, // 7 days
    });
  
      return res.status(200).json({ token: token, refreshToken: refreshToken, user: {
        id: userFound._id,
        name: userFound.name,
        email: userFound.email,
        birthday:userFound.birthday,
        isAdmin: userFound.isAdmin,
      },
    });
    } catch (error) {
      console.error('Error during signin:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  



  public async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.body.refresh_token;

      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token missing' });
      }

      const decoded = jwt.verify(
        refreshToken,
        this._REFRESH_SECRET
      ) as IJwtPayload;
      const userFound = await userServices.getEntries.filterUser({ _id: decoded.id });

      if (!userFound) return res.status(404).json({ message: 'No user found' });

      const session = { id: userFound._id } as IJwtPayload;

      const new_token = jwt.sign(session, this._SECRET, {
        expiresIn: 86400,
      });

      const new_refreshToken = jwt.sign(session, this._REFRESH_SECRET, {
        expiresIn: 604800, // 7 days
      });

      console.log(new_token);
      return res
        .status(201)
        .json({ token: new_token, refreshToken: new_refreshToken });
    } catch (error) {
      console.error('Error refreshing token:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}