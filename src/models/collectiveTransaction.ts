import { Model, model, Schema} from "mongoose";
import { feeCollectiveTransactionSchema } from "./feeCollectiveTransaction";
import { ICollectiveTransactionDocument } from "./interfaces/iCollectiveTransaction";

export const collectiveTransactionSchema = new Schema({
  collectiveId : { type: String, required: true},
  feeCollectiveTransactions: { type: [feeCollectiveTransactionSchema]},
  userId : { type: String, required: true},
  value : { type: Number },
});

export default model<ICollectiveTransactionDocument>("collectiveTransactions", collectiveTransactionSchema);
