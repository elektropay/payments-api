import { Document } from "mongoose";
import IFeeCollectiveTransaction from "./iFeeCollectiveTransaction";
import IUser from "./iUser";

export default interface ICollective {
  contributors?: IUser[];
  creator?: IUser;
  currentBalance?: number;
  description?: string;
  id?: string;
  title?: string;
  transactions?: IFeeCollectiveTransaction[];
}

export type ICollectiveDocument = ICollective & Document;
