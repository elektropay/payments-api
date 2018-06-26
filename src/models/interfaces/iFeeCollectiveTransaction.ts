import { Document } from "mongoose";
import IPaymentProcessor from "./iPaymentProcessor";

export default interface IFeeCollectiveTransaction {
  id?: string;
  collectiveTransactionId?: string;
  paymentProcessor?: IPaymentProcessor;
  value?: number;
}

export type IFeeCollectiveTransactionDocument = IFeeCollectiveTransaction & Document;
