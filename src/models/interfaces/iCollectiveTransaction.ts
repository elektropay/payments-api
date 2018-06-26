import { Document } from "mongoose";
import IFeeCollectiveTransaction from "./iFeeCollectiveTransaction";

export default interface ICollectiveTransaction {
  id?: string;
  userId: string;
  collectiveId: string;
  value: number;
  feeCollectiveTransactions?: IFeeCollectiveTransaction[];
}

export type ICollectiveTransactionDocument = ICollectiveTransaction & Document;
