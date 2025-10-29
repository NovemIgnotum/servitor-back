import express from "express";
import ServerController from "../controllers/Server";

const router = express.Router();

router.post("/create", ServerController.createServer);
router.get("/readAll", ServerController.getAllServers);
router.get("/read/:serverId", ServerController.getServerById);
router.get("/readByUser/:userId", ServerController.getServersByUser);

export default router;
