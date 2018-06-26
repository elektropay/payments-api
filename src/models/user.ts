import mongoose, { Model, model, Schema} from "mongoose";
import { IUserDocument } from "./interfaces/iUser";

export const userSchema = new Schema({
  name : { type: String, required: true, unique: true },
  email : { type: String, required: true, unique: true },
  password : { type: String, required: true },
});


export default model<IUserDocument>("users", userSchema);
