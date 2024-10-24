import { Request, Response } from 'express';
import { IUser } from '../user/model';
import * as userServices from '../user/service';

export class userController {
    public async createUser(req: Request, res: Response) {

      try{
        if (req.body.name  && req.body.email && req.body.password) {
            const user_params: IUser = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
                //active: true
            };
            const user_data = await userServices.getEntries.create(user_params);
            return res.status(201).json({ message: 'User created successfully', user: user_data });
        }else{            
            return res.status(400).json({ error: 'Missing fields' });
        }
    }catch(error){
        return res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  public async getAll(req: Request, res: Response) {
    try {
      //const user_filter = {};
      const user_data = await userServices.getEntries.getAll();
      const total = user_data.length;
      console.log("paginas recibidas:",req.params.page);
      console.log("limite:",req.params.limit);
      const page = Number(req.params.page); // Convertir a número
      const limit = Number(req.params.limit); // Convertir a número
      if(limit==0&&page==1){
        console.log("los usuarios son:",user_data);
        const totalPages=1;
        return res.status(200).json({users: user_data, totalPages: totalPages, totalUser: total});

      }else{
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const totalPages = Math.ceil(total / limit);

      const resultUser = user_data.slice(startIndex, endIndex);
      console.log(startIndex,endIndex); 
      console.log(resultUser);
      console.log("numero de usurarios:",total);
      console.log("Numero de paginas:",totalPages);
      return res
        .status(200)
        .json({ users: resultUser, totalPages: totalPages, totalUser: total });
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
        // Fetch user
        const user_data = await userServices.getEntries.findById(user_filter);
        // Send success response
        return res.status(200).json({ data: user_data, message: 'Successful' });
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
       const user_filter = { _id: req.params.id };
        // Fetch user
        const user_data = await userServices.getEntries.findById(req.params.id)
        if (!user_data) {
          // Send failure response if user not found
          return res.status(400).json({ error: 'User not found' });
        }

        const user_params: IUser = {
          name: req.body.name || user_data.name,
          email: req.body.email || user_data.email,         
          password: req.body.password || user_data.password
          
        };
        await userServices.getEntries.updateUser(user_params, user_filter);
        //get new user data
        const new_user_data = await userServices.getEntries.findById(req.params.id);
        // Send success response
        return res
          .status(200)
          .json({ data: new_user_data, message: 'Successful update' });
      } else {
        // Send error response if ID parameter is missing
        return res.status(400).json({ error: 'Missing ID parameter' });
      }
    } catch (error) {
      // Catch and handle any errors
      console.error('Error updating:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;

    return userServices.getEntries.delete(userId)
        .then((user) => (user ? res.status(201).json({ user, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
  }
}
