"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dockerode_1 = __importDefault(require("dockerode"));
const socketPath = process.env.DOCKER_SOCKET || "/var/run/docker.sock";
let docker;
try {
    docker = new dockerode_1.default({ socketPath });
}
catch (err) {
    console.error(`Failed to create Docker client for socket ${socketPath}:`, err);
    if (err && (err.code === "EACCES" || err.errno === -13)) {
        console.error(`Permission denied connecting to Docker socket at ${socketPath}.`);
        console.error("Common fixes: add the process user to the 'docker' group (sudo usermod -aG docker $USER),");
        console.error("ensure /var/run/docker.sock is mounted into your container and has the correct group ownership,");
        console.error("or run the process as root (not recommended).");
    }
    throw err;
}
exports.default = docker;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2VyQ2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3NlcnZpY2VzL2RvY2tlckNsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBEQUErQjtBQUcvQixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsSUFBSSxzQkFBc0IsQ0FBQztBQUV2RSxJQUFJLE1BQVcsQ0FBQztBQUNoQixJQUFJLENBQUM7SUFDSCxNQUFNLEdBQUcsSUFBSSxtQkFBTSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztJQUVsQixPQUFPLENBQUMsS0FBSyxDQUNYLDZDQUE2QyxVQUFVLEdBQUcsRUFDMUQsR0FBRyxDQUNKLENBQUM7SUFDRixJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxLQUFLLENBQ1gsb0RBQW9ELFVBQVUsR0FBRyxDQUNsRSxDQUFDO1FBQ0YsT0FBTyxDQUFDLEtBQUssQ0FDWCwyRkFBMkYsQ0FDNUYsQ0FBQztRQUNGLE9BQU8sQ0FBQyxLQUFLLENBQ1gsaUdBQWlHLENBQ2xHLENBQUM7UUFDRixPQUFPLENBQUMsS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUNELE1BQU0sR0FBRyxDQUFDO0FBQ1osQ0FBQztBQUVELGtCQUFlLE1BQU0sQ0FBQyJ9