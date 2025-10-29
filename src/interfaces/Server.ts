import { Document, Types } from "mongoose";

export interface IServer extends Document {
  name: string;
  game: string;
  ipAddress: string;
  port: number;
  owner: Types.ObjectId;
  operators: Types.ObjectId[];
  containerId: string;
  status: "stopped" | "running" | "starting" | "error";
  ramLimit?: number;
  cpuLimit?: number;
  version?: string;
  type?: string;
  mods?: string[];
  configPath?: string;
}
