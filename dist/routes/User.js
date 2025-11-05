"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../controllers/User"));
const router = express_1.default.Router();
router.post("/create", User_1.default.createUser);
router.post("/login", User_1.default.loginUser);
router.get("/read/:userId", User_1.default.readOneUser);
router.get("/readAll", User_1.default.readAllUsers);
router.put("/update/:userId", User_1.default.updateUser);
router.delete("/delete/:userId", User_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yb3V0ZXMvVXNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHNEQUE4QjtBQUM5QiwrREFBaUQ7QUFFakQsTUFBTSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUVoQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ2hELE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUN4RCxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDcEQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDekQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFNUQsa0JBQWUsTUFBTSxDQUFDIn0=