import express from "express";
import ServerController from "../controllers/Server";

const router = express.Router();

router.post("/create", ServerController.createServer);
router.get("/readAll", ServerController.getAllServers);
router.get("/read/:serverId", ServerController.getServerById);
router.get("/readByUser/:userId", ServerController.getServersByUser);
router.get("/readByGame/:game", ServerController.getServersByGame);
router.get("/stats/:serverId", ServerController.getServerStats);
router.get("/start/:serverId", ServerController.startServer);
router.get("/stop/:serverId", ServerController.stopServer);
router.put("/ops/:serverId", ServerController.addOrRemoveOps);
router.put("/changeOwner/:serverId", ServerController.changeOwner);
router.delete("/delete/:serverId", ServerController.deleteServer);
export default router;
