import Docker from "dockerode";

// Allow overriding the socket path (useful for tests or alternate setups)
const socketPath = process.env.DOCKER_SOCKET || "/var/run/docker.sock";

let docker: any;
try {
  docker = new Docker({ socketPath });
} catch (err: any) {
  // Provide a clear, actionable message for permission errors
  console.error(
    `Failed to create Docker client for socket ${socketPath}:`,
    err
  );
  if (err && (err.code === "EACCES" || err.errno === -13)) {
    console.error(
      `Permission denied connecting to Docker socket at ${socketPath}.`
    );
    console.error(
      "Common fixes: add the process user to the 'docker' group (sudo usermod -aG docker $USER),"
    );
    console.error(
      "ensure /var/run/docker.sock is mounted into your container and has the correct group ownership,"
    );
    console.error("or run the process as root (not recommended).");
  }
  throw err;
}

export default docker;
