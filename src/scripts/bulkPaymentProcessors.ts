import config from "../config/config";
import Logger from "../globals/logger";
import IPaymentProcessor from "../models/interfaces/iPaymentProcessor";
import PaymentProcessor from "../models/paymentProcessor";
const logger = Logger.getInstance();

export default class BulkPaymentProcessors {

  private async checkIfExists(model: IPaymentProcessor) {
    try {
      const count = await PaymentProcessor.count({name: model.name});
      if (!count || count <= 0) {
        await PaymentProcessor.create(model);
      }
      return count;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async bulkLoad() {
    try {
      logger.info("Initializing database");
      await this.checkIfExists(new PaymentProcessor({
        collectivePays: false,
        name: "openCollective",
        txPercent: 0.05,
        userPays: true,
      }));
      await this.checkIfExists(new PaymentProcessor({
        collectivePays: false,
        name: "fiscalSponsor",
        txPercent: 0.05,
        userPays: true,
      }));
      await this.checkIfExists(new PaymentProcessor({
        collectivePays: false,
        name: "stripe",
        txFixValue: 0.30,
        txPercent: 0.029,
        userPays: true,
      }));
      await this.checkIfExists(new PaymentProcessor({
        collectivePays: true,
        name: "payPal",
        txFixValue: 0.30,
        txPercent: 0.029,
        userPays: false,
      }));
      logger.info("Finishing database initialization");
      return true;
    } catch (error) {
      logger.error(error);
    }
  }
}
