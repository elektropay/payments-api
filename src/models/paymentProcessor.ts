import mongoose, { Model, model, Schema} from "mongoose";
import { IPaymentProcessorDocument } from "./interfaces/iPaymentProcessor";

export const paymentProcessorsSchema = new Schema({
  collectivePays : { type: Boolean },
  name : { type: String, required: true },
  txFixValue : { type: Number},
  txPercent : { type: Number },
  userPays : { type: Boolean },
});

export default model<IPaymentProcessorDocument>("paymentProcessors", paymentProcessorsSchema);
