import { Request, Response } from "express";
import Retour from "../library/Retour";
import { hashPassword, verifyPassword } from "../library/Password";

//Modelss
import UserModel from "../models/User";

const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      Retour.error("Email and password are required");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      Retour.error("User already exists");
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new UserModel({ email, password: hashedPassword });
    await newUser.save();

    Retour.success("User created successfully");
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    Retour.error("Error while creating user");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      Retour.error("Email and password are required");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      Retour.error("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await verifyPassword(user.password, password);
    if (!isPasswordValid) {
      Retour.error("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    Retour.success("User logged in successfully");
    return res
      .status(200)
      .json({ message: "User logged in successfully", userId: user._id });
  } catch (error) {
    Retour.error("Error while logging in user");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const readOneUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      Retour.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    Retour.success("User fetched successfully");
    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    Retour.error("Error while fetching user");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { email, password, oldPassword } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
      Retour.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    if (email) {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser && Object(existingUser)._id.toString() !== userId) {
        Retour.error("Email already in use");
        return res.status(409).json({ message: "Email already in use" });
      } else {
        await UserModel.findByIdAndUpdate(userId, { email });
      }
    }

    if (password) {
      if (!oldPassword) {
        Retour.error("Old password is required to set a new password");
        return res
          .status(400)
          .json({ message: "Old password is required to set a new password" });
      }

      const isOldPasswordValid = await verifyPassword(
        user.password,
        oldPassword
      );
      if (!isOldPasswordValid) {
        Retour.error("Old password is incorrect");
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      const hashedNewPassword = await hashPassword(password);
      await UserModel.findByIdAndUpdate(userId, {
        password: hashedNewPassword,
      });
    }

    const updatedUser = await UserModel.findById(userId);

    Retour.success("User updated successfully");
    return res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    Retour.error("Error while updating user");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId);

    if (!user) {
      Retour.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.findByIdAndDelete(userId);

    Retour.success("User deleted successfully");
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    Retour.error("Error while deleting user");
    return res.status(500).json({ message: "Internal server error" });
  }
};
export default { createUser, loginUser, readOneUser, updateUser, deleteUser };
