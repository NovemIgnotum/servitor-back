"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockFailedStats = exports.mockSuccessfulPlayerInfo = exports.mockSuccessfulStats = exports.resetMinecraftHandlerMocks = exports.MockMinecraftHandler = exports.mockStopServer = exports.mockStartServer = exports.mockExecuteCommande = exports.mockGetPlayerInfo = exports.mockGetStats = void 0;
exports.mockGetStats = jest.fn();
exports.mockGetPlayerInfo = jest.fn();
exports.mockExecuteCommande = jest.fn();
exports.mockStartServer = jest.fn();
exports.mockStopServer = jest.fn();
exports.MockMinecraftHandler = jest.fn().mockImplementation(() => ({
    getStats: exports.mockGetStats,
    getPlayerInfo: exports.mockGetPlayerInfo,
    executeCommande: exports.mockExecuteCommande,
    startServer: exports.mockStartServer,
    stopServer: exports.mockStopServer,
}));
const resetMinecraftHandlerMocks = () => {
    exports.mockGetStats.mockReset();
    exports.mockGetPlayerInfo.mockReset();
    exports.mockExecuteCommande.mockReset();
    exports.mockStartServer.mockReset();
    exports.mockStopServer.mockReset();
};
exports.resetMinecraftHandlerMocks = resetMinecraftHandlerMocks;
const mockSuccessfulStats = () => {
    exports.mockGetStats.mockResolvedValue({
        cpuPercent: 25,
        memoryUsage: 512,
        memoryLimit: 2048,
        memoryPercent: 25,
    });
};
exports.mockSuccessfulStats = mockSuccessfulStats;
const mockSuccessfulPlayerInfo = (count = 2, players = ["Alice", "Bob"]) => {
    exports.mockGetPlayerInfo.mockResolvedValue({
        count,
        players,
    });
};
exports.mockSuccessfulPlayerInfo = mockSuccessfulPlayerInfo;
const mockFailedStats = (error = new Error("Docker container not found")) => {
    exports.mockGetStats.mockRejectedValue(error);
};
exports.mockFailedStats = mockFailedStats;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWluZWNyYWZ0SGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9tb2Nrcy9NaW5lY3JhZnRIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUN6QixRQUFBLGlCQUFpQixHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUM5QixRQUFBLG1CQUFtQixHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNoQyxRQUFBLGVBQWUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDNUIsUUFBQSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRTNCLFFBQUEsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEUsUUFBUSxFQUFFLG9CQUFZO0lBQ3RCLGFBQWEsRUFBRSx5QkFBaUI7SUFDaEMsZUFBZSxFQUFFLDJCQUFtQjtJQUNwQyxXQUFXLEVBQUUsdUJBQWU7SUFDNUIsVUFBVSxFQUFFLHNCQUFjO0NBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUcsTUFBTSwwQkFBMEIsR0FBRyxHQUFHLEVBQUU7SUFDN0Msb0JBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6Qix5QkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM5QiwyQkFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoQyx1QkFBZSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzVCLHNCQUFjLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDN0IsQ0FBQyxDQUFDO0FBTlcsUUFBQSwwQkFBMEIsOEJBTXJDO0FBRUssTUFBTSxtQkFBbUIsR0FBRyxHQUFHLEVBQUU7SUFDdEMsb0JBQVksQ0FBQyxpQkFBaUIsQ0FBQztRQUM3QixVQUFVLEVBQUUsRUFBRTtRQUNkLFdBQVcsRUFBRSxHQUFHO1FBQ2hCLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLGFBQWEsRUFBRSxFQUFFO0tBQ2xCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQVBXLFFBQUEsbUJBQW1CLHVCQU85QjtBQUVLLE1BQU0sd0JBQXdCLEdBQUcsQ0FDdEMsS0FBSyxHQUFHLENBQUMsRUFDVCxPQUFPLEdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQzFCLEVBQUU7SUFDRix5QkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUNsQyxLQUFLO1FBQ0wsT0FBTztLQUNSLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQVJXLFFBQUEsd0JBQXdCLDRCQVFuQztBQUVLLE1BQU0sZUFBZSxHQUFHLENBQzdCLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxFQUMvQyxFQUFFO0lBQ0Ysb0JBQVksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN4QyxDQUFDLENBQUM7QUFKVyxRQUFBLGVBQWUsbUJBSTFCIn0=