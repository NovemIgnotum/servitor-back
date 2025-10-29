"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config/config"));
const Logging_1 = __importDefault(require("./library/Logging"));
const cors_1 = __importDefault(require("cors"));
const express = require("express");
const router = express();
const cloudinary = require("cloudinary");
mongoose_1.default
    .set("strictQuery", false)
    .connect(`${config_1.default.mongooseUrl}`, { retryWrites: true, w: "majority" })
    .then(() => {
    Logging_1.default.info("mongoDB is cennected");
    startServer();
})
    .catch((error) => {
    Logging_1.default.error("Unable to connect");
    Logging_1.default.error(error);
});
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.API_KEY_CLOUDINARY,
    api_secret: process.env.API_SECRET_CLOUDINARY,
});
const User_1 = __importDefault(require("./routes/User"));
const Server_1 = __importDefault(require("./routes/Server"));
const server = http_1.default.createServer(router);
const startServer = () => {
    const allowedOrigins = ["http://localhost:3000"];
    const options = {
        origin: allowedOrigins,
    };
    router.use((0, cors_1.default)(options));
    router.use(express.json({}));
    router.use((req, res, next) => {
        res.on("finish", () => {
            Logging_1.default.info(`Server Started -> Methode: [${req.method}] - Url: [${req.originalUrl}] - Ip: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`);
        });
        next();
    });
    router.use(express.urlencoded({ extended: true }));
    router.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-with, Content-Type, Accept,Authorization");
        if (req.method == "OPTIONS") {
            res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
            return res.status(200).json({});
        }
        next();
    });
    router.use("/api/user", User_1.default);
    router.use("/api/server", Server_1.default);
    router.all("/", (req, res) => {
        return res.status(200).send({
            message: "welcome to the API",
        });
    });
    router.use((req, res) => {
        const error = new Error(`Route has been not found -> Methode: [${req.method}] - Url: [${req.originalUrl}] - Ip: [${req.socket.remoteAddress}]`);
        Logging_1.default.error(error.message);
        return res.status(404).json(error.message);
    });
    server.listen(config_1.default.port, () => Logging_1.default.info(`Server is started on new port ${config_1.default.port}`));
};
process.on("uncaughtException", (err) => {
    console.error("Erreur critique non gérée ! Redémarrage en cours...", err);
    setTimeout(() => process.exit(1), 1000);
});
process.on("unhandledRejection", (reason, promise) => {
    console.error("Rejection non gérée détectée à", promise, "raison :", reason);
    setTimeout(() => process.exit(1), 1000);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLGdEQUF3QjtBQUN4Qix3REFBZ0M7QUFDaEMsNkRBQXFDO0FBQ3JDLGdFQUF3QztBQUN4QyxnREFBd0I7QUFFeEIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25DLE1BQU0sTUFBTSxHQUFHLE9BQU8sRUFBRSxDQUFDO0FBQ3pCLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUd6QyxrQkFBUTtLQUNMLEdBQUcsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDO0tBQ3pCLE9BQU8sQ0FBQyxHQUFHLGdCQUFNLENBQUMsV0FBVyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQztLQUN0RSxJQUFJLENBQUMsR0FBRyxFQUFFO0lBQ1QsaUJBQU8sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNyQyxXQUFXLEVBQUUsQ0FBQztBQUNoQixDQUFDLENBQUM7S0FDRCxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtJQUNmLGlCQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDbkMsaUJBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFFTCxVQUFVLENBQUMsTUFBTSxDQUFDO0lBQ2hCLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWU7SUFDdkMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCO0lBQ3ZDLFVBQVUsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQjtDQUM5QyxDQUFDLENBQUM7QUFHSCx5REFBdUM7QUFDdkMsNkRBQTJDO0FBRTNDLE1BQU0sTUFBTSxH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