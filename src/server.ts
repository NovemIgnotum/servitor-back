import { Request, Response, NextFunction } from "express";
import http from "http";
import mongoose from "mongoose";
import config from "./config/config";
import Logging from "./library/Logging";
import cors from "cors";

const express = require("express");
const router = express();
const cloudinary = require("cloudinary");

// mongoose connection
mongoose
  .set("strictQuery", false)
  .connect(`${config.mongooseUrl}`, { retryWrites: true, w: "majority" })
  .then(() => {
    Logging.info("mongoDB is cennected");
    startServer();
  })
  .catch((error) => {
    Logging.error("Unable to connect");
    Logging.error(error);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY_CLOUDINARY,
  api_secret: process.env.API_SECRET_CLOUDINARY,
});

// ROUTES
import UserRoutes from "./routes/User";
import ServerRoutes from "./routes/Server";

const server = http.createServer(router);

const startServer = () => {
  const allowedOrigins = ["http://localhost:3000"];

  const options: cors.CorsOptions = {
    origin: allowedOrigins,
  };

  // Then pass these options to cors:
  router.use(cors(options));
  router.use(express.json({}));

  router.use((req: Request, res: Response, next: NextFunction) => {
    res.on("finish", () => {
      Logging.info(
        `Server Started -> Methode: [${req.method}] - Url: [${req.originalUrl}] - Ip: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });
    next();
  });

  router.use(express.urlencoded({ extended: true }));

  // The rules of the API
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-with, Content-Type, Accept,Authorization"
    );
    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }
    next();
  });

  // CRUDS
  router.use("/api/user", UserRoutes);
  router.use("/api/server", ServerRoutes);

  router.all("/", (req: Request, res: Response) => {
    return res.status(200).send({
      message: "welcome to the API",
    });
  });

  /**Error handling */
  router.use((req: Request, res: Response) => {
    const error = new Error(
      `Route has been not found -> Methode: [${req.method}] - Url: [${req.originalUrl}] - Ip: [${req.socket.remoteAddress}]`
    );

    Logging.error(error.message);
    return res.status(404).json(error.message);
  });

  server.listen(config.port, () =>
    Logging.info(`Server is started on new port ${config.port}`)
  );
};

process.on("uncaughtException", (err) => {
  console.error("Erreur critique non gérée ! Redémarrage en cours...", err);
  setTimeout(() => process.exit(1), 1000);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Rejection non gérée détectée à", promise, "raison :", reason);
  setTimeout(() => process.exit(1), 1000);
});
