"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./config"));
const connectionCurrent = mongoose_1.default.createConnection(`${config_1.default.mongooseUrl}`, { retryWrites: true, w: 'majority' });
const connectionArchive = mongoose_1.default.createConnection(`${config_1.default.mongooseArchive}`, { retryWrites: true, w: 'majority' });
exports.default = { connectionCurrent, connectionArchive };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9uZ29vc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29uZmlnL21vbmdvb3NlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWdDO0FBQ2hDLHNEQUE4QjtBQUU5QixNQUFNLGlCQUFpQixHQUFHLGtCQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxnQkFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUNuSCxNQUFNLGlCQUFpQixHQUFHLGtCQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxnQkFBTSxDQUFDLGVBQWUsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUV2SCxrQkFBZSxFQUFFLGlCQUFpQixFQUFFLGlCQUFpQixFQUFFLENBQUMifQ==