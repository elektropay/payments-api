import config from "../config/config";
import Logger from "../globals/logger";
const logger = Logger.getInstance();

export function setupRoutes(fastify) {
  /**
   * @api {get} /ping Healthcheck endpoint
   * @apiGroup Healtcheck
   */
  fastify.get("/ping", (request, reply) => {
    logger.info("Ping completed successfully");
    reply.code(200).send({ ping: true });
  });
}
