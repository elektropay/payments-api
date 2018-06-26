import { Document } from "mongoose";

export default interface IUser {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
}

export type IUserDocument = IUser & Document;
