import config from "../config/config";
import * as mongoose from "mongoose";
import Logger from "../globals/logger";
import BulkPaymentProcessors from "../scripts/bulkPaymentProcessors";
const logger = Logger.getInstance();
mongoose.Promise = global.Promise;

export default class Db {
  private static instance: Db;

  public static getInstance() {
      if (!Db.instance) {
        Db.instance = new Db();
      }
      return Db.instance;
  }

  public async connect() {
    const mongodbUrl = config.database.url + "/" + config.database.name;
    const conn = await mongoose.connect(mongodbUrl, config.database.options);
    logger.info("Connected successfully to mongodb");
    await new BulkPaymentProcessors().bulkLoad();
    return conn;
  }

  public async disconnect() {
    logger.info("Disconnecting to mongodb");
    return mongoose.disconnect();
  }
}
