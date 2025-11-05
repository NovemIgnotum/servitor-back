import Docker from "dockerode";

const docker = new Docker();

export async function getGameServerAddress(
  containerId: string,
  hostPublicIP: string
): Promise<{ address: string; ports: Record<string, string> }> {
  try {
    const container = docker.getContainer(containerId);
    const inspectData = await container.inspect();

    const portsInfo = inspectData.NetworkSettings.Ports;
    const exposedPorts: Record<string, string> = {};

    for (const [containerPort, mappings] of Object.entries(portsInfo)) {
      if (Array.isArray(mappings) && mappings[0]?.HostPort) {
        exposedPorts[containerPort] = mappings[0].HostPort;
      }
    }

    // Si tu veux construire une adresse principale (ex. premier port TCP ou UDP)
    const firstPort = Object.values(exposedPorts)[0];
    const address = firstPort ? `${hostPublicIP}:${firstPort}` : "";

    return { address, ports: exposedPorts };
  } catch (error) {
    console.error("Erreur lors de la récupération des infos réseau :", error);
    throw error;
  }
}
