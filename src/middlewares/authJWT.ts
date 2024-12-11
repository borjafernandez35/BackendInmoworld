/* eslint-disable */
import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import reviews from "../reviews/schema";
import users from "../user/schema";
import properties from "../property/schema";
import IJwtPayload from '../middlewares/JWTPayload';
import * as userServices from '../user/service'

const _SECRET: string = 'api+jwt';



  
export async function verifyToken (req: Request, res: Response, next: NextFunction) {
    console.log("verifyToken");
    console.log('la cabecera es:',req.header("x-access-token"));
    
    const token = req.header("x-access-token");
    if (!token) return res.status(403).json({ message: "No token provided" });
    console.log(token);

  try {
    
    const decoded = jwt.verify(token, _SECRET) as IJwtPayload;
    console.log("verifyToken");
    console.log(decoded);
    req.userId= decoded.id;
    const user = await users.findById(decoded.id);
    console.log(user);
    if (!user) return res.status(404).json({ message: "No user found" });

    
    console.log("User verified:", user);
    return next();

  } catch (error) {
    return res.status(401).json({ message: "Unauthorized!" });
  }
};

export async function isOwner (req: Request, res: Response, next: NextFunction) {
  try {
   //const user = await users.find({userId: req.body._id});

    const propertyId = req.params.id;
    const property = await properties.findById(propertyId);

    if (!property) return res.status(403).json({ message: "No user found" });

    if (property.owner != req.body._id) return res.status(403).json({ message: "Not Owner" });

    console.log("Ownership verified.");
    return next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

export async function isOwnerorAdmin (req: Request, res: Response, next: NextFunction) {
  try {

    console.log('Verificando acceso del propetario');
   //const user = await users.find({userId: req.body._id});
   const token = req.header("x-access-token");
   if (!token) {
     return res.status(401).json({ message: 'Access Token Missing' });
   }

   const decoded = jwt.verify(token, _SECRET) as any; // Usa la clave secreta adecuada
   const userIdFromToken = req.userId;
   const isAdmin = decoded?.isAdmin;

   if (!userIdFromToken) {
     return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
   }

   // Si el usuario es admin, pasa directamente
   if (isAdmin) {
     console.log('Admin verified');
     return next();
   }


    const propertyId = req.params.id;
    const property = await properties.findById(propertyId);

    if (!property) return res.status(403).json({ message: "No user found" });

    if (property.owner != req.body._id) return res.status(403).json({ message: "Not Owner" });

    console.log("Ownership verified.");
    return next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

export async function reviewOwner (req: Request, res: Response, next: NextFunction) {
  try {
    
    const user = await users.findOne({userId: req.body._id});

    if (!user || !user._id) {
      return res.status(403).json({ message: "User not found" });
    }

    console.log("estas aqui: " + user!._id);

    const reviewId = req.params.id;
    const review = await reviews.findById(reviewId);

    if (!review || !review.user) {
      return res.status(403).json({ message: "Review not found" });
    }
    console.log("Post owner: " + review!.user);

    


    if (req.userId!=review.user) {
      return res.status(403).json({ message: "Not the owner" });
    }

    console.log("Review ownership verified.");
    return next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};

export async function reviewOwnerorAdmin (req: Request, res: Response, next: NextFunction) {
  try {

    console.log('Verificando acceso del comentario');
      
    const token = req.header("x-access-token");
    if (!token) {
      return res.status(401).json({ message: 'Access Token Missing' });
    }

    const decoded = jwt.verify(token, _SECRET) as any; // Usa la clave secreta adecuada
    const userIdFromToken = req.userId;
    const isAdmin = decoded?.isAdmin;

    if (!userIdFromToken) {
      return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
    }

    // Si el usuario es admin, pasa directamente
    if (isAdmin) {
      console.log('Admin verified');
      return next();
    }


    
    const user = await users.findOne({userId: req.body._id});

    if (!user || !user._id) {
      return res.status(403).json({ message: "User not found" });
    }

    console.log("estas aqui: " + user!._id);

    const reviewId = req.params.id;
    const review = await reviews.findById(reviewId);

    if (!review || !review.user) {
      return res.status(403).json({ message: "Review not found" });
    }
    console.log("Post owner: " + review!.user);

    


    if (req.userId!=review.user) {
      return res.status(403).json({ message: "Not the owner" });
    }

    console.log("Review ownership verified.");
    return next();

  } catch (error) {
    console.log(error)
    return res.status(500).send({ message: error });
  }
};



  export const AdminValidation = (req: Request, res: Response, next: NextFunction) => {
    console.log('Verifying admin');
    try {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access Token Missing' });
      }
  
      const decoded = jwt.verify(token, 'api+jwt') as any; // Asegúrate de usar la misma clave secreta
      if (!decoded.isAdmin) {
        return res.status(403).json({ message: 'You are not admin' });
      }
  
      console.log('Admin verified');
      return next();
    } catch (error) {
      console.error('Error verifying admin:', error);
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
    }
  };

 /*  export const verifyOwnership = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Verificando usuario');

      console.log('user Id:',req.userId);
  
      // ID del usuario autenticado (decodificado en verifyToken)
      const userIdFromToken = req.userId; 

      if (!userIdFromToken) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
      }

      console.log('el correo es:',req.body.email);
      console.log('el id params es:',req.params.id);
  
      // Verifica si el email proporcionado corresponde a un usuario
      //const email = req.body.email; 
      const user = await userServices.getEntries.findByIdUser(userIdFromToken);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('el user es:',user);
  
      // Compara los IDs para verificar propiedad
      
      const targetUserId = user._id; // Convertimos a string para comparación

      const id= targetUserId.toString();
      const id2= userIdFromToken.toString();

      console.log('el userid es:',userIdFromToken);
      console.log('el target Id es:',targetUserId);
      console.log('el IIIIDDDDDD es:', id);
      console.log('el IIIIDDDDDD es:', id2);

      if (id==id2) {
        console.log('Permiso concedido, pasando al siguiente middleware');
        return next();
      }
  
      // Si no coincide, retorna error de autorización
      return res.status(403).json({ message: 'Not Owner' });
  
    } catch (error) {
      console.error('Error en verifyOwnership:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }; */

  export const validateUserOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('Verificando acceso del usuario');
      
      const token = req.header("x-access-token");
      if (!token) {
        return res.status(401).json({ message: 'Access Token Missing' });
      }
  
      const decoded = jwt.verify(token, _SECRET) as any; // Usa la clave secreta adecuada
      const userIdFromToken = req.userId;
      const isAdmin = decoded?.isAdmin;
  
      if (!userIdFromToken) {
        return res.status(401).json({ message: 'Unauthorized: Missing user ID' });
      }
  
      // Si el usuario es admin, pasa directamente
      if (isAdmin) {
        console.log('Admin verified');
        return next();
      }

      
  
      // Si no es admin, verifica propiedad
      // Se espera que el ID del objetivo esté en los parámetros
      const user = await userServices.getEntries.findByIdUser(userIdFromToken);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('el usuario es:',user);

      const targetUserId = user._id; 

      const id= targetUserId.toString();
      const id2= userIdFromToken.toString();

      console.log('el userid es:',userIdFromToken);
      console.log('el target Id es:',targetUserId);
      console.log('el IIIIDDDDDD es:', id);
      console.log('el IIIIDDDDDD es:', id2);

      if (id==id2) {
        console.log('Owner verified');
        return next();
      }
  
      return res.status(403).json({ message: 'Not Owner' });
    } catch (error) {
      console.error('Error verifying access:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

