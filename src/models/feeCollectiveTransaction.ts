import { Model, model, Schema} from "mongoose";
import { IFeeCollectiveTransactionDocument } from "./interfaces/iFeeCollectiveTransaction";
import { paymentProcessorsSchema } from "./paymentProcessor";

export const feeCollectiveTransactionSchema = new Schema({
  collectiveTransactionId : { type: String, required: true },
  paymentProcessor : { type: paymentProcessorsSchema, required: true},
  value : { type: Number, required: true },
});

export default model<IFeeCollectiveTransactionDocument>("feeCollectiveTransactions", feeCollectiveTransactionSchema);
