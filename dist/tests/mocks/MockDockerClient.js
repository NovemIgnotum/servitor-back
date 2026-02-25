"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockFailedContainerCreation = exports.mockSuccessfulContainerCreation = exports.resetDockerClientMocks = exports.MockDockerClient = exports.mockExecInContainer = exports.mockGetContainerLogs = exports.mockRemoveContainer = exports.mockStopContainer = exports.mockStartContainer = exports.mockCreateContainer = void 0;
exports.mockCreateContainer = jest.fn();
exports.mockStartContainer = jest.fn();
exports.mockStopContainer = jest.fn();
exports.mockRemoveContainer = jest.fn();
exports.mockGetContainerLogs = jest.fn();
exports.mockExecInContainer = jest.fn();
exports.MockDockerClient = {
    createContainer: exports.mockCreateContainer,
    startContainer: exports.mockStartContainer,
    stopContainer: exports.mockStopContainer,
    removeContainer: exports.mockRemoveContainer,
    getContainerLogs: exports.mockGetContainerLogs,
    execInContainer: exports.mockExecInContainer,
};
const resetDockerClientMocks = () => {
    exports.mockCreateContainer.mockReset();
    exports.mockStartContainer.mockReset();
    exports.mockStopContainer.mockReset();
    exports.mockRemoveContainer.mockReset();
    exports.mockGetContainerLogs.mockReset();
    exports.mockExecInContainer.mockReset();
};
exports.resetDockerClientMocks = resetDockerClientMocks;
const mockSuccessfulContainerCreation = (containerId = "container-abc-123") => {
    exports.mockCreateContainer.mockResolvedValue({
        id: containerId,
        name: "minecraft-server-test",
        state: "created",
    });
    exports.mockStartContainer.mockResolvedValue({ success: true });
};
exports.mockSuccessfulContainerCreation = mockSuccessfulContainerCreation;
const mockFailedContainerCreation = (error = new Error("Docker daemon not responding")) => {
    exports.mockCreateContainer.mockRejectedValue(error);
};
exports.mockFailedContainerCreation = mockFailedContainerCreation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja0RvY2tlckNsaWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9tb2Nrcy9Nb2NrRG9ja2VyQ2xpZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2hDLFFBQUEsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQy9CLFFBQUEsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQzlCLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2hDLFFBQUEsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ2pDLFFBQUEsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRWhDLFFBQUEsZ0JBQWdCLEdBQUc7SUFDOUIsZUFBZSxFQUFFLDJCQUFtQjtJQUNwQyxjQUFjLEVBQUUsMEJBQWtCO0lBQ2xDLGFBQWEsRUFBRSx5QkFBaUI7SUFDaEMsZUFBZSxFQUFFLDJCQUFtQjtJQUNwQyxnQkFBZ0IsRUFBRSw0QkFBb0I7SUFDdEMsZUFBZSxFQUFFLDJCQUFtQjtDQUNyQyxDQUFDO0FBRUssTUFBTSxzQkFBc0IsR0FBRyxHQUFHLEVBQUU7SUFDekMsMkJBQW1CLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEMsMEJBQWtCLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDL0IseUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDOUIsMkJBQW1CLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDaEMsNEJBQW9CLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDakMsMkJBQW1CLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDbEMsQ0FBQyxDQUFDO0FBUFcsUUFBQSxzQkFBc0IsMEJBT2pDO0FBR0ssTUFBTSwrQkFBK0IsR0FBRyxDQUM3QyxXQUFXLEdBQUcsbUJBQW1CLEVBQ2pDLEVBQUU7SUFDRiwyQkFBbUIsQ0FBQyxpQkFBaUIsQ0FBQztRQUNwQyxFQUFFLEVBQUUsV0FBVztRQUNmLElBQUksRUFBRSx1QkFBdUI7UUFDN0IsS0FBSyxFQUFFLFNBQVM7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsMEJBQWtCLENBQUMsaUJBQWlCLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUMxRCxDQUFDLENBQUM7QUFUVyxRQUFBLCtCQUErQixtQ0FTMUM7QUFHSyxNQUFNLDJCQUEyQixHQUFHLENBQ3pDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyw4QkFBOEIsQ0FBQyxFQUNqRCxFQUFFO0lBQ0YsMkJBQW1CLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFDO0FBSlcsUUFBQSwyQkFBMkIsK0JBSXRDIn0=