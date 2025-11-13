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
exports.MinecraftHandler = void 0;
const dockerClient_1 = __importDefault(require("../services/dockerClient"));
class MinecraftHandler {
    createContainer(server) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const imageName = process.env.MINECRAFT_IMAGE || "itzg/minecraft-server:latest";
            const rconPassword = this.generateRconPassword();
            const rconPort = "25575";
            const createOpts = {
                Image: imageName,
                name: `mc-server-${server._id}`,
                Env: [
                    `EULA=TRUE`,
                    `VERSION=${server.version || "1.20.1"}`,
                    `TYPE=${server.type || "VANILLA"}`,
                    `ENABLE_RCON=true`,
                    `RCON_PASSWORD=${rconPassword}`,
                    `RCON_PORT=${rconPort}`,
                ],
                ExposedPorts: {
                    "25565/tcp": {},
                    "25575/tcp": {},
                },
                HostConfig: {
                    PortBindings: {
                        "25565/tcp": [
                            {
                                HostPort: server.port.toString(),
                            },
                        ],
                        "25575/tcp": [
                            {
                                HostPort: "0",
                            },
                        ],
                    },
                    Memory: server.ramLimit ? server.ramLimit * 1024 * 1024 : undefined,
                },
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
            let container;
            try {
                container = yield dockerClient_1.default.createContainer(createOpts);
            }
            catch (err) {
                const msg = ((_a = err === null || err === void 0 ? void 0 : err.json) === null || _a === void 0 ? void 0 : _a.message) || (err === null || err === void 0 ? void 0 : err.message) || "";
                if (msg.includes("No such image") || msg.includes("pull access denied")) {
                    try {
                        yield pullImage(imageName);
                        container = yield dockerClient_1.default.createContainer(createOpts);
                    }
                    catch (pullErr) {
                        console.error("Failed to pull or create container for image", imageName, pullErr);
                        throw pullErr;
                    }
                }
                else {
                    throw err;
                }
            }
            yield container.start();
            console.info(`RCON enabled for container ${container.id} with password: ${rconPassword}`);
            return { containerId: container.id, rconPassword };
        });
    }
    generateRconPassword() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let password = "";
        for (let i = 0; i < 16; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
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
    getPlayerInfo(containerId, rconPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = dockerClient_1.default.getContainer(containerId);
            const containerInfo = yield container.inspect();
            const env = containerInfo.Config.Env || [];
            let rconPort = "25575";
            for (const envVar of env) {
                if (envVar.startsWith("RCON_PASSWORD=")) {
                    rconPassword = envVar.split("=")[1];
                }
                if (envVar.startsWith("RCON_PORT=")) {
                    rconPort = envVar.split("=")[1];
                }
            }
            if (!rconPassword) {
                console.log("RCON not configured for container:", containerId);
                return null;
            }
            const cmd = [
                "bash",
                "-c",
                `if command -v rcon-cli >/dev/null 2>&1; then
      rcon-cli --host 127.0.0.1 --port ${rconPort} --password "${rconPassword}" list 2>/dev/null || echo "";
    elif command -v mcrcon >/dev/null 2>&1; then
      mcrcon -H 127.0.0.1 -P ${rconPort} -p "${rconPassword}" list 2>/dev/null || echo "";
    else
      echo "";
    fi`,
            ];
            const exec = yield container.exec({
                Cmd: cmd,
                AttachStdout: true,
                AttachStderr: true,
            });
            return new Promise((resolve, reject) => {
                exec.start((err, stream) => {
                    if (err) {
                        console.error("Error starting exec:", err);
                        return resolve(null);
                    }
                    let output = "";
                    stream.on("data", (chunk) => {
                        output += chunk.toString();
                    });
                    stream.on("end", () => {
                        console.log("RCON output:", output);
                        const countPatterns = [
                            /There (?:are|is)\s+(\d+)\s*\/\s*\d+/i,
                            /There (?:are|is)\s+(\d+)\s+of a max/i,
                            /There (?:are|is)\s+(\d+)\s+players?/i,
                        ];
                        let playerCount = 0;
                        for (const pattern of countPatterns) {
                            const match = output.match(pattern);
                            if (match && match[1]) {
                                playerCount = parseInt(match[1], 10);
                                break;
                            }
                        }
                        const players = [];
                        const playersMatch = output.match(/online\s*:\s*(.+?)(?:\n|$)/i);
                        if (playersMatch && playersMatch[1]) {
                            const playersList = playersMatch[1].trim();
                            if (playersList && playersList !== "") {
                                players.push(...playersList
                                    .split(",")
                                    .map((p) => p.trim())
                                    .filter((p) => p.length > 0));
                            }
                        }
                        if (playerCount >= 0 || players.length > 0) {
                            return resolve({
                                count: playerCount,
                                players: players,
                            });
                        }
                        resolve(null);
                    });
                    stream.on("error", (streamErr) => {
                        console.error("Stream error:", streamErr);
                        resolve(null);
                    });
                });
            });
        });
    }
    getStats(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = dockerClient_1.default.getContainer(containerId);
            const stats = yield container.stats({ stream: false });
            const cpuStats = Object(stats).cpu_stats || {};
            const precpuStats = Object(stats).precpu_stats || {};
            const cpuDelta = ((cpuStats.cpu_usage && cpuStats.cpu_usage.total_usage) || 0) -
                ((precpuStats.cpu_usage && precpuStats.cpu_usage.total_usage) || 0);
            const systemDelta = (cpuStats.system_cpu_usage || 0) - (precpuStats.system_cpu_usage || 0);
            const onlineCpus = cpuStats.online_cpus ||
                (cpuStats.cpu_usage &&
                    cpuStats.cpu_usage.percpu_usage &&
                    cpuStats.cpu_usage.percpu_usage.length) ||
                1;
            let cpuPercent = 0;
            if (systemDelta > 0 && cpuDelta > 0) {
                cpuPercent = (cpuDelta / systemDelta) * onlineCpus * 100;
            }
            const memoryStats = Object(stats).memory_stats || {};
            const memoryUsage = memoryStats.usage || 0;
            const memoryLimit = memoryStats.limit || 0;
            const memoryPercent = memoryLimit > 0 ? (memoryUsage / memoryLimit) * 100 : 0;
            return {
                cpuPercent,
                memoryUsage,
                memoryLimit,
                memoryPercent,
                raw: stats,
            };
        });
    }
}
exports.MinecraftHandler = MinecraftHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluZWNyYWZ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXIvTWluZWNyYWZ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRFQUE4QztBQVc5QyxNQUFhLGdCQUFnQjtJQUNyQixlQUFlLENBQUMsTUFBZTs7O1lBQ25DLE1BQU0sU0FBUyxHQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxJQUFJLDhCQUE4QixDQUFDO1lBR2hFLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1lBQ2pELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQztZQUV6QixNQUFNLFVBQVUsR0FBUTtnQkFDdEIsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLElBQUksRUFBRSxhQUFhLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQy9CLEdBQUcsRUFBRTtvQkFDSCxXQUFXO29CQUNYLFdBQVcsTUFBTSxDQUFDLE9BQU8sSUFBSSxRQUFRLEVBQUU7b0JBQ3ZDLFFBQVEsTUFBTSxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7b0JBRWxDLGtCQUFrQjtvQkFDbEIsaUJBQWlCLFlBQVksRUFBRTtvQkFDL0IsYUFBYSxRQUFRLEVBQUU7aUJBQ3hCO2dCQUVELFlBQVksRUFBRTtvQkFDWixXQUFXLEVBQUUsRUFBRTtvQkFDZixXQUFXLEVBQUUsRUFBRTtpQkFDaEI7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLFlBQVksRUFBRTt3QkFDWixXQUFXLEVBQUU7NEJBQ1g7Z0NBQ0UsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFOzZCQUNqQzt5QkFDRjt3QkFHRCxXQUFXLEVBQUU7NEJBQ1g7Z0NBQ0UsUUFBUSxFQUFFLEdBQUc7NkJBQ2Q7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsTUFBTSxFQUFFLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFB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