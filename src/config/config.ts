export default {
  database: {
    name: process.env.DB_NAME || "payments",
    options: {
      autoReconnect: process.env.AUTO_RECONNECT || true,
      connectTimeoutMS: process.env.CONNECT_TIMEOUT || 0,
      keepAlive: process.env.KEEP_ALIVE || 0,
      poolSize: process.env.DB_POOL_SIZE || 20,
      reconnectTries: process.env.RECONNECT_TRIES || 30,
      socketTimeoutMS: process.env.SOCKET_TIMEOUT || 0,
    },
    url: process.env.DB_URL || "mongodb://localhost",
  },
  host: process.env.HOST || "0.0.0.0",
  logLevel: process.env.LOG_LEVEL || "info",
  port: process.env.PORT || "3000",
};
