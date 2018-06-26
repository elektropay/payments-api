import mongoose, { Model, model, Schema} from "mongoose";
import { IUserDocument } from "./interfaces/iUser";

export const userSchema = new Schema({
  email : { type: String, required: true, unique: true },
  name : { type: String, required: true, unique: true },
  password : { type: String, required: true },
});

export default model<IUserDocument>("users", userSchema);
