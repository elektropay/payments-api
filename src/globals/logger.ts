import * as mongoose from "mongoose";
import * as pino from "pino";
import config from "../config/config";
mongoose.Promise = global.Promise;

export default class Logger {
  private static instance: Logger;

  private pino: any = pino({ level: config.logLevel });

  public static getInstance() {
      if (!Logger.instance) {
        Logger.instance = new Logger();
      }
      return Logger.instance;
  }

  public info(message: string) {
    this.pino.info(message);
  }

  public error(error: string | Error) {
    this.pino.error(error);
  }
}
