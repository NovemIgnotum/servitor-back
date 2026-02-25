export const validServerPayload = {
  name: "My Minecraft Server",
  game: "minecraft",
  owner: "user-123",
  version: "1.20.1",
  serverType: "vanilla",
  maxPlayers: 20,
  difficulty: "normal",
};

export const validMinecraftServerPayload = {
  name: "Minecraft Test Server",
  owner: "user-123",
  game: "minecraft",
  port: 25565,
};

export const validArkServerPayload = {
  name: "ARK Test Server",
  owner: "user-123",
  game: "ark",
  port: 7777,
  map: "TheIsland",
  maxPlayers: 10,
  serverPassword: "serverpass",
  adminPassword: "adminpass",
};

export const runningServer = {
  _id: "server-123",
  name: "Running Server",
  status: "running",
  containerId: "container-abc",
  owner: "user-456",
  rconPassword: "rcon-pass",
  game: "minecraft",
  version: "1.20.1",
  operators: [],
  save: jest.fn().mockResolvedValue(this),
};

export const stoppedServer = {
  _id: "server-789",
  name: "Stopped Server",
  status: "stopped",
  containerId: "container-stopped",
  owner: "user-456",
  game: "minecraft",
  version: "1.19.4",
  operators: [],
  save: jest.fn().mockResolvedValue(this),
};

export const serverList = [
  {
    _id: "server-1",
    name: "Server One",
    owner: "user-123",
    game: "minecraft",
    status: "running",
  },
  {
    _id: "server-2",
    name: "Server Two",
    owner: "user-456",
    game: "ark",
    status: "running",
  },
];
