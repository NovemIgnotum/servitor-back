"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockFailedStats = exports.mockSuccessfulPlayerInfo = exports.mockSuccessfulStats = exports.resetMinecraftHandlerMocks = exports.MockMinecraftHandler = exports.mockRemoveContainer = exports.mockCreateContainer = exports.mockStopContainer = exports.mockStartContainer = exports.mockExecuteCommande = exports.mockGetPlayerInfo = exports.mockGetStats = void 0;
exports.mockGetStats = jest.fn();
exports.mockGetPlayerInfo = jest.fn();
exports.mockExecuteCommande = jest.fn();
exports.mockStartContainer = jest.fn();
exports.mockStopContainer = jest.fn();
exports.mockCreateContainer = jest.fn();
exports.mockRemoveContainer = jest.fn();
exports.MockMinecraftHandler = jest.fn().mockImplementation(() => ({
    getStats: exports.mockGetStats,
    getPlayerInfo: exports.mockGetPlayerInfo,
    executeCommande: exports.mockExecuteCommande,
    startContainer: exports.mockStartContainer,
    stopContainer: exports.mockStopContainer,
    createContainer: exports.mockCreateContainer,
    removeContainer: exports.mockRemoveContainer,
}));
const resetMinecraftHandlerMocks = () => {
    exports.mockGetStats.mockReset();
    exports.mockGetPlayerInfo.mockReset();
    exports.mockExecuteCommande.mockReset();
    exports.mockStartContainer.mockReset();
    exports.mockStopContainer.mockReset();
    exports.mockCreateContainer.mockReset();
    exports.mockRemoveContainer.mockReset();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja01pbmVjcmFmdEhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvbW9ja3MvTW9ja01pbmVjcmFmdEhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3pCLFFBQUEsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzlCLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2hDLFFBQUEsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQy9CLFFBQUEsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzlCLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2hDLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRWhDLFFBQUEsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEUsUUFBUSxFQUFFLG9CQUFZO0lBQ3RCLGFBQWEsRUFBRSx5QkFBaUI7SUFDaEMsZUFBZSxFQUFFLDJCQUFtQjtJQUNwQyxjQUFjLEVBQUUsMEJBQWtCO0lBQ2xDLGFBQWEsRUFBRSx5QkFBaUI7SUFDaEMsZUFBZSxFQUFFLDJCQUFtQjtJQUNwQyxlQUFlLEVBQUUsMkJBQW1CO0NBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBRUcsTUFBTSwwQkFBMEIsR0FBRyxHQUFHLEVBQUU7SUFDN0Msb0JBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6Qix5QkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM5QiwyQkFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoQywwQkFBa0IsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMvQix5QkFBaUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUM5QiwyQkFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNoQywyQkFBbUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFSVyxRQUFBLDBCQUEwQiw4QkFRckM7QUFFSyxNQUFNLG1CQUFtQixHQUFHLEdBQUcsRUFBRTtJQUN0QyxvQkFBWSxDQUFDLGlCQUFpQixDQUFDO1FBQzdCLFVBQVUsRUFBRSxFQUFFO1FBQ2QsV0FBVyxFQUFFLEdBQUc7UUFDaEIsV0FBVyxFQUFFLElBQUk7UUFDakIsYUFBYSxFQUFFLEVBQUU7S0FDbEIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBUFcsUUFBQSxtQkFBbUIsdUJBTzlCO0FBRUssTUFBTSx3QkFBd0IsR0FBRyxDQUN0QyxLQUFLLEdBQUcsQ0FBQyxFQUNULE9BQU8sR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsRUFDMUIsRUFBRTtJQUNGLHlCQUFpQixDQUFDLGlCQUFpQixDQUFDO1FBQ2xDLEtBQUs7UUFDTCxPQUFPO0tBQ1IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBUlcsUUFBQSx3QkFBd0IsNEJBUW5DO0FBRUssTUFBTSxlQUFlLEdBQUcsQ0FDN0IsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLDRCQUE0QixDQUFDLEVBQy9DLEVBQUU7SUFDRixvQkFBWSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQztBQUpXLFFBQUEsZUFBZSxtQkFJMUIifQ==