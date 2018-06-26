import mongoose, { Model, model, Schema} from "mongoose";
import { collectiveTransactionSchema } from "./collectiveTransaction";
import { ICollectiveDocument } from "./interfaces/iCollective";
import { userSchema } from "./user";

const collectiveSchema = new Schema({
  contributors : { type: [userSchema] },
  creator: {type: userSchema, required: true},
  currentBalance : { type: Number, default: 0 },
  description : { type: String },
  title : { type: String, required: true },
  transactions : { type: [collectiveTransactionSchema] },
});

export default model<ICollectiveDocument>("collectives", collectiveSchema);
