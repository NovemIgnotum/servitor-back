import {
  MockServerModel,
  mockFindById,
  mockFind,
  mockFindByIdAndDelete,
  mockSave,
  resetServerModelMocks,
} from "../../mocks/MockServerModel";

import {
  MockUserModel,
  mockUserFindById,
  resetUserModelMocks,
} from "../../mocks/MockUserModel";

import {
  MockMinecraftHandler,
  mockGetStats,
  mockGetPlayerInfo,
  mockStartContainer,
  mockStopContainer,
  mockCreateContainer,
  mockRemoveContainer,
  resetMinecraftHandlerMocks,
  mockSuccessfulStats,
  mockSuccessfulPlayerInfo,
} from "../../mocks/MockMinecraftHandler";

import {
  MockArkHandler,
  mockArkCreateContainer,
  resetArkHandlerMocks,
  mockSuccessfulArkContainerCreation,
} from "../../mocks/MockArkHandler";

import {
  mockGetGameServerAddress,
  resetGetServerAddressMock,
  mockSuccessfulAddress,
} from "../../mocks/MockGetServerAddress";

import {
  MockRetour,
  mockSuccess,
  mockError,
  resetRetourMocks,
} from "../../mocks/MockRetour";

import {
  validMinecraftServerPayload,
  validArkServerPayload,
  runningServer,
  stoppedServer,
  serverList,
} from "../../fixtures/ServerFixtures";

// Mocks globaux
jest.mock("../../../models/Server", () => ({
  __esModule: true,
  default: MockServerModel,
}));

jest.mock("../../../models/User", () => ({
  __esModule: true,
  default: MockUserModel,
}));

jest.mock("../../../handler/Minecraft", () => ({
  MinecraftHandler: MockMinecraftHandler,
}));

jest.mock("../../../handler/ark", () => ({
  ArkHandler: MockArkHandler,
}));

jest.mock("../../../utils/getServerAddress", () => ({
  getGameServerAddress: mockGetGameServerAddress,
}));

jest.mock("../../../library/Retour", () => ({
  __esModule: true,
  default: MockRetour,
}));

// Import après les mocks
import ServerController from "../../../controllers/Server";

function createMockRequest(body?: any, params?: any, extras?: any): any {
  const req: any = {
    hostname: "192.168.1.100",
    socket: { remoteAddress: "192.168.1.100" },
  };
  req.body = body || {};
  req.params = params || {};
  if (extras) {
    Object.assign(req, extras);
  }
  return req;
}

function createMockResponse(): any {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("ServerController", () => {
  beforeEach(() => {
    resetServerModelMocks();
    resetUserModelMocks();
    resetMinecraftHandlerMocks();
    resetArkHandlerMocks();
    resetGetServerAddressMock();
    resetRetourMocks();
  });

  describe("createServer", () => {
    it("devrait créer un serveur Minecraft avec succès", async () => {
      // Arrange
      const createdServer = {
        ...validMinecraftServerPayload,
        _id: "new-server-123",
        containerId: "",
        rconPassword: "",
        ipAddress: "",
        status: "creating",
        operators: [],
        save: mockSave,
      };

      MockServerModel.mockReturnValue(createdServer);
      mockCreateContainer.mockResolvedValue({
        containerId: "container-mc-123",
        rconPassword: "rcon-pass-123",
      });
      mockSuccessfulAddress("192.168.1.100:25565");
      mockSave.mockResolvedValue(createdServer);

      const req = createMockRequest(validMinecraftServerPayload);
      const res = createMockResponse();

      // Act
      await ServerController.createServer(req, res);

      // Assert
      expect(MockServerModel).toHaveBeenCalledWith({
        name: validMinecraftServerPayload.name,
        owner: validMinecraftServerPayload.owner,
        game: validMinecraftServerPayload.game,
        ipAddress: "",
        port: validMinecraftServerPayload.port,
        containerId: "",
        rconPassword: "",
      });

      expect(mockCreateContainer).toHaveBeenCalled();
      expect(mockSave).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server created successfully",
        server: expect.objectContaining({
          containerId: "container-mc-123",
          rconPassword: "rcon-pass-123",
          status: "running",
        }),
      });
      expect(mockSuccess).toHaveBeenCalledWith("Server created successfully");
    });

    it("devrait créer un serveur ARK avec succès", async () => {
      // Arrange
      const createdServer = {
        ...validArkServerPayload,
        _id: "new-ark-server",
        containerId: "",
        rconPassword: "",
        ipAddress: "",
        status: "creating",
        operators: [],
        save: mockSave,
      };

      MockServerModel.mockReturnValue(createdServer);
      mockSuccessfulArkContainerCreation("container-ark-123");
      mockSuccessfulAddress("192.168.1.100:7777");
      mockSave.mockResolvedValue(createdServer);

      const req = createMockRequest(validArkServerPayload);
      const res = createMockResponse();

      // Act
      await ServerController.createServer(req, res);

      // Assert
      expect(mockArkCreateContainer).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          serverName: validArkServerPayload.name,
          serverMap: validArkServerPayload.map,
          maxPlayers: validArkServerPayload.maxPlayers,
        })
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockSuccess).toHaveBeenCalled();
    });

    it("devrait rejeter ARK si map ou maxPlayers manquant", async () => {
      // Arrange
      const invalidPayload = {
        ...validArkServerPayload,
        map: undefined,
      };

      MockServerModel.mockReturnValue({
        ...invalidPayload,
        save: mockSave,
      });

      const req = createMockRequest(invalidPayload);
      const res = createMockResponse();

      // Act
      await ServerController.createServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing parameters for ARK server",
      });
      expect(mockArkCreateContainer).not.toHaveBeenCalled();
    });

    it("devrait rejeter un type de jeu non supporté", async () => {
      // Arrange
      const invalidGamePayload = {
        ...validMinecraftServerPayload,
        game: "unsupported-game",
      };

      MockServerModel.mockReturnValue({
        ...invalidGamePayload,
        save: mockSave,
      });

      const req = createMockRequest(invalidGamePayload);
      const res = createMockResponse();

      // Act
      await ServerController.createServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unsupported game type",
      });
    });

    it("devrait gérer les erreurs de création de container", async () => {
      // Arrange
      const createdServer = {
        ...validMinecraftServerPayload,
        save: mockSave,
      };

      MockServerModel.mockReturnValue(createdServer);
      mockCreateContainer.mockRejectedValue(new Error("Docker error"));

      const req = createMockRequest(validMinecraftServerPayload);
      const res = createMockResponse();

      // Act
      await ServerController.createServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
        error: expect.any(Error),
      });
    });
  });

  describe("getAllServers", () => {
    it("devrait retourner tous les serveurs", async () => {
      // Arrange
      mockFind.mockResolvedValue(serverList);

      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      await ServerController.getAllServers(req, res);

      // Assert
      expect(mockFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        servers: serverList,
      });
      expect(mockSuccess).toHaveBeenCalledWith("Fetched all servers");
    });

    it("devrait retourner un tableau vide si aucun serveur", async () => {
      // Arrange
      mockFind.mockResolvedValue([]);

      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      await ServerController.getAllServers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        servers: [],
      });
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockFind.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      await ServerController.getAllServers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
        error: expect.any(Error),
      });
    });
  });

  describe("getServerById", () => {
    it("devrait retourner un serveur par ID", async () => {
      // Arrange
      mockFindById.mockResolvedValue(runningServer);

      const req = createMockRequest({}, { serverId: runningServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.getServerById(req, res);

      // Assert
      expect(mockFindById).toHaveBeenCalledWith(runningServer._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        server: runningServer,
      });
      expect(mockSuccess).toHaveBeenCalledWith("Fetched server");
    });

    it("devrait retourner 404 si serveur introuvable", async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      const req = createMockRequest({}, { serverId: "nonexistent-id" });
      const res = createMockResponse();

      // Act
      await ServerController.getServerById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server not found",
      });
      expect(mockError).toHaveBeenCalledWith("Server not found");
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockFindById.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest({}, { serverId: "server-123" });
      const res = createMockResponse();

      // Act
      await ServerController.getServerById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getServersByUser", () => {
    it("devrait retourner les serveurs d'un utilisateur", async () => {
      // Arrange
      const mockUser = { _id: "user-123", email: "test@test.com" };
      mockUserFindById.mockResolvedValue(mockUser);
      mockFind.mockResolvedValue(serverList);

      const req = createMockRequest({}, { userId: "user-123" });
      const res = createMockResponse();

      // Act
      await ServerController.getServersByUser(req, res);

      // Assert
      expect(mockUserFindById).toHaveBeenCalledWith("user-123");
      expect(mockFind).toHaveBeenCalledWith({ owner: "user-123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        servers: serverList,
      });
    });

    it("devrait retourner 404 si utilisateur introuvable", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(null);

      const req = createMockRequest({}, { userId: "nonexistent-user" });
      const res = createMockResponse();

      // Act
      await ServerController.getServersByUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
      expect(mockFind).not.toHaveBeenCalled();
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockUserFindById.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest({}, { userId: "user-123" });
      const res = createMockResponse();

      // Act
      await ServerController.getServersByUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getServersByGame", () => {
    it("devrait retourner les serveurs d'un jeu spécifique", async () => {
      // Arrange
      const minecraftServers = [serverList[0]];
      mockFind.mockResolvedValue(minecraftServers);

      const req = createMockRequest({}, { game: "minecraft" });
      const res = createMockResponse();

      // Act
      await ServerController.getServersByGame(req, res);

      // Assert
      expect(mockFind).toHaveBeenCalledWith({ game: "minecraft" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        servers: minecraftServers,
      });
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockFind.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest({}, { game: "ark" });
      const res = createMockResponse();

      // Act
      await ServerController.getServersByGame(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("stopServer", () => {
    it("devrait arrêter un serveur en cours d'exécution", async () => {
      // Arrange
      const saveSpy = jest.fn().mockResolvedValue(undefined);
      const server = {
        ...runningServer,
        save: saveSpy,
      };
      mockFindById.mockResolvedValue(server);
      mockStopContainer.mockResolvedValue(undefined);

      const req = createMockRequest({}, { serverId: server._id });
      const res = createMockResponse();

      // Act
      await ServerController.stopServer(req, res);

      // Assert
      expect(mockFindById).toHaveBeenCalledWith(server._id);
      expect(mockStopContainer).toHaveBeenCalledWith(server.containerId);
      expect(saveSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Stopping server",
      });
    });

    it("devrait rejeter si le serveur est déjà arrêté", async () => {
      // Arrange
      mockFindById.mockResolvedValue(stoppedServer);

      const req = createMockRequest({}, { serverId: stoppedServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.stopServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server is already stopped",
      });
      expect(mockStopContainer).not.toHaveBeenCalled();
    });

    it("devrait retourner 404 si serveur introuvable", async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      const req = createMockRequest({}, { serverId: "nonexistent" });
      const res = createMockResponse();

      // Act
      await ServerController.stopServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server not found",
      });
    });

    it("devrait gérer les erreurs Docker", async () => {
      // Arrange
      mockFindById.mockResolvedValue(runningServer);
      mockStopContainer.mockRejectedValue(new Error("Docker error"));

      const req = createMockRequest({}, { serverId: runningServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.stopServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("startServer", () => {
    it("devrait démarrer un serveur arrêté", async () => {
      // Arrange
      const saveSpy = jest.fn().mockResolvedValue(undefined);
      const server = {
        ...stoppedServer,
        save: saveSpy,
      };
      mockFindById.mockResolvedValue(server);
      mockStartContainer.mockResolvedValue(undefined);

      const req = createMockRequest({}, { serverId: server._id });
      const res = createMockResponse();

      // Act
      await ServerController.startServer(req, res);

      // Assert
      expect(mockFindById).toHaveBeenCalledWith(server._id);
      expect(mockStartContainer).toHaveBeenCalledWith(server.containerId);
      expect(saveSpy).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Starting server",
      });
    });

    it("devrait rejeter si le serveur est déjà en cours d'exécution", async () => {
      // Arrange
      mockFindById.mockResolvedValue(runningServer);

      const req = createMockRequest({}, { serverId: runningServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.startServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server is already running",
      });
      expect(mockStartContainer).not.toHaveBeenCalled();
    });

    it("devrait retourner 404 si serveur introuvable", async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      const req = createMockRequest({}, { serverId: "nonexistent" });
      const res = createMockResponse();

      // Act
      await ServerController.startServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("devrait gérer les erreurs Docker", async () => {
      // Arrange
      mockFindById.mockResolvedValue(stoppedServer);
      mockStartContainer.mockRejectedValue(new Error("Docker error"));

      const req = createMockRequest({}, { serverId: stoppedServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.startServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getServerStats", () => {
    it("devrait retourner les statistiques du serveur", async () => {
      // Arrange
      mockFindById.mockResolvedValue(runningServer);
      mockSuccessfulStats();
      mockSuccessfulPlayerInfo(3, ["Alice", "Bob", "Charlie"]);

      const req = createMockRequest({}, { serverId: runningServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.getServerStats(req, res);

      // Assert
      expect(mockFindById).toHaveBeenCalledWith(runningServer._id);
      expect(mockGetStats).toHaveBeenCalledWith(runningServer.containerId);
      expect(mockGetPlayerInfo).toHaveBeenCalledWith(
        runningServer.containerId,
        runningServer.rconPassword
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Fetched server stats",
        stats: expect.objectContaining({
          cpuPercent: 25,
          memoryPercent: 25,
          playerCount: 3,
          players: ["Alice", "Bob", "Charlie"],
        }),
      });
    });

    it("devrait retourner 404 si serveur introuvable", async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      const req = createMockRequest({}, { serverId: "nonexistent" });
      const res = createMockResponse();

      // Act
      await ServerController.getServerStats(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server not found",
      });
    });

    it("devrait retourner 400 si le serveur n'a pas de containerId", async () => {
      // Arrange
      const serverWithoutContainer = { ...runningServer, containerId: null };
      mockFindById.mockResolvedValue(serverWithoutContainer);

      const req = createMockRequest({}, { serverId: runningServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.getServerStats(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server has no container id",
      });
    });

    it("devrait gérer playerInfo null", async () => {
      // Arrange
      mockFindById.mockResolvedValue(runningServer);
      mockSuccessfulStats();
      mockGetPlayerInfo.mockResolvedValue(null);

      const req = createMockRequest({}, { serverId: runningServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.getServerStats(req, res);

      // Assert
      expect(res.json).toHaveBeenCalledWith({
        message: "Fetched server stats",
        stats: expect.objectContaining({
          playerCount: 0,
          players: [],
        }),
      });
    });

    it("devrait gérer les erreurs Docker", async () => {
      // Arrange
      mockFindById.mockResolvedValue(runningServer);
      mockGetStats.mockRejectedValue(new Error("Container not found"));

      const req = createMockRequest({}, { serverId: runningServer._id });
      const res = createMockResponse();

      // Act
      await ServerController.getServerStats(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteServer", () => {
    it("devrait supprimer un serveur arrêté", async () => {
      // Arrange
      const server = { ...stoppedServer };
      mockFindById.mockResolvedValue(server);
      mockRemoveContainer.mockResolvedValue(undefined);
      mockFindByIdAndDelete.mockResolvedValue(server);

      const req = createMockRequest(
        {},
        { serverId: server._id, requester: server.owner }
      );
      const res = createMockResponse();

      // Act
      await ServerController.deleteServer(req, res);

      // Assert
      expect(mockFindById).toHaveBeenCalledWith(server._id);
      expect(mockRemoveContainer).toHaveBeenCalledWith(server.containerId);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith(server._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server deleted successfully",
      });
    });

    it("devrait rejeter si paramètres manquants", async () => {
      // Arrange
      const req = createMockRequest({}, { serverId: "server-123" });
      const res = createMockResponse();

      // Act
      await ServerController.deleteServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Missing parameters",
      });
    });

    it("devrait rejeter si le serveur n'existe pas", async () => {
      // Arrange
      mockFindById.mockResolvedValue(null);

      const req = createMockRequest(
        {},
        { serverId: "nonexistent", requester: "user-123" }
      );
      const res = createMockResponse();

      // Act
      await ServerController.deleteServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Server not found",
      });
    });

    it("devrait rejeter si le serveur est en cours d'exécution", async () => {
      // Arrange
      mockFindById.mockResolvedValue(runningServer);

      const req = createMockRequest(
        {},
        { serverId: runningServer._id, requester: runningServer.owner }
      );
      const res = createMockResponse();

      // Act
      await ServerController.deleteServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Cannot delete a running server",
      });
      expect(mockRemoveContainer).not.toHaveBeenCalled();
    });

    it("devrait rejeter si requester n'est pas le propriétaire", async () => {
      // Arrange
      mockFindById.mockResolvedValue(stoppedServer);

      const req = createMockRequest(
        {},
        { serverId: stoppedServer._id, requester: "not-the-owner" }
      );
      const res = createMockResponse();

      // Act
      await ServerController.deleteServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Unauthorized operation",
      });
    });

    it("devrait gérer les erreurs Docker", async () => {
      // Arrange
      mockFindById.mockResolvedValue(stoppedServer);
      mockRemoveContainer.mockRejectedValue(new Error("Docker error"));

      const req = createMockRequest(
        {},
        { serverId: stoppedServer._id, requester: stoppedServer.owner }
      );
      const res = createMockResponse();

      // Act
      await ServerController.deleteServer(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
