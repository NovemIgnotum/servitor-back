import { Request, Response } from "express";
import Retour from "../library/Retour";

//Models
import ServerModel from "../models/Server";
import UserModel from "../models/User";
import { MinecraftHandler } from "../handler/Minecraft";

const mcHandler = new MinecraftHandler();

const createServer = async (req: Request, res: Response) => {
  try {
    const { name, owner, game, port } = req.body;

    const server = new ServerModel({
      name,
      owner,
      game,
      ipAddress: "<server-ip-address>", // This should be set properly in a real scenario
      port,
      containerId: "<docker-container-id>", // This should be set after creating the Docker container
    });

    const containerId = await mcHandler.createContainer(server);
    server.containerId = containerId;
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

const stopServer = async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const server = await ServerModel.findById(serverId);

    if (!server) {
      Retour.error("Server not found");
      return res.status(404).json({ message: "Server not found" });
    }

    Retour.success("Stopping server");
    return res.status(200).json({ message: "Stopping server" });
  } catch (error) {
    Retour.error("Error while stopping server");
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export default {
  createServer,
  getAllServers,
  getServerById,
  getServersByUser,
  stopServer,
};
