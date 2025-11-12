import docker from "../services/dockerClient";
import { IServer } from "../interfaces/Server";

interface PlayerInfo {
  count: number;
  players: string[];
}
export class MinecraftHandler {
  async createContainer(server: IServer): Promise<object> {
    const imageName =
      process.env.MINECRAFT_IMAGE || "itzg/minecraft-server:latest";

    // Générer un mot de passe RCON aléatoire sécurisé
    const rconPassword = this.generateRconPassword();
    const rconPort = "25575"; // Port RCON par défaut

    const createOpts: any = {
      Image: imageName,
      name: `mc-server-${server._id}`,
      Env: [
        `EULA=TRUE`,
        `VERSION=${server.version || "1.20.1"}`,
        `TYPE=${server.type || "VANILLA"}`,
        // Activation de RCON
        `ENABLE_RCON=true`,
        `RCON_PASSWORD=${rconPassword}`,
        `RCON_PORT=${rconPort}`,
      ],
      // Exposer le port RCON (optionnel, uniquement si besoin d'accès externe)
      ExposedPorts: {
        "25565/tcp": {},
        "25575/tcp": {}, // Port RCON
      },
      HostConfig: {
        PortBindings: {
          "25565/tcp": [
            {
              HostPort: server.port.toString(),
            },
          ],
          // Bind RCON port (optionnel, pour accès externe)
          // Si vous voulez uniquement l'accès interne, retirez cette partie
          "25575/tcp": [
            {
              HostPort: "0", // Docker attribue un port aléatoire
            },
          ],
        },
        Memory: server.ramLimit ? server.ramLimit * 1024 * 1024 : undefined,
      },
    };

    const pullImage = async (image: string) => {
      console.info(`Pulling Docker image ${image}...`);
      return new Promise<void>((resolve, reject) => {
        docker.pull(image, (err: any, stream: any) => {
          if (err) return reject(err);
          docker.modem.followProgress(stream, (err2: any) => {
            if (err2) return reject(err2);
            console.info(`Successfully pulled ${image}`);
            resolve();
          });
        });
      });
    };

    let container: any;
    try {
      container = await docker.createContainer(createOpts);
    } catch (err: any) {
      const msg = err?.json?.message || err?.message || "";
      if (msg.includes("No such image") || msg.includes("pull access denied")) {
        try {
          await pullImage(imageName);
          container = await docker.createContainer(createOpts);
        } catch (pullErr) {
          console.error(
            "Failed to pull or create container for image",
            imageName,
            pullErr
          );
          throw pullErr;
        }
      } else {
        throw err;
      }
    }

    await container.start();

    // Sauvegarder le mot de passe RCON dans la base de données ou logs
    console.info(
      `RCON enabled for container ${container.id} with password: ${rconPassword}`
    );
    // TODO: Sauvegarder rconPassword dans votre modèle IServer si nécessaire

    return { containerId: container.id, rconPassword };
  }
  // Méthode pour générer un mot de passe RCON sécurisé
  private generateRconPassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async startContainer(containerId: string): Promise<void> {
    const container = docker.getContainer(containerId);
    await container.start();
  }

  async stopContainer(containerId: string): Promise<void> {
    const container = docker.getContainer(containerId);
    await container.stop();
  }

  async removeContainer(containerId: string): Promise<void> {
    const container = docker.getContainer(containerId);
    await container.remove({ force: true });
  }

  async getPlayerInfo(
    containerId: string,
    rconPassword: string
  ): Promise<PlayerInfo | null> {
    const container = docker.getContainer(containerId);
    // Récupérer les variables d'environnement du container
    const containerInfo = await container.inspect();
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

    // Commande corrigée avec la bonne syntaxe pour rcon-cli et mcrcon
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

    const exec = await container.exec({
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
    });

    return new Promise<PlayerInfo | null>((resolve, reject) => {
      exec.start((err: any, stream: any) => {
        if (err) {
          console.error("Error starting exec:", err);
          return resolve(null);
        }

        let output = "";

        stream.on("data", (chunk: any) => {
          output += chunk.toString();
        });

        stream.on("end", () => {
          console.log("RCON output:", output);

          // Patterns pour extraire le nombre de joueurs
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

          // Extraire les pseudos des joueurs
          // Format typique : "There are 2/20 players online: Player1, Player2"
          // ou "There are 2 of a max 20 players online: Player1, Player2"
          const players: string[] = [];

          // Chercher après "online:" ou "online :"
          const playersMatch = output.match(/online\s*:\s*(.+?)(?:\n|$)/i);
          if (playersMatch && playersMatch[1]) {
            const playersList = playersMatch[1].trim();
            if (playersList && playersList !== "") {
              // Séparer par virgule et nettoyer les espaces
              players.push(
                ...playersList
                  .split(",")
                  .map((p) => p.trim())
                  .filter((p) => p.length > 0)
              );
            }
          }

          // Si on a trouvé des informations, retourner l'objet
          if (playerCount >= 0 || players.length > 0) {
            return resolve({
              count: playerCount,
              players: players,
            });
          }

          resolve(null);
        });

        stream.on("error", (streamErr: any) => {
          console.error("Stream error:", streamErr);
          resolve(null);
        });
      });
    });
  }

  async getStats(containerId: string): Promise<any> {
    const container = docker.getContainer(containerId);
    // Request a single snapshot (stream: false)
    const stats: object = await container.stats({ stream: false });

    // Compute CPU usage percentage
    const cpuStats = Object(stats).cpu_stats || {};
    const precpuStats = Object(stats).precpu_stats || {};
    const cpuDelta =
      ((cpuStats.cpu_usage && cpuStats.cpu_usage.total_usage) || 0) -
      ((precpuStats.cpu_usage && precpuStats.cpu_usage.total_usage) || 0);
    const systemDelta =
      (cpuStats.system_cpu_usage || 0) - (precpuStats.system_cpu_usage || 0);
    const onlineCpus =
      cpuStats.online_cpus ||
      (cpuStats.cpu_usage &&
        cpuStats.cpu_usage.percpu_usage &&
        cpuStats.cpu_usage.percpu_usage.length) ||
      1;

    let cpuPercent = 0;
    if (systemDelta > 0 && cpuDelta > 0) {
      cpuPercent = (cpuDelta / systemDelta) * onlineCpus * 100;
    }

    // Memory usage
    const memoryStats = Object(stats).memory_stats || {};
    const memoryUsage = memoryStats.usage || 0;
    const memoryLimit = memoryStats.limit || 0;
    const memoryPercent =
      memoryLimit > 0 ? (memoryUsage / memoryLimit) * 100 : 0;

    return {
      cpuPercent,
      memoryUsage,
      memoryLimit,
      memoryPercent,
      raw: stats,
    };
  }
}
