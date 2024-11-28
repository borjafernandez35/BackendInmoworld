/* eslint-disable */
import { Request, Response } from 'express';
import { IUser } from '../user/model';
import * as userServices from '../user/service';
//import bcrypt from 'bcryptjs'; // Solo importa bcrypt una vez aquí

export class userController {

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
        if (req.params.id) {
            const user_filter = req.params.id;

            // Usa populate en la consulta activa
            const user_data = await userServices.getEntries
                .findById(user_filter)
                .populate('property');

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

  
  

 /*  public async login(req: Request, res: Response) {
    try {
        // Verificar si se proporcionaron los campos requeridos
        if (req.body.username && req.body.password) {
            const user_filter = req.body.username;
            const user_data = await userServices.getEntries.findByName(user_filter);

            if (user_data) {
                const inputPassword = req.body.password.trim();
                const storedHash = user_data.password.trim();
                console.log('Comparando inputPassword y storedHash...');
                console.log('inputPassword (longitud):', inputPassword.length, 'Contenido:', inputPassword);
                console.log('storedHash (longitud):', storedHash.length, 'Contenido:', storedHash);

                const isPasswordValid = await bcrypt.compare(inputPassword, storedHash);
                console.log('Resultado de bcrypt.compare:', isPasswordValid);

                if (!isPasswordValid) {
                    // Verificar si es el usuario Admin
                    if (user_data.name === 'Admin' && inputPassword === 'Administrador') {
                        return res.status(200).json({ data: user_data, message: 'Admin' });
                    } else {
                      return res.status(401).json({ message: 'Error, wrong username or password' });
                    }
                } else {
                  return res.status(201).json({ data: user_data, message: 'Login Successful' });
                }
            } else {
                return res.status(404).json({ message: 'User not found' });
            }
        } else {
            return res.status(400).json({ message: 'Missing fields' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} */

  

public async register(req: Request, res: Response) {
  try {
    console.log("REGiiisssSTERRRRRRR:",req.body.name,req.body.email,req.body.password,req.body.isAdmin)
      if (req.body.name && req.body.email && req.body.password) {

        console.log("estoy en register!!!!:",req.body.name);


          const user_params: IUser = {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,  // Guarda la contraseña en texto claro y deja que el middleware la cifre
              isAdmin:req.body.isAdmin
          };

          const user_data = await userServices.getEntries.create(user_params);
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
          password: req.body.password || user_data.password
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
}
