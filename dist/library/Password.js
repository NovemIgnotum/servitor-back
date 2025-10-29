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
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const argon2_1 = __importDefault(require("argon2"));
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield argon2_1.default.hash(password, {
            type: argon2_1.default.argon2id,
            memoryCost: 1 << 16,
            timeCost: 3,
            parallelism: 1,
        });
    });
}
function verifyPassword(hash, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield argon2_1.default.verify(hash, password);
        }
        catch (err) {
            return false;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFzc3dvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGlicmFyeS9QYXNzd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUVBLG9DQU9DO0FBRUQsd0NBU0M7QUFwQkQsb0RBQTRCO0FBRTVCLFNBQXNCLFlBQVksQ0FBQyxRQUFnQjs7UUFDakQsT0FBTyxNQUFNLGdCQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQyxJQUFJLEVBQUUsZ0JBQU0sQ0FBQyxRQUFRO1lBQ3JCLFVBQVUsRUFBRSxDQUFDLElBQUksRUFBRTtZQUNuQixRQUFRLEVBQUUsQ0FBQztZQUNYLFdBQVcsRUFBRSxDQUFDO1NBQ2YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUFBO0FBRUQsU0FBc0IsY0FBYyxDQUNsQyxJQUFZLEVBQ1osUUFBZ0I7O1FBRWhCLElBQUksQ0FBQztZQUNILE9BQU8sTUFBTSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0MsQ0FBQztRQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7WUFDYixPQUFPLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0NBQUEifQ==