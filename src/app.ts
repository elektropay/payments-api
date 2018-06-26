import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as FastifyMaster from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import * as path from "path";
import config from "./config/config";
import Db from "./globals/db";
import Logger from "./globals/logger";
import * as collectiveRoutes from "./routes/collectives";
import * as documentationRoutes from "./routes/documentation";
import * as pingRoutes from "./routes/ping";
import * as userRoutes from "./routes/users";
const logger = Logger.getInstance();

type Fastify = FastifyInstance<Server, IncomingMessage, ServerResponse>;
type FastifyReq = FastifyRequest<IncomingMessage>;
type FastifyRes = FastifyReply<ServerResponse>;

export default class App {
  private fastify: Fastify;

  constructor() {
    this.fastify = FastifyMaster();
    this.fastify.use(require("cors")());
    this.fastify.register(require("fastify-static"), {
      root: path.join(__dirname, "../docs"),
    });
    userRoutes.setupRoutes(this.fastify);
    pingRoutes.setupRoutes(this.fastify);
    collectiveRoutes.setupRoutes(this.fastify);
    documentationRoutes.setupRoutes(this.fastify);
  }

  public getFastify() {
    return this.fastify;
  }

  public async startServer() {
    await Db.getInstance().connect();
    this.fastify.listen(+config.port, config.host, (err) => {
      if (err) {
        logger.error(err);
        process.exit(1);
      }
      const parsedAddress = JSON.parse(JSON.stringify(this.fastify.server.address()));
      logger.info(`server listening on ${parsedAddress.address + ":" + parsedAddress.port}`);
    });
  }

}
