import config from "../config/config";
import Logger from "../globals/logger";
const logger = Logger.getInstance();

export function setupRoutes(fastify) {
  /**
   * @api {get} /ping Healthcheck endpoint
   * @apiGroup Healtcheck
   */
  fastify.get("/documentation", (request, reply) => {
    reply.sendFile("index.html");
  });
}
