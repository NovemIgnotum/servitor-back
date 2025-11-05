import docker from "../services/dockerClient";
import { IServer } from "../interfaces/Server";

export class MinecraftHandler {
  async createContainer(server: IServer): Promise<string> {
    const imageName =
      process.env.MINECRAFT_IMAGE || "itzg/minecraft-server:latest";

    const createOpts: any = {
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
    return container.id;
  }

  async getInfo(containerId: string): Promise<any> {
    const container = docker.getContainer(containerId);
    const data = await container.inspect();
    return data;
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
