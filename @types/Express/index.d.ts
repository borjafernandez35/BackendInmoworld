import { IUser } from '../../src/user/model';

declare global {
  namespace Express {
    interface Request {
      userId: IUser['_id'];
    }
  }
}