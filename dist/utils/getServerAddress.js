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
exports.getGameServerAddress = getGameServerAddress;
const dockerode_1 = __importDefault(require("dockerode"));
const docker = new dockerode_1.default();
function getGameServerAddress(containerId, hostPublicIP) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const container = docker.getContainer(containerId);
            const inspectData = yield container.inspect();
            const portsInfo = inspectData.NetworkSettings.Ports;
            const exposedPorts = {};
            for (const [containerPort, mappings] of Object.entries(portsInfo)) {
                if (Array.isArray(mappings) && ((_a = mappings[0]) === null || _a === void 0 ? void 0 : _a.HostPort)) {
                    exposedPorts[containerPort] = mappings[0].HostPort;
                }
            }
            const firstPort = Object.values(exposedPorts)[0];
            const address = firstPort ? `${hostPublicIP}:${firstPort}` : "";
            return { address, ports: exposedPorts };
        }
        catch (error) {
            console.error("Erreur lors de la récupération des infos réseau :", error);
            throw error;
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0U2VydmVyQWRkcmVzcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9nZXRTZXJ2ZXJBZGRyZXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBSUEsb0RBMEJDO0FBOUJELDBEQUErQjtBQUUvQixNQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFNLEVBQUUsQ0FBQztBQUU1QixTQUFzQixvQkFBb0IsQ0FDeEMsV0FBbUIsRUFDbkIsWUFBb0I7OztRQUVwQixJQUFJLENBQUM7WUFDSCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ25ELE1BQU0sV0FBVyxHQUFHLE1BQU0sU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRTlDLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDO1lBQ3BELE1BQU0sWUFBWSxHQUEyQixFQUFFLENBQUM7WUFFaEQsS0FBSyxNQUFNLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQztnQkFDbEUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFJLE1BQUEsUUFBUSxDQUFDLENBQUMsQ0FBQywwQ0FBRSxRQUFRLENBQUEsRUFBRSxDQUFDO29CQUNyRCxZQUFZLENBQUMsYUFBYSxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztnQkFDckQsQ0FBQztZQUNILENBQUM7WUFHRCxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxZQUFZLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUVoRSxPQUFPLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQztRQUMxQyxDQUFDO1FBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztZQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsbURBQW1ELEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUUsTUFBTSxLQUFLLENBQUM7UUFDZCxDQUFDO0lBQ0gsQ0FBQztDQUFBIn0=