import { Document } from "mongoose";

export default interface IPaymentProcessor {
  id?: string;
  collectivePays?: boolean;
  name?: string;
  txPercent?: number;
  txFixValue?: number;
  userPays?: boolean;
}

export type IPaymentProcessorDocument = IPaymentProcessor & Document;
