"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverList = exports.stoppedServer = exports.runningServer = exports.validArkServerPayload = exports.validMinecraftServerPayload = exports.validServerPayload = void 0;
exports.validServerPayload = {
    name: "My Minecraft Server",
    game: "minecraft",
    owner: "user-123",
    version: "1.20.1",
    serverType: "vanilla",
    maxPlayers: 20,
    difficulty: "normal",
};
exports.validMinecraftServerPayload = {
    name: 'Minecraft Test Server',
    owner: 'user-123',
    game: 'minecraft',
    port: 25565,
};
exports.validArkServerPayload = {
    name: 'ARK Test Server',
    owner: 'user-123',
    game: 'ark',
    port: 7777,
    map: 'TheIsland',
    maxPlayers: 10,
    serverPassword: 'serverpass',
    adminPassword: 'adminpass',
};
exports.runningServer = {
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
exports.stoppedServer = {
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
exports.serverList = [
    {
        _id: 'server-1',
        name: 'Server One',
        owner: 'user-123',
        game: 'minecraft',
        status: 'running',
    },
    {
        _id: 'server-2',
        name: 'Server Two',
        owner: 'user-456',
        game: 'ark',
        status: 'running',
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyRml4dHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvZml4dHVyZXMvU2VydmVyRml4dHVyZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxrQkFBa0IsR0FBRztJQUNoQyxJQUFJLEVBQUUscUJBQXFCO0lBQzNCLElBQUksRUFBRSxXQUFXO0lBQ2pCLEtBQUssRUFBRSxVQUFVO0lBQ2pCLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLFVBQVUsRUFBRSxTQUFTO0lBQ3JCLFVBQVUsRUFBRSxFQUFFO0lBQ2QsVUFBVSxFQUFFLFFBQVE7Q0FDckIsQ0FBQztBQUVXLFFBQUEsMkJBQTJCLEdBQUc7SUFDekMsSUFBSSxFQUFFLHVCQUF1QjtJQUM3QixLQUFLLEVBQUUsVUFBVTtJQUNqQixJQUFJLEVBQUUsV0FBVztJQUNqQixJQUFJLEVBQUUsS0FBSztDQUNaLENBQUM7QUFFVyxRQUFBLHFCQUFxQixHQUFHO0lBQ25DLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsS0FBSyxFQUFFLFVBQVU7SUFDakIsSUFBSSxFQUFFLEtBQUs7SUFDWCxJQUFJLEVBQUUsSUFBSTtJQUNWLEdBQUcsRUFBRSxXQUFXO0lBQ2hCLFVBQVUsRUFBRSxFQUFFO0lBQ2QsY0FBYyxFQUFFLFlBQVk7SUFDNUIsYUFBYSxFQUFFLFdBQVc7Q0FDM0IsQ0FBQztBQUVXLFFBQUEsYUFBYSxHQUFHO0lBQzNCLEdBQUcsRUFBRSxZQUFZO0lBQ2pCLElBQUksRUFBRSxnQkFBZ0I7SUFDdEIsTUFBTSxFQUFFLFNBQVM7SUFDakIsV0FBVyxFQUFFLGVBQWU7SUFDNUIsS0FBSyxFQUFFLFVBQVU7SUFDakIsWUFBWSxFQUFFLFdBQVc7SUFDekIsSUFBSSxFQUFFLFdBQVc7SUFDakIsT0FBTyxFQUFFLFFBQVE7SUFDakIsU0FBUyxFQUFFLEVBQUU7SUFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztDQUN4QyxDQUFDO0FBRVcsUUFBQSxhQUFhLEdBQUc7SUFDM0IsR0FBRyxFQUFFLFlBQVk7SUFDakIsSUFBSSxFQUFFLGdCQUFnQjtJQUN0QixNQUFNLEVBQUUsU0FBUztJQUNqQixXQUFXLEVBQUUsbUJBQW1CO0lBQ2hDLEtBQUssRUFBRSxVQUFVO0lBQ2pCLElBQUksRUFBRSxXQUFXO0lBQ2pCLE9BQU8sRUFBRSxRQUFRO0lBQ2pCLFNBQVMsRUFBRSxFQUFFO0lBQ2IsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7Q0FDeEMsQ0FBQztBQUVXLFFBQUEsVUFBVSxHQUFHO0lBQ3hCO1FBQ0UsR0FBRyxFQUFFLFVBQVU7UUFDZixJQUFJLEVBQUUsWUFBWTtRQUNsQixLQUFLLEVBQUUsVUFBVTtRQUNqQixJQUFJLEVBQUUsV0FBVztRQUNqQixNQUFNLEVBQUUsU0FBUztLQUNsQjtJQUNEO1FBQ0UsR0FBRyxFQUFFLFVBQVU7UUFDZixJQUFJLEVBQUUsWUFBWTtRQUNsQixLQUFLLEVBQUUsVUFBVTtRQUNqQixJQUFJLEVBQUUsS0FBSztRQUNYLE1BQU0sRUFBRSxTQUFTO0tBQ2xCO0NBQ0YsQ0FBQyJ9