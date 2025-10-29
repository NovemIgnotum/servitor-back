import express from "express";
import UserController from "../controllers/User";

const router = express.Router();

router.post("/create", UserController.createUser);
router.post("/login", UserController.loginUser);
router.get("/read/:userId", UserController.readOneUser);
router.put("/update/:userId", UserController.updateUser);
router.delete("/delete/:userId", UserController.deleteUser);

export default router;
