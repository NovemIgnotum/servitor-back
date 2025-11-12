import { Request, Response } from "express";
import Retour from "../library/Retour";
import { MinecraftHandler } from "../handler/Minecraft";
import { getGameServerAddress } from "../utils/getServerAddress";

//Models
import ServerModel from "../models/Server";
import UserModel from "../models/User";

const mcHandler = new MinecraftHandler();

const createServer = async (req: Request, res: Response) => {
  try {
    const { name, owner, game, port } = req.body;

    const server = new ServerModel({
      name,
      owner,
      game,
      ipAddress: "",
      port,
      containerId: "",
      rconPassword: "",
    });

    const dockerInfo = await mcHandler.createContainer(server);
    server.containerId = Object(dockerInfo).containerId;
    server.rconPassword = Object(dockerInfo).rconPassword;

    // Try to resolve the host:port mapping and set ipAddress
    try {
      const hostPublicIP =
        process.env.HOST_PUBLIC_IP ||
        req.hostname ||
        req.socket.remoteAddress ||
        "127.0.0.1";
      const addr = await getGameServerAddress(server.containerId, hostPublicIP);
      // addr.address is like `${hostPublicIP}:${hostPort}` or empty string
      server.ipAddress = addr.address || hostPublicIP;
    } catch (addrErr) {
      // If anything goes wrong, leave ipAddress empty or fallback to hostPublicIP
      server.ipAddress =
        process.env.HOST_PUBLIC_IP ||
        req.hostname ||
        req.socket.remoteAddress ||
        "";
    }

    server.status = "running";

    await server.save();
    Retour.success("Server created successfully");
    return res.status(201).json({
      message: "Server created successfully",
      server,
    });
  } catch (error) {
    Retour.error("Error while creating server");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getAllServers = async (req: Request, res: Response) => {
  try {
    const servers = await ServerModel.find();
    Retour.success("Fetched all servers");
    return res.status(200).json({ servers });
  } catch (error) {
    Retour.error("Error while fetching servers");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getServerById = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const server = await ServerModel.findById(serverId);

    if (!server) {
      Retour.error("Server not found");
      return res.status(404).json({ message: "Server not found" });
    }

    Retour.success("Fetched server");
    return res.status(200).json({ server });
  } catch (error) {
    Retour.error("Error while fetching server");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getServersByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);
    if (!user) {
      Retour.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const servers = await ServerModel.find({ owner: userId });
    Retour.success("Fetched user's servers");
    return res.status(200).json({ servers });
  } catch (error) {
    Retour.error("Error while fetching user's servers");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getServersByGame = async (req: Request, res: Response) => {
  try {
    const { game } = req.params;

    const foundedServers = await ServerModel.find({ game: game });

    Retour.success("Fetched servers by game");
    return res.status(200).json({ servers: foundedServers });
  } catch (error) {
    Retour.error("Error while fetching servers by game");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const stopServer = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const server = await ServerModel.findById(serverId);

    if (!server) {
      Retour.error("Server not found");
      return res.status(404).json({ message: "Server not found" });
    }

    if (server.status === "stopped") {
      Retour.error("Server is already stopped");
      return res.status(400).json({ message: "Server is already stopped" });
    }

    await mcHandler.stopContainer(server.containerId);
    server.status = "stopped";
    await server.save();

    Retour.success("Stopping server");
    return res.status(200).json({ message: "Stopping server" });
  } catch (error) {
    Retour.error("Error while stopping server");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const startServer = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const server = await ServerModel.findById(serverId);

    if (!server) {
      Retour.error("Server not found");
      return res.status(404).json({ message: "Server not found" });
    }
    if (server.status === "running") {
      Retour.error("Server is already running");
      return res.status(400).json({ message: "Server is already running" });
    }

    await mcHandler.startContainer(server.containerId);
    server.status = "running";
    await server.save();

    Retour.success("Starting server");
    return res.status(200).json({ message: "Starting server" });
  } catch (error) {
    Retour.error("Error while starting server");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const addOrRemoveOps = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const { ops, requester } = req.body;

    if (!ops || !requester) {
      Retour.error("Missing parameters");
      return res.status(400).json({ message: "Missing parameters" });
    }

    const server = await ServerModel.findById(serverId);
    if (!server) {
      Retour.error("Server not found");
      return res.status(404).json({ message: "Server not found" });
    }

    const requesterUser = await UserModel.findById(requester);

    if (
      !requesterUser ||
      Object(requesterUser)._id.toString() !== server.owner.toString()
    ) {
      Retour.error("Unauthorized operation");
      return res.status(403).json({ message: "Unauthorized operation" });
    }

    for (const op of ops) {
      console.log(`Processing op: ${op}`);
      const foundedUser = await UserModel.findById(op);

      if (!foundedUser) {
        Retour.error(`User with id ${op} not found`);
        return res
          .status(404)
          .json({ message: `User with id ${op} not found` });
      }
      console.log(`Found user: ${foundedUser.email}`);
      if (Object(server).operators.includes(op)) {
        // Remove op
        Object(server).operators = Object(server).operators.filter(
          (existingOp: string) => existingOp.toString() !== op.toString()
        );
        console.log(`Removed op: ${foundedUser.email}`);
      } else {
        // Add op
        Object(server).operators.push(op);
        console.log(`Added op: ${foundedUser.email}`);
      }
    }

    await server.save();

    Retour.success("Updated server ops successfully");
    return res
      .status(200)
      .json({ message: "Updated server ops successfully", server: server });
  } catch (error) {
    Retour.error("Error while updating server ops");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const getServerStats = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const server = await ServerModel.findById(serverId);
    if (!server) {
      Retour.error("Server not found");
      return res.status(404).json({ message: "Server not found" });
    }

    if (!server.containerId) {
      Retour.error("Server has no container id");
      return res.status(400).json({ message: "Server has no container id" });
    }

    const stats = await mcHandler.getStats(server.containerId);
    console.log("Container stats:", stats);
    const players = await mcHandler.getPlayerInfo(
      server.containerId,
      server.rconPassword
    );
    console.log(players);

    const craftedResponse = {
      cpuPercent: stats.cpuPercent,
      memoryUsage: stats.memoryUsage,
      memoryLimit: stats.memoryLimit,
      memoryPercent: stats.memoryPercent,
      playerCount: players ? players.count : 0,
      players: players ? players.players : [],
    };
    Retour.success("Fetched server stats");
    return res
      .status(200)
      .json({ message: "Fetched server stats", stats: craftedResponse });
  } catch (error) {
    Retour.error("Error while fetching server stats");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const changeOwner = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const { newOwner, requester, passingOps } = req.body;

    if (!newOwner || !requester || passingOps === undefined) {
      Retour.error("Missing parameters");
      return res.status(400).json({ message: "Missing parameters" });
    }

    if (newOwner === requester) {
      Retour.error("New owner cannot be the same as requester");
      return res
        .status(400)
        .json({ message: "New owner cannot be the same as requester" });
    }

    const server = await ServerModel.findById(serverId);

    if (!server) {
      Retour.error("Server not found");
      return res.status(404).json({ message: "Server not found" });
    }

    if (server.owner.toString() !== requester) {
      Retour.error("Unauthorized operation");
      return res.status(403).json({ message: "Unauthorized operation" });
    }

    const FoundedNewOwner = await UserModel.findById(newOwner);

    if (!FoundedNewOwner) {
      Retour.error("New owner not found");
      return res.status(404).json({ message: "New owner not found" });
    }

    if (passingOps) {
      // Add previous owner to ops
      Object(server).operators.push(server.owner);
    }

    if (server.operators.includes(newOwner)) {
      // Remove new owner from ops if present
      Object(server).operators = Object(server).operators.filter(
        (op: string) => op.toString() !== newOwner.toString()
      );
    }

    server.owner = newOwner;
    await server.save();

    Retour.success("Server owner changed successfully");
    return res
      .status(200)
      .json({ message: "Server owner changed successfully", server });
  } catch (error) {
    Retour.error("Error while changing server owner");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const deleteServer = async (req: Request, res: Response) => {
  try {
    return res.status(501).json({ message: "Not implemented" });
  } catch (error) {
    Retour.error("Error while deleting server");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default {
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
