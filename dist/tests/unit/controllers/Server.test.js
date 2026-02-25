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
const MockServerModel_1 = require("../../mocks/MockServerModel");
const MockUserModel_1 = require("../../mocks/MockUserModel");
const MockMinecraftHandler_1 = require("../../mocks/MockMinecraftHandler");
const MockArkHandler_1 = require("../../mocks/MockArkHandler");
const MockGetServerAddress_1 = require("../../mocks/MockGetServerAddress");
const MockRetour_1 = require("../../mocks/MockRetour");
const ServerFixtures_1 = require("../../fixtures/ServerFixtures");
jest.mock('../../../models/Server', () => ({
    __esModule: true,
    default: MockServerModel_1.MockServerModel,
}));
jest.mock('../../../models/User', () => ({
    __esModule: true,
    default: MockUserModel_1.MockUserModel,
}));
jest.mock('../../../handler/Minecraft', () => ({
    MinecraftHandler: MockMinecraftHandler_1.MockMinecraftHandler,
}));
jest.mock('../../../handler/ark', () => ({
    ArkHandler: MockArkHandler_1.MockArkHandler,
}));
jest.mock('../../../utils/getServerAddress', () => ({
    getGameServerAddress: MockGetServerAddress_1.mockGetGameServerAddress,
}));
jest.mock('../../../library/Retour', () => ({
    __esModule: true,
    default: MockRetour_1.MockRetour,
}));
const Server_1 = __importDefault(require("../../../controllers/Server"));
describe('ServerController', () => {
    const createMockRequest = (body = {}, params = {}, extras = {}) => (Object.assign({ body,
        params, hostname: '192.168.1.100', socket: { remoteAddress: '192.168.1.100' } }, extras));
    const createMockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    beforeEach(() => {
        (0, MockServerModel_1.resetServerModelMocks)();
        (0, MockUserModel_1.resetUserModelMocks)();
        (0, MockMinecraftHandler_1.resetMinecraftHandlerMocks)();
        (0, MockArkHandler_1.resetArkHandlerMocks)();
        (0, MockGetServerAddress_1.resetGetServerAddressMock)();
        (0, MockRetour_1.resetRetourMocks)();
    });
    describe('createServer', () => {
        it('devrait créer un serveur Minecraft avec succès', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdServer = Object.assign(Object.assign({}, ServerFixtures_1.validMinecraftServerPayload), { _id: 'new-server-123', containerId: '', rconPassword: '', ipAddress: '', status: 'creating', operators: [], save: MockServerModel_1.mockSave });
            MockServerModel_1.MockServerModel.mockReturnValue(createdServer);
            MockMinecraftHandler_1.mockCreateContainer.mockResolvedValue({
                containerId: 'container-mc-123',
                rconPassword: 'rcon-pass-123',
            });
            (0, MockGetServerAddress_1.mockSuccessfulAddress)('192.168.1.100:25565');
            MockServerModel_1.mockSave.mockResolvedValue(createdServer);
            const req = createMockRequest(ServerFixtures_1.validMinecraftServerPayload);
            const res = createMockResponse();
            yield Server_1.default.createServer(req, res);
            expect(MockServerModel_1.MockServerModel).toHaveBeenCalledWith({
                name: ServerFixtures_1.validMinecraftServerPayload.name,
                owner: ServerFixtures_1.validMinecraftServerPayload.owner,
                game: ServerFixtures_1.validMinecraftServerPayload.game,
                ipAddress: '',
                port: ServerFixtures_1.validMinecraftServerPayload.port,
                containerId: '',
                rconPassword: '',
            });
            expect(MockMinecraftHandler_1.mockCreateContainer).toHaveBeenCalled();
            expect(MockServerModel_1.mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server created successfully',
                server: expect.objectContaining({
                    containerId: 'container-mc-123',
                    rconPassword: 'rcon-pass-123',
                    status: 'running',
                }),
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('Server created successfully');
        }));
        it('devrait créer un serveur ARK avec succès', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdServer = Object.assign(Object.assign({}, ServerFixtures_1.validArkServerPayload), { _id: 'new-ark-server', containerId: '', rconPassword: '', ipAddress: '', status: 'creating', operators: [], save: MockServerModel_1.mockSave });
            MockServerModel_1.MockServerModel.mockReturnValue(createdServer);
            (0, MockArkHandler_1.mockSuccessfulArkContainerCreation)('container-ark-123');
            (0, MockGetServerAddress_1.mockSuccessfulAddress)('192.168.1.100:7777');
            MockServerModel_1.mockSave.mockResolvedValue(createdServer);
            const req = createMockRequest(ServerFixtures_1.validArkServerPayload);
            const res = createMockResponse();
            yield Server_1.default.createServer(req, res);
            expect(MockArkHandler_1.mockArkCreateContainer).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({
                serverName: ServerFixtures_1.validArkServerPayload.name,
                serverMap: ServerFixtures_1.validArkServerPayload.map,
                maxPlayers: ServerFixtures_1.validArkServerPayload.maxPlayers,
            }));
            expect(res.status).toHaveBeenCalledWith(201);
            expect(MockRetour_1.mockSuccess).toHaveBeenCalled();
        }));
        it('devrait rejeter ARK si map ou maxPlayers manquant', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidPayload = Object.assign(Object.assign({}, ServerFixtures_1.validArkServerPayload), { map: undefined });
            MockServerModel_1.MockServerModel.mockReturnValue(Object.assign(Object.assign({}, invalidPayload), { save: MockServerModel_1.mockSave }));
            const req = createMockRequest(invalidPayload);
            const res = createMockResponse();
            yield Server_1.default.createServer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing parameters for ARK server',
            });
            expect(MockArkHandler_1.mockArkCreateContainer).not.toHaveBeenCalled();
        }));
        it('devrait rejeter un type de jeu non supporté', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidGamePayload = Object.assign(Object.assign({}, ServerFixtures_1.validMinecraftServerPayload), { game: 'unsupported-game' });
            MockServerModel_1.MockServerModel.mockReturnValue(Object.assign(Object.assign({}, invalidGamePayload), { save: MockServerModel_1.mockSave }));
            const req = createMockRequest(invalidGamePayload);
            const res = createMockResponse();
            yield Server_1.default.createServer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Unsupported game type',
            });
        }));
        it('devrait gérer les erreurs de création de container', () => __awaiter(void 0, void 0, void 0, function* () {
            const createdServer = Object.assign(Object.assign({}, ServerFixtures_1.validMinecraftServerPayload), { save: MockServerModel_1.mockSave });
            MockServerModel_1.MockServerModel.mockReturnValue(createdServer);
            MockMinecraftHandler_1.mockCreateContainer.mockRejectedValue(new Error('Docker error'));
            const req = createMockRequest(ServerFixtures_1.validMinecraftServerPayload);
            const res = createMockResponse();
            yield Server_1.default.createServer(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
                error: expect.any(Error),
            });
        }));
    });
    describe('getAllServers', () => {
        it('devrait retourner tous les serveurs', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFind.mockResolvedValue(ServerFixtures_1.serverList);
            const req = createMockRequest();
            const res = createMockResponse();
            yield Server_1.default.getAllServers(req, res);
            expect(MockServerModel_1.mockFind).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                servers: ServerFixtures_1.serverList,
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('Fetched all servers');
        }));
        it('devrait retourner un tableau vide si aucun serveur', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFind.mockResolvedValue([]);
            const req = createMockRequest();
            const res = createMockResponse();
            yield Server_1.default.getAllServers(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                servers: [],
            });
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFind.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest();
            const res = createMockResponse();
            yield Server_1.default.getAllServers(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
                error: expect.any(Error),
            });
        }));
    });
    describe('getServerById', () => {
        it('devrait retourner un serveur par ID', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.runningServer);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id });
            const res = createMockResponse();
            yield Server_1.default.getServerById(req, res);
            expect(MockServerModel_1.mockFindById).toHaveBeenCalledWith(ServerFixtures_1.runningServer._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                server: ServerFixtures_1.runningServer,
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('Fetched server');
        }));
        it('devrait retourner 404 si serveur introuvable', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { serverId: 'nonexistent-id' });
            const res = createMockResponse();
            yield Server_1.default.getServerById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server not found',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('Server not found');
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest({}, { serverId: 'server-123' });
            const res = createMockResponse();
            yield Server_1.default.getServerById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('getServersByUser', () => {
        it('devrait retourner les serveurs d\'un utilisateur', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { _id: 'user-123', email: 'test@test.com' };
            MockUserModel_1.mockUserFindById.mockResolvedValue(mockUser);
            MockServerModel_1.mockFind.mockResolvedValue(ServerFixtures_1.serverList);
            const req = createMockRequest({}, { userId: 'user-123' });
            const res = createMockResponse();
            yield Server_1.default.getServersByUser(req, res);
            expect(MockUserModel_1.mockUserFindById).toHaveBeenCalledWith('user-123');
            expect(MockServerModel_1.mockFind).toHaveBeenCalledWith({ owner: 'user-123' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                servers: ServerFixtures_1.serverList,
            });
        }));
        it('devrait retourner 404 si utilisateur introuvable', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { userId: 'nonexistent-user' });
            const res = createMockResponse();
            yield Server_1.default.getServersByUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found',
            });
            expect(MockServerModel_1.mockFind).not.toHaveBeenCalled();
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest({}, { userId: 'user-123' });
            const res = createMockResponse();
            yield Server_1.default.getServersByUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('getServersByGame', () => {
        it('devrait retourner les serveurs d\'un jeu spécifique', () => __awaiter(void 0, void 0, void 0, function* () {
            const minecraftServers = [ServerFixtures_1.serverList[0]];
            MockServerModel_1.mockFind.mockResolvedValue(minecraftServers);
            const req = createMockRequest({}, { game: 'minecraft' });
            const res = createMockResponse();
            yield Server_1.default.getServersByGame(req, res);
            expect(MockServerModel_1.mockFind).toHaveBeenCalledWith({ game: 'minecraft' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                servers: minecraftServers,
            });
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFind.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest({}, { game: 'ark' });
            const res = createMockResponse();
            yield Server_1.default.getServersByGame(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('stopServer', () => {
        it('devrait arrêter un serveur en cours d\'exécution', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = Object.assign({}, ServerFixtures_1.runningServer);
            MockServerModel_1.mockFindById.mockResolvedValue(server);
            MockMinecraftHandler_1.mockStopContainer.mockResolvedValue(undefined);
            MockServerModel_1.mockSave.mockResolvedValue(server);
            const req = createMockRequest({}, { serverId: server._id });
            const res = createMockResponse();
            yield Server_1.default.stopServer(req, res);
            expect(MockServerModel_1.mockFindById).toHaveBeenCalledWith(server._id);
            expect(MockMinecraftHandler_1.mockStopContainer).toHaveBeenCalledWith(server.containerId);
            expect(MockServerModel_1.mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Stopping server',
            });
        }));
        it('devrait rejeter si le serveur est déjà arrêté', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.stoppedServer);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.stoppedServer._id });
            const res = createMockResponse();
            yield Server_1.default.stopServer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server is already stopped',
            });
            expect(MockMinecraftHandler_1.mockStopContainer).not.toHaveBeenCalled();
        }));
        it('devrait retourner 404 si serveur introuvable', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { serverId: 'nonexistent' });
            const res = createMockResponse();
            yield Server_1.default.stopServer(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server not found',
            });
        }));
        it('devrait gérer les erreurs Docker', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.runningServer);
            MockMinecraftHandler_1.mockStopContainer.mockRejectedValue(new Error('Docker error'));
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id });
            const res = createMockResponse();
            yield Server_1.default.stopServer(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('startServer', () => {
        it('devrait démarrer un serveur arrêté', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = Object.assign({}, ServerFixtures_1.stoppedServer);
            MockServerModel_1.mockFindById.mockResolvedValue(server);
            MockMinecraftHandler_1.mockStartContainer.mockResolvedValue(undefined);
            MockServerModel_1.mockSave.mockResolvedValue(server);
            const req = createMockRequest({}, { serverId: server._id });
            const res = createMockResponse();
            yield Server_1.default.startServer(req, res);
            expect(MockServerModel_1.mockFindById).toHaveBeenCalledWith(server._id);
            expect(MockMinecraftHandler_1.mockStartContainer).toHaveBeenCalledWith(server.containerId);
            expect(MockServerModel_1.mockSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Starting server',
            });
        }));
        it('devrait rejeter si le serveur est déjà en cours d\'exécution', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.runningServer);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id });
            const res = createMockResponse();
            yield Server_1.default.startServer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server is already running',
            });
            expect(MockMinecraftHandler_1.mockStartContainer).not.toHaveBeenCalled();
        }));
        it('devrait retourner 404 si serveur introuvable', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { serverId: 'nonexistent' });
            const res = createMockResponse();
            yield Server_1.default.startServer(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
        }));
        it('devrait gérer les erreurs Docker', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.stoppedServer);
            MockMinecraftHandler_1.mockStartContainer.mockRejectedValue(new Error('Docker error'));
            const req = createMockRequest({}, { serverId: ServerFixtures_1.stoppedServer._id });
            const res = createMockResponse();
            yield Server_1.default.startServer(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('getServerStats', () => {
        it('devrait retourner les statistiques du serveur', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.runningServer);
            (0, MockMinecraftHandler_1.mockSuccessfulStats)();
            (0, MockMinecraftHandler_1.mockSuccessfulPlayerInfo)(3, ['Alice', 'Bob', 'Charlie']);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id });
            const res = createMockResponse();
            yield Server_1.default.getServerStats(req, res);
            expect(MockServerModel_1.mockFindById).toHaveBeenCalledWith(ServerFixtures_1.runningServer._id);
            expect(MockMinecraftHandler_1.mockGetStats).toHaveBeenCalledWith(ServerFixtures_1.runningServer.containerId);
            expect(MockMinecraftHandler_1.mockGetPlayerInfo).toHaveBeenCalledWith(ServerFixtures_1.runningServer.containerId, ServerFixtures_1.runningServer.rconPassword);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Fetched server stats',
                stats: expect.objectContaining({
                    cpuPercent: 25,
                    memoryPercent: 25,
                    playerCount: 3,
                    players: ['Alice', 'Bob', 'Charlie'],
                }),
            });
        }));
        it('devrait retourner 404 si serveur introuvable', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { serverId: 'nonexistent' });
            const res = createMockResponse();
            yield Server_1.default.getServerStats(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server not found',
            });
        }));
        it('devrait retourner 400 si le serveur n\'a pas de containerId', () => __awaiter(void 0, void 0, void 0, function* () {
            const serverWithoutContainer = Object.assign(Object.assign({}, ServerFixtures_1.runningServer), { containerId: null });
            MockServerModel_1.mockFindById.mockResolvedValue(serverWithoutContainer);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id });
            const res = createMockResponse();
            yield Server_1.default.getServerStats(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server has no container id',
            });
        }));
        it('devrait gérer playerInfo null', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.runningServer);
            (0, MockMinecraftHandler_1.mockSuccessfulStats)();
            MockMinecraftHandler_1.mockGetPlayerInfo.mockResolvedValue(null);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id });
            const res = createMockResponse();
            yield Server_1.default.getServerStats(req, res);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Fetched server stats',
                stats: expect.objectContaining({
                    playerCount: 0,
                    players: [],
                }),
            });
        }));
        it('devrait gérer les erreurs Docker', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.runningServer);
            MockMinecraftHandler_1.mockGetStats.mockRejectedValue(new Error('Container not found'));
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id });
            const res = createMockResponse();
            yield Server_1.default.getServerStats(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
    describe('deleteServer', () => {
        it('devrait supprimer un serveur arrêté', () => __awaiter(void 0, void 0, void 0, function* () {
            const server = Object.assign({}, ServerFixtures_1.stoppedServer);
            MockServerModel_1.mockFindById.mockResolvedValue(server);
            MockMinecraftHandler_1.mockRemoveContainer.mockResolvedValue(undefined);
            MockServerModel_1.mockFindByIdAndDelete.mockResolvedValue(server);
            const req = createMockRequest({}, { serverId: server._id, requester: server.owner });
            const res = createMockResponse();
            yield Server_1.default.deleteServer(req, res);
            expect(MockServerModel_1.mockFindById).toHaveBeenCalledWith(server._id);
            expect(MockMinecraftHandler_1.mockRemoveContainer).toHaveBeenCalledWith(server.containerId);
            expect(MockServerModel_1.mockFindByIdAndDelete).toHaveBeenCalledWith(server._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server deleted successfully',
            });
        }));
        it('devrait rejeter si paramètres manquants', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = createMockRequest({}, { serverId: 'server-123' });
            const res = createMockResponse();
            yield Server_1.default.deleteServer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing parameters',
            });
        }));
        it('devrait rejeter si le serveur n\'existe pas', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { serverId: 'nonexistent', requester: 'user-123' });
            const res = createMockResponse();
            yield Server_1.default.deleteServer(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Server not found',
            });
        }));
        it('devrait rejeter si le serveur est en cours d\'exécution', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.runningServer);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.runningServer._id, requester: ServerFixtures_1.runningServer.owner });
            const res = createMockResponse();
            yield Server_1.default.deleteServer(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Cannot delete a running server',
            });
            expect(MockMinecraftHandler_1.mockRemoveContainer).not.toHaveBeenCalled();
        }));
        it('devrait rejeter si requester n\'est pas le propriétaire', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.stoppedServer);
            const req = createMockRequest({}, { serverId: ServerFixtures_1.stoppedServer._id, requester: 'not-the-owner' });
            const res = createMockResponse();
            yield Server_1.default.deleteServer(req, res);
            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Unauthorized operation',
            });
        }));
        it('devrait gérer les erreurs Docker', () => __awaiter(void 0, void 0, void 0, function* () {
            MockServerModel_1.mockFindById.mockResolvedValue(ServerFixtures_1.stoppedServer);
            MockMinecraftHandler_1.mockRemoveContainer.mockRejectedValue(new Error('Docker error'));
            const req = createMockRequest({}, { serverId: ServerFixtures_1.stoppedServer._id, requester: ServerFixtures_1.stoppedServer.owner });
            const res = createMockResponse();
            yield Server_1.default.deleteServer(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvdGVzdHMvdW5pdC9jb250cm9sbGVycy9TZXJ2ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLGlFQU9xQztBQUVyQyw2REFJbUM7QUFFbkMsMkVBVzBDO0FBRTFDLCtEQUtvQztBQUVwQywyRUFJMEM7QUFFMUMsdURBS2dDO0FBRWhDLGtFQU11QztBQUd2QyxJQUFJLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekMsVUFBVSxFQUFFLElBQUk7SUFDaEIsT0FBTyxFQUFFLGlDQUFlO0NBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBRUosSUFBSSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSw2QkFBYTtDQUN2QixDQUFDLENBQUMsQ0FBQztBQUVKLElBQUksQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3QyxnQkFBZ0IsRUFBRSwyQ0FBb0I7Q0FDdkMsQ0FBQyxDQUFDLENBQUM7QUFFSixJQUFJLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsVUFBVSxFQUFFLCtCQUFjO0NBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUosSUFBSSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELG9CQUFvQixFQUFFLCtDQUF3QjtDQUMvQyxDQUFDLENBQUMsQ0FBQztBQUVKLElBQUksQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMxQyxVQUFVLEVBQUUsSUFBSTtJQUNoQixPQUFPLEVBQUUsdUJBQVU7Q0FD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