"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Retour_1 = __importDefault(require("../library/Retour"));
const Minecraft_1 = require("../handler/Minecraft");
const getServerAddress_1 = require("../utils/getServerAddress");
const Server_1 = __importDefault(require("../models/Server"));
const User_1 = __importDefault(require("../models/User"));
const mcHandler = new Minecraft_1.MinecraftHandler();
const createServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, owner, game, port } = req.body;
        const server = new Server_1.default({
            name,
            owner,
            game,
            ipAddress: "",
            port,
            containerId: "",
            rconPassword: "",
        });
        const dockerInfo = yield mcHandler.createContainer(server);
        server.containerId = Object(dockerInfo).containerId;
        server.rconPassword = Object(dockerInfo).rconPassword;
        try {
            const hostPublicIP = process.env.HOST_PUBLIC_IP ||
                req.hostname ||
                req.socket.remoteAddress ||
                "127.0.0.1";
            const addr = yield (0, getServerAddress_1.getGameServerAddress)(server.containerId, hostPublicIP);
            server.ipAddress = addr.address || hostPublicIP;
        }
        catch (addrErr) {
            server.ipAddress =
                process.env.HOST_PUBLIC_IP ||
                    req.hostname ||
                    req.socket.remoteAddress ||
                    "";
        }
        server.status = "running";
        yield server.save();
        Retour_1.default.success("Server created successfully");
        return res.status(201).json({
            message: "Server created successfully",
            server,
        });
    }
    catch (error) {
        Retour_1.default.error("Error while creating server");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const getAllServers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const servers = yield Server_1.default.find();
        Retour_1.default.success("Fetched all servers");
        return res.status(200).json({ servers });
    }
    catch (error) {
        Retour_1.default.error("Error while fetching servers");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const getServerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const server = yield Server_1.default.findById(serverId);
        if (!server) {
            Retour_1.default.error("Server not found");
            return res.status(404).json({ message: "Server not found" });
        }
        Retour_1.default.success("Fetched server");
        return res.status(200).json({ server });
    }
    catch (error) {
        Retour_1.default.error("Error while fetching server");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const getServersByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield User_1.default.findById(userId);
        if (!user) {
            Retour_1.default.error("User not found");
            return res.status(404).json({ message: "User not found" });
        }
        const servers = yield Server_1.default.find({ owner: userId });
        Retour_1.default.success("Fetched user's servers");
        return res.status(200).json({ servers });
    }
    catch (error) {
        Retour_1.default.error("Error while fetching user's servers");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const getServersByGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { game } = req.params;
        const foundedServers = yield Server_1.default.find({ game: game });
        Retour_1.default.success("Fetched servers by game");
        return res.status(200).json({ servers: foundedServers });
    }
    catch (error) {
        Retour_1.default.error("Error while fetching servers by game");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const stopServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const server = yield Server_1.default.findById(serverId);
        if (!server) {
            Retour_1.default.error("Server not found");
            return res.status(404).json({ message: "Server not found" });
        }
        if (server.status === "stopped") {
            Retour_1.default.error("Server is already stopped");
            return res.status(400).json({ message: "Server is already stopped" });
        }
        yield mcHandler.stopContainer(server.containerId);
        server.status = "stopped";
        yield server.save();
        Retour_1.default.success("Stopping server");
        return res.status(200).json({ message: "Stopping server" });
    }
    catch (error) {
        Retour_1.default.error("Error while stopping server");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const startServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const server = yield Server_1.default.findById(serverId);
        if (!server) {
            Retour_1.default.error("Server not found");
            return res.status(404).json({ message: "Server not found" });
        }
        if (server.status === "running") {
            Retour_1.default.error("Server is already running");
            return res.status(400).json({ message: "Server is already running" });
        }
        yield mcHandler.startContainer(server.containerId);
        server.status = "running";
        yield server.save();
        Retour_1.default.success("Starting server");
        return res.status(200).json({ message: "Starting server" });
    }
    catch (error) {
        Retour_1.default.error("Error while starting server");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const addOrRemoveOps = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const { ops, requester } = req.body;
        if (!ops || !requester) {
            Retour_1.default.error("Missing parameters");
            return res.status(400).json({ message: "Missing parameters" });
        }
        const server = yield Server_1.default.findById(serverId);
        if (!server) {
            Retour_1.default.error("Server not found");
            return res.status(404).json({ message: "Server not found" });
        }
        const requesterUser = yield User_1.default.findById(requester);
        if (!requesterUser ||
            Object(requesterUser)._id.toString() !== server.owner.toString()) {
            Retour_1.default.error("Unauthorized operation");
            return res.status(403).json({ message: "Unauthorized operation" });
        }
        for (const op of ops) {
            console.log(`Processing op: ${op}`);
            const foundedUser = yield User_1.default.findById(op);
            if (!foundedUser) {
                Retour_1.default.error(`User with id ${op} not found`);
                return res
                    .status(404)
                    .json({ message: `User with id ${op} not found` });
            }
            console.log(`Found user: ${foundedUser.email}`);
            if (Object(server).operators.includes(op)) {
                Object(server).operators = Object(server).operators.filter((existingOp) => existingOp.toString() !== op.toString());
                console.log(`Removed op: ${foundedUser.email}`);
            }
            else {
                Object(server).operators.push(op);
                console.log(`Added op: ${foundedUser.email}`);
            }
        }
        yield server.save();
        Retour_1.default.success("Updated server ops successfully");
        return res
            .status(200)
            .json({ message: "Updated server ops successfully", server: server });
    }
    catch (error) {
        Retour_1.default.error("Error while updating server ops");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const getServerStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const server = yield Server_1.default.findById(serverId);
        if (!server) {
            Retour_1.default.error("Server not found");
            return res.status(404).json({ message: "Server not found" });
        }
        if (!server.containerId) {
            Retour_1.default.error("Server has no container id");
            return res.status(400).json({ message: "Server has no container id" });
        }
        const stats = yield mcHandler.getStats(server.containerId);
        console.log("Container stats:", stats);
        const players = yield mcHandler.getPlayerInfo(server.containerId, server.rconPassword);
        console.log(`Current players: ${players}`);
        console.log(players);
        Retour_1.default.success("Fetched server stats");
        return res.status(501).json({ message: "Not implemented" });
    }
    catch (error) {
        Retour_1.default.error("Error while fetching server stats");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const changeOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { serverId } = req.params;
        const { newOwner, requester, passingOps } = req.body;
        if (!newOwner || !requester || passingOps === undefined) {
            Retour_1.default.error("Missing parameters");
            return res.status(400).json({ message: "Missing parameters" });
        }
        if (newOwner === requester) {
            Retour_1.default.error("New owner cannot be the same as requester");
            return res
                .status(400)
                .json({ message: "New owner cannot be the same as requester" });
        }
        const server = yield Server_1.default.findById(serverId);
        if (!server) {
            Retour_1.default.error("Server not found");
            return res.status(404).json({ message: "Server not found" });
        }
        if (server.owner.toString() !== requester) {
            Retour_1.default.error("Unauthorized operation");
            return res.status(403).json({ message: "Unauthorized operation" });
        }
        const FoundedNewOwner = yield User_1.default.findById(newOwner);
        if (!FoundedNewOwner) {
            Retour_1.default.error("New owner not found");
            return res.status(404).json({ message: "New owner not found" });
        }
        if (passingOps) {
            Object(server).operators.push(server.owner);
        }
        if (server.operators.includes(newOwner)) {
            Object(server).operators = Object(server).operators.filter((op) => op.toString() !== newOwner.toString());
        }
        server.owner = newOwner;
        yield server.save();
        Retour_1.default.success("Server owner changed successfully");
        return res
            .status(200)
            .json({ message: "Server owner changed successfully", server });
    }
    catch (error) {
        Retour_1.default.error("Error while changing server owner");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
const deleteServer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(501).json({ message: "Not implemented" });
    }
    catch (error) {
        Retour_1.default.error("Error while deleting server");
        return res.status(500).json({ message: "Internal server error", error });
    }
});
exports.default = {
    createServer,
    getAllServers,
    getServerById,
    getServersByUser,
    getServersByGame,
    getServerStats,
    startServer,
    stopServer,
    addOrRemoveOps,
    changeOwner,
    deleteServer,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NvbnRyb2xsZXJzL1NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUNBLCtEQUF1QztBQUN2QyxvREFBd0Q7QUFDeEQsZ0VBQWlFO0FBR2pFLDhEQUEyQztBQUMzQywwREFBdUM7QUFFdkMsTUFBTSxTQUFTLEdBQUcsSUFBSSw0QkFBZ0IsRUFBRSxDQUFDO0FBRXpDLE1BQU0sWUFBWSxHQUFHLENBQU8sR0FBWSxFQUFFLEdBQWEsRUFBRSxFQUFFO0lBQ3pELElBQUksQ0FBQztRQUNILE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1FBRTdDLE1BQU0sTUFBTSxHQUFHLElBQUksZ0JBQVcsQ0FBQztZQUM3QixJQUFJO1lBQ0osS0FBSztZQUNMLElBQUk7WUFDSixTQUFTLEVBQUUsRUFBRTtZQUNiLElBQUk7WUFDSixXQUFXLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxFQUFFO1NBQ2pCLENBQUMsQ0FBQztRQUVILE1BQU0sVUFBVSxHQUFHLE1BQU0sU0FBUyxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRCxNQUFNLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDcEQsTUFBTSxDQUFDLFlBQVksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsWUFBWSxDQUFDO1FBR3RELElBQUksQ0FBQztZQUNILE1BQU0sWUFBWSxHQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWM7Z0JBQzFCLEdBQUcsQ0FBQyxRQUFRO2dCQUNaLEdBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYTtnQkFDeEIsV0FBVyxDQUFDO1lBQ2QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLHVDQUFvQixFQUFDLE1BQU0s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