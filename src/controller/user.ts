/* eslint-disable */
import { Request, Response } from 'express';
import { IUser } from '../user/model';
import ChatSchema from '../chat(Socketio)/schema';
import * as userServices from '../user/service';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import IJwtPayload from '../middlewares/JWTPayload';

export class userController {

  private _SECRET: string = 'api+jwt';

  refreshTokenSecret = crypto.randomBytes(64).toString('hex');
  private _REFRESH_SECRET: string = this.refreshTokenSecret;

  public async getAll(req: Request, res: Response) {
    try {
      const user_data = await userServices.getEntries.getAll();
      const total = user_data.length;
      const page = Number(req.params.page);
      const limit = Number(req.params.limit);

      if(limit == 0 && page == 1) {
        const totalPages = 1;
        return res.status(200).json({ users: user_data, totalPages, totalUser: total });
      } else {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalPages = Math.ceil(total / limit);
        const resultUser = user_data.slice(startIndex, endIndex);
        return res.status(200).json({ users: resultUser, totalPages, totalUser: total });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  public async getUser(req: Request, res: Response) {
    try {
      console.log('el id es:',req.params.id);
      console.log('el _id es:', req.params._id);
        if (req.params.id) {
            const user_filter = req.params.id;

            // Usa populate en la consulta activa
            const user_data = await userServices.getEntries
                .findById(user_filter);
                //.populate('property');

                console.log('el iser es:',user_data);

            if (!user_data) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json({ data: user_data, message: 'Successful' });
        } else {
            return res.status(400).json({ error: 'Missing fields' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async createUserGoogle(req: Request, res: Response) {
    try {
      if (
        req.body.name &&
        req.body.email &&
        req.body.password &&
        req.body.birthday
        
      ) {

        console.log("estoy en register!!!!:",req.body.name);

        if (typeof req.body.password !== 'string') {
          throw new Error('Invalid password');
        }
      const password = await userServices.getEntries.encryptPassword(req.body.password);
        const user_params: IUser = {
          
          name: req.body.name,
          email: req.body.email,
          birthday: req.body.birthday,
          isAdmin: false,
          password: password
        };
        const user_data = await userServices.getEntries.createUserGoogle(user_params);
        const email = req.body.email;
        const userFound = await userServices.getEntries.filterUserEmail(email);

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



        return res
          .status(201)
          .json({ message: 'User created successfully', user: user_data,token: token, refreshToken: refreshToken, id: userFound._id });

      } else {
        return res.status(400).json({ error: 'Missing fields' });
      }
    } catch (error) {
      console.log('error', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  
  public async checkEmailExists(req: Request, res: Response) {
    try {
      const email = req.params.email; // Obtener el correo electrónico de los parámetros de la solicitud
      const isEmailRegistered = await userServices.getEntries.checkEmailExists(email);

      console.log('el isemailregistered es:',isEmailRegistered);
  
      return res.status(200).json({ isEmailRegistered });
    } catch (error) {
      console.error('Error checking email:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  

public async register(req: Request, res: Response) {
  try {
    console.log("REGiiisssSTERRRRRRR:",req.body.name,req.body.email,req.body.password,req.body.isAdmin, req.body.birthday)
      if (req.body.name && req.body.email && req.body.password && req.body.birthday) {

        console.log("estoy en register!!!!:",req.body.name);

      if (typeof req.body.password !== 'string') {
        throw new Error('Invalid password');
      }
    const password = await userServices.getEntries.encryptPassword(req.body.password);

    console.log('El password es!!!!!!!!!!!!!!:',password);

  


          const user_params: IUser = {
              name: req.body.name,
              email: req.body.email,
              password:password,  // Guarda la contraseña en texto claro y deja que el middleware la cifre
              isAdmin:req.body.isAdmin,
              birthday:req.body.birthday
          };

          const user_data = await userServices.getEntries.create(user_params);

          console.log('eeeeellllll user data es!!!!!!!!:',user_data);
          return res.status(201).json({ message: 'User registered successfully', user: user_data });
      } else {
          return res.status(400).json({ error: 'Missing fields' });
      }
  } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
  }
}




  public async updateUser(req: Request, res: Response) {
    try {
      if (req.params.id) {
        const user_data = await userServices.getEntries.findById(req.params.id);
        if (!user_data) {
          return res.status(404).json({ error: 'User not found' });
        }

        const user_params: IUser = {
          name: req.body.name || user_data.name,
          email: req.body.email || user_data.email,
          password: req.body.password || user_data.password,
          birthday:req.body.birthday || user_data.birthday
        };

        await userServices.getEntries.updateUser(user_params, { _id: req.params.id });
        const new_user_data = await userServices.getEntries.findById(req.params.id);
        return res.status(200).json({ data: new_user_data, message: 'Successful update' });
      } else {
        return res.status(400).json({ error: 'Missing ID parameter' });
      }
    } catch (error) {
      console.error('Error updating:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const user = await userServices.getEntries.delete(userId);
      return user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public async chatStartup(req: Request, res: Response) {
    try {
      console.log('entramos en chatstartup')
      const userId = req.params.id;
      const chats = await ChatSchema.find({
        $or: [
          { receiver: userId, },
          { sender: userId },
        ],
      }).exec()
      if (!chats) {
        console.log('No se han encontrado chats :(')
        return res.status(404).json({ message: 'Messages not found'})
      } else {
        console.log('Los chats', chats)
        return res.status(201).json({chats})
      }
    } catch (error) {
      return res.status(500).json({ error })
    }
  }
}
