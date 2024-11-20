/* eslint-disable */
import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  property?: mongoose.Types.ObjectId[];
}

const schema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  property: [{ type: Schema.Types.ObjectId, ref: 'property' }]
});

// Middleware para cifrar la contraseña antes de guardarla
schema.pre<IUser>('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('Contraseña cifrada:', this.password);  // Este es el hash que se guarda en la base de datos
      next();
    } catch (err) {
      next(err as CallbackError);
    }
});

export default mongoose.model<IUser>('User', schema);
