import axios from "axios";
import * as bcrypt from "bcrypt";
import config from "../config/config";
import Logger from "../globals/logger";
import IUser from "../models/interfaces/iUser";
import User from "../models/user";
const saltRounds = 10;
const logger = Logger.getInstance();

export default class UsersService {

  public async insertUser(user: IUser) {
    try {
      const salt = bcrypt.genSaltSync(saltRounds);
      user.password = bcrypt.hashSync(user.password, salt);
      const dbUser = await User.create(user);
      return dbUser;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async getUser(id: string) {
    try {
      const result = await User.findById(id);
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  public async getAllUsers(query: IUser) {
    try {
      const result = await User.find(query);
      return result;
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

}
