import axios from "axios";
import config from "../config/config";
import Db from "../globals/db";
import Logger from "../globals/logger";
import Collective from "../models/collective";
import CollectiveTransaction from "../models/collectiveTransaction";
import FeeCollectiveTransaction from "../models/feeCollectiveTransaction";
import ICollective from "../models/interfaces/iCollective";
import ICollectiveTransaction from "../models/interfaces/iCollectiveTransaction";
import IFeeCollectiveTransaction from "../models/interfaces/iFeeCollectiveTransaction";
import IPaymentProcessor from "../models/interfaces/iPaymentProcessor";
import IUser from "../models/interfaces/iUser";
import PaymentProcessor from "../models/paymentProcessor";
import User from "../models/user";
const logger = Logger.getInstance();

export default class CollectivesService {

  private async insertFeeTransactions(collectiveTransaction: ICollectiveTransaction, contributor: IUser):
    Promise<IFeeCollectiveTransaction[]> {
    try {
      const query: IPaymentProcessor = {};
      if (contributor) {
        query.userPays = true;
      } else {
        query.collectivePays = true;
      }
      const paymentProcessors: IPaymentProcessor[] = await PaymentProcessor.find(query);
      if (!paymentProcessors || paymentProcessors.length === 0) {
        return null;
      }
      const feeTransactions: IFeeCollectiveTransaction[] = new Array(paymentProcessors.length);
      for (const processor of paymentProcessors) {
        let feeValue = 0;
        if (processor.txFixValue) {
          feeValue += processor.txFixValue;
        }
        if (processor.txPercent) {
          feeValue += (processor.txPercent * ((contributor === null) ? (-1 * collectiveTransaction.value) : collectiveTransaction.value));
        }
        const newFeeTransaction: IFeeCollectiveTransaction = {
          collectiveTransactionId: collectiveTransaction.id,
          paymentProcessor: processor,
          value: (contributor === null) ? (-1 * feeValue) : feeValue,
        };
        const dbFeeTransaction = new FeeCollectiveTransaction(newFeeTransaction);
        await FeeCollectiveTransaction.create(dbFeeTransaction);
        feeTransactions.push(dbFeeTransaction);
      }
      return feeTransactions;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async insertCollective(collective: ICollective) {
    try {
      const dbCollective = await Collective.create(collective);
      return dbCollective;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async insertCollectiveTransaction(
    collectiveTransaction: ICollectiveTransaction, collective: ICollective, contributor: IUser) {
    try {
      if (!contributor) {
        collectiveTransaction.value = (collectiveTransaction.value * (-1) );
      }
      const dbCollectiveTransaction = await CollectiveTransaction.create(collectiveTransaction);
      
      const feeCollectiveTransactions: IFeeCollectiveTransaction[] =
        await this.insertFeeTransactions(dbCollectiveTransaction, contributor);
      dbCollectiveTransaction.feeCollectiveTransactions = feeCollectiveTransactions;
      await CollectiveTransaction.update({_id: dbCollectiveTransaction.id}, dbCollectiveTransaction);

      if (collective.transactions) {
        collective.transactions.push(dbCollectiveTransaction);
      } else {
        collective.transactions = [dbCollectiveTransaction];
      }

      if (contributor) {
        if (collective.contributors) {
          collective.contributors.push(contributor);
        } else {
          collective.contributors = [contributor];
        }
      }

      collective.currentBalance += collectiveTransaction.value;
      const updatedCollective = await Collective.update({_id: collective.id}, collective);
      return dbCollectiveTransaction;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async getCollective(id: string) {
    try {
      const result = await Collective.findById(id);
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async getCollectiveByUser(userId: string) {
    try {
      const result = await Collective.findOne({creator: {id: userId}});
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async getAllCollectives(query: ICollective) {
    try {
      const result = await Collective.find(query);
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

}
