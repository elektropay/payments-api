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
   * @api {post} /collectives Creates a Collectives
   * @apiGroup Collectives
   * @apiParam {String} title The title
   * @apiParam {String} creatorId The user Id
   * @apiParam {String} [description] the description
   */
  fastify.post("/collectives", async (request, reply) => {
    try {
      if (!request.body || !request.body.title || !request.body.creatorId) {
        reply.code(400).send({ msg: "Missing field title" });
      }
      const userService = new UsersService();
      const user: IUser = await userService.getUser(request.body.creatorId);
      if (!user) {
        throw new Error("User not found");
      }
      delete request.body.creatorId;
      const collectivesService = new CollectivesService();
      const collective: ICollective = request.body;
      collective.creator = user;
      const dbCollective = await collectivesService.insertCollective(collective);

      reply.code(200).send({ msg: "Collective succesfully inserted" });
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

  /**
   * @api {get} /collectives/:id Gets a Collective through its id
   * @apiGroup Collectives
   * @apiParam {String} id The collective id
   */
  fastify.get("/collectives/:id", async (request, reply) => {
    try {
      const collectivesService = new CollectivesService();
      const collective = await collectivesService.getCollective(request.params.id);
      reply.code(200).send(collective);
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

  /**
   * @api {get} /collectives Gets all Collectives (Accepts query params)
   * @apiGroup Collectives
   */
  fastify.get("/collectives", async (request, reply) => {
    try {
      const collectivesService = new CollectivesService();
      const collectives = await collectivesService.getAllCollectives(request.query);
      reply.code(200).send(collectives);
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

  /**
   * @api {post} /collectives/:collectiveId/users/:userId Makes a Collective send money to a user
   * @apiGroup Collectives
   * @apiParam {String} collectiveId The collective Id
   * @apiParam {String} userId The user Id
   * @apiParam {String} value The value
   */
  fastify.post("/collectives/:collectiveId/users/:userId", async (request, reply) => {
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
        .insertCollectiveTransaction(collectiveTransaction, collective, null);

      reply.code(200).send(dbCollectiveTx);
    } catch (error) {
      logger.error(error);
      reply.code(500).send(error);
    }
  });

}
