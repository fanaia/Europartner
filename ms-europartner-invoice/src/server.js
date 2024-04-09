require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const path = require("path");
const logger = require("./config/logger");

const indexRouter = require("./routers/indexRouter");
const osRouter = require("./routers/osRouter");

let server = null;

const start = async () => {
  const app = express();

  app.use(helmet());
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use("/api", indexRouter);
  app.use("/api/os", osRouter);

  app.use((error, req, res, next) => {
    logger.error(`${error.stack}`);
    res.status(500).send("Erro interno no servidor");
  });

  server = app.listen(process.env.PORT, () => {
    console.log(`Serviço ${process.env.SERVICE_NAME} subiu na porta ${process.env.PORT}`);
  });

  return server;
};

const stop = async () => {
  if (server) await server.close();
  return true;
};

module.exports = { start, stop };
