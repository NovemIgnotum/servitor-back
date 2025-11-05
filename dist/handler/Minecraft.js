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
            const createOpts = {
                Image: imageName,
                name: `mc-server-${server._id}`,
                Env: [
                    `EULA=TRUE`,
                    `VERSION=${server.version || "1.20.1"}`,
                    `TYPE=${server.type || "VANILLA"}`,
                ],
                HostConfig: {
                    PortBindings: {
                        "25565/tcp": [
                            {
                                HostPort: server.port.toString(),
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
            return container.id;
        });
    }
    getInfo(containerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const container = dockerClient_1.default.getContainer(containerId);
            const data = yield container.inspect();
            return data;
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
exports.MinecraftHandler = MinecraftHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluZWNyYWZ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2hhbmRsZXIvTWluZWNyYWZ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRFQUE4QztBQUc5QyxNQUFhLGdCQUFnQjtJQUNyQixlQUFlLENBQUMsTUFBZTs7O1lBQ25DLE1BQU0sU0FBUyxHQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxJQUFJLDhCQUE4QixDQUFDO1lBRWhFLE1BQU0sVUFBVSxHQUFRO2dCQUN0QixLQUFLLEVBQUUsU0FBUztnQkFDaEIsSUFBSSxFQUFFLGFBQWEsTUFBTSxDQUFDLEdBQUcsRUFBRTtnQkFDL0IsR0FBRyxFQUFFO29CQUNILFdBQVc7b0JBQ1gsV0FBVyxNQUFNLENBQUMsT0FBTyxJQUFJLFFBQVEsRUFBRTtvQkFDdkMsUUFBUSxNQUFNLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTtpQkFDbkM7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLFlBQVksRUFBRTt3QkFDWixXQUFXLEVBQUU7NEJBQ1g7Z0NBQ0UsUUFBUSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFOzZCQUNqQzt5QkFDRjtxQkFDRjtvQkFDRCxNQUFNLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTO2lCQUNwRTthQUNGLENBQUM7WUFFRixNQUFNLFNBQVMsR0FBRyxDQUFPLEtBQWEsRUFBRSxFQUFFO2dCQUN4QyxPQUFPLENBQUMsSUFBSSxDQUFDLHdCQUF3QixLQUFLLEtBQUssQ0FBQyxDQUFDO2dCQUNqRCxPQUFPLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO29CQUMzQyxzQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFRLEVBQUUsTUFBVyxF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