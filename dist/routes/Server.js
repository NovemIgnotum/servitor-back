"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Server_1 = __importDefault(require("../controllers/Server"));
const router = express_1.default.Router();
router.post("/create", Server_1.default.createServer);
router.get("/readAll", Server_1.default.getAllServers);
router.get("/read/:serverId", Server_1.default.getServerById);
router.get("/readByUser/:userId", Server_1.default.getServersByUser);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3JvdXRlcy9TZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBOEI7QUFDOUIsbUVBQXFEO0FBRXJELE1BQU0sTUFBTSxHQUFHLGlCQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7QUFFaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDdEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5RCxNQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFckUsa0JBQWUsTUFBTSxDQUFDIn0=