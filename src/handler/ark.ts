import docker from "../services/dockerClient";
import { IServer } from "../interfaces/Server";

interface ARKInfo {
  serverName: string;
  serverMap: string;
  maxPlayers: number;
  mods?: string[];
}
export class ArkHandler {
  private generateRconPassword(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  async createContainer(server: IServer, info: ARKInfo): Promise<object> {
    const imageName = process.env.ARK_IMAGE || "hermsi/ark-server:latest";
    const rconPassword = this.generateRconPassword();
    const rconPort = 27020;

    const container: any = {
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

    let createdContainer: any;
    try {
      await pullImage(imageName);
      createdContainer = await docker.createContainer(container);
      console.info(
        `Container created with ID: ${createdContainer.id} for server ${server._id}`
      );
    } catch (error) {
      console.error("Error creating container:", error);
      throw error;
    }

    await createdContainer.start();
    console.info(
      `Container started with ID: ${createdContainer.id} for server ${server._id}`
    );

    return {
      containerId: createdContainer.id,
      rconPassword: rconPassword,
      rconPort: rconPort,
    };
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
}
