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
exports.ArkHandler = void 0;
const dockerClient_1 = __importDefault(require("../services/dockerClient"));
class ArkHandler {
    generateRconPassword() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
    createContainer(server, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageName = process.env.ARK_IMAGE || "hermsi/ark-server:latest";
            const rconPassword = this.generateRconPassword();
            const rconPort = 27020;
            const container = {
                Image: imageName,
                name: `ark_server_${server._id}`,
                Tty: true,
                ExposedPorts: {
                    "7777/udp": {},
                    "27015/udp": {},
                    "27020/tcp": {},
                },
                HostConfig: {
                    PortBindings: {
                        "7777/udp": [
                            {
                                HostPort: server.port.toString(),
                            },
                        ],
                        "27015/udp": [
                            {
                                HostPort: (server.port + 1).toString(),
                            },
                        ],
                        "27020/tcp": [
                            {
                                HostPort: rconPort.toString(),
                            },
                        ],
                    },
                },
                Env: [
                    `SESSIONNAME=${info.serverName || "ARK Server"}`,
                    `MAXPLAYERS=${info.maxPlayers || 20}`,
                    `SERVERMAP=${info.serverMap || "TheIsland"}`,
                    `MODS=${info.mods ? info.mods.join(",") : ""}`,
                    `ENABLE_RCON=true`,
                    `UPDATEONSTART=true`,
                    `RCON_PASSWORD=${rconPassword}`,
                    `RCON_PORT=${rconPort}`,
                    `SERVER_PORT=${server.port}`,
                    `QUERY_PORT=${server.port + 1}`,
                ],
            };
            const pullImage = (image) => __awaiter(this, void 0, void 0, function* () {
                console.info(`Pulling Docker image ${image}...`);
                return new Promise((resolve, reject) => {
                    dockerClient_1.default.pull(image, (err, stream) => {
                        if (err)
                            return reject(err);
                        dockerClient_1.default.modem.followProgress(stream, (err2) => {
                            if (err2)
                                return reject(err2);
                            console.info(`Successfully pulled ${image}`);
                            resolve();
                        });
                    });
                });
            });
            let createdContainer;
            try {
                yield pullImage(imageName);
                createdContainer = yield dockerClient_1.default.createContainer(container);
                console.info(`Container created with ID: ${createdContainer.id} for server ${server._id}`);
            }
            catch (error) {
                console.error("Error creating container:", error);
                throw error;
            }
            yield createdContainer.start();
            console.info(`Container started with ID: ${createdContainer.id} for server ${server._id}`);
            return {
                containerId: createdContainer.id,
                rconPassword: rconPassword,
                rconPort: rconPort,
            };
        });
    }
    startContainer(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = dockerClient_1.default.getContainer(containerId);
            yield container.start();
        });
    }
    stopContainer(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = dockerClient_1.default.getContainer(containerId);
            yield container.stop();
        });
    }
    removeContainer(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = dockerClient_1.default.getContainer(containerId);
            yield container.remove({ force: true });
        });
    }
}
exports.ArkHandler = ArkHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXIvYXJrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRFQUE4QztBQVM5QyxNQUFhLFVBQVU7SUFDYixvQkFBb0I7UUFDMUIsTUFBTSxLQUFLLEdBQ1Qsd0VBQXdFLENBQUM7UUFDM0UsSUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUM1QixRQUFRLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBQ0QsT0FBTyxRQUFRLENBQUM7SUFDbEIsQ0FBQztJQUVLLGVBQWUsQ0FBQyxNQUFlLEVBQUUsSUFBYTs7WUFDbEQsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksMEJBQTBCLENBQUM7WUFDdEUsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7WUFDakQsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBRXZCLE1BQU0sU0FBUyxHQUFRO2dCQUNyQixLQUFLLEVBQUUsU0FBUztnQkFDaEIsSUFBSSxFQUFFLGNBQWMsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDaEMsR0FBRyxFQUFFLElBQUk7Z0JBQ1QsWUFBWSxFQUFFO29CQUNaLFVBQVUsRUFBRSxFQUFFO29CQUNkLFdBQVcsRUFBRSxFQUFFO29CQUNmLFdBQVcsRUFBRSxFQUFFO2lCQUNoQjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsWUFBWSxFQUFFO3dCQUNaLFVBQVUsRUFBRTs0QkFDVjtnQ0FDRSxRQUFRLEVBQUUsTUFBTSxDQUFD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