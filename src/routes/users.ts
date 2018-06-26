
import config from "../config/config";
import Logger from "../globals/logger";
import Collective from "../models/collective";
import ICollective from "../models/interfaces/iCollective";
import ICollectiveTransaction from "../models/interfaces/iCollectiveTransaction";
import IUser from "../models/interfaces/iUser";
import CollectivesService from "../services/collectives";
import UsersService from "../services/users";
const logger = Logger.getInstance();

export function setupRoutes(fastify) {

  /**
   * @api {post} /users Creates a User
   * @apiGroup Users
   * @apiParam {String} name The user name
   * @apiParam {String} email The user email
   * @apiParam {String} password The user password
   */
  fastify.post("/users", async (request, reply) => {
    try {
      if (!request.body || !request.body.name ||
          !request.body.email || !request.body.password) {
        reply.code(400).send({ msg: "Missing field" });
      }
      const user: IUser = request.body;
      const userService = new UsersService();

      await userService.insertUser(user);
      reply.code(200).send({ msg: "User succesfully inserted" });
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

  /**
   * @api {get} /users/:id Gets a User through its id
   * @apiGroup Users
   * @apiParam {String} id The user id
   */
  fastify.get("/users/:id", async (request, reply) => {
    try {
      const userService = new UsersService();
      const user = await userService.getUser(request.params.id);
      reply.code(200).send(user);
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

  /**
   * @api {get} /users Gets all Users (Accepts query params)
   * @apiGroup Users
   */
  fastify.get("/users", async (request, reply) => {
    try {
      const userService = new UsersService();
      const users = await userService.getAllUsers(request.query);
      reply.code(200).send(users);
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

  /**
   * @api {post} /users/:id/collectives Creates a Collective for a given user
   * @apiGroup Users
   * @apiParam {String} title The title
   * @apiParam {String} [description] the description
   */
  fastify.post("/users/:id/collectives", async (request, reply) => {
    try {
      if (!request.body || !request.body.title) {
        reply.code(400).send({ msg: "Missing field title" });
      }
      const userService = new UsersService();
      const user: IUser = await userService.getUser(request.params.id);
      if (!user) {
        throw new Error("User not found");
      }
      const collectivesService = new CollectivesService();
      const collective: ICollective = request.body;
      collective.creator = user;
      const dbCollective = await collectivesService.insertCollective(collective);

      reply.code(200).send(dbCollective);
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

  /**
   * @api {post} /collectives/:collectiveId/users/:userId Makes a user send money to a collective
   * @apiGroup Users
   * @apiParam {String} userId The user Id
   * @apiParam {String} collectiveId The collective Id
   * @apiParam {String} value The value
   */
  fastify.post("/users/:userId/collectives/:collectiveId", async (request, reply) => {
    try {
      if (!request.body || !request.body.value) {
        reply.code(400).send({ msg: "Missing field value" });
      }
      const userService = new UsersService();
      const user: IUser = await userService.getUser(request.params.userId);
      if (!user) {
        throw new Error("User not found");
      }
      const collectivesService = new CollectivesService();
      const collective: ICollective = await collectivesService.getCollective(request.params.collectiveId);
      if (!collective) {
        throw new Error("Collective not found");
      }
      const collectiveTransaction: ICollectiveTransaction = {
        collectiveId : collective.id,
        userId : user.id,
        value : request.body.value,
      };
      const dbCollectiveTx = await collectivesService
        .insertCollectiveTransaction(collectiveTransaction, collective, user);

      reply.code(200).send(dbCollectiveTx);
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

}
