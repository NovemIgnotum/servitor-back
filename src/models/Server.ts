import { model, Schema } from "mongoose";
import { IServer } from "../interfaces/Server";

const ServerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    game: { type: String, required: true },
    ipAddress: { type: String, required: true },
    port: { type: Number, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    operators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    containerId: { type: String, required: true },
    status: {
      type: String,
      enum: ["stopped", "running", "starting", "error"],
      default: "stopped",
    },
    ramLimit: { type: Number }, // in MB
    cpuLimit: { type: Number }, // in percentage
    version: { type: String },
    type: { type: String }, // Type of server (e.g., "forge", "vanilla", "modded")
    mods: [{ type: String }], // List of installed mods (if applicable)
    configPath: { type: String }, // Path to the configuration folder on disk
    rconPassword: { type: String }, // RCON password for remote console access
  },
  {
    timestamps: true,
  }
);

export default model<IServer>("Server", ServerSchema);
