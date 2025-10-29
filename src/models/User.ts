import { model, Schema } from "mongoose";
import { IUser } from "../interfaces/User";

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    server: [{ type: Schema.Types.ObjectId, ref: "Server" }],
  },
  {
    timestamps: true,
  }
);

export default model<IUser>("User", UserSchema);
