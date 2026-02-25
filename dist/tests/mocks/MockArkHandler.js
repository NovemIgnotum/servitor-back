"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockSuccessfulArkContainerCreation = exports.resetArkHandlerMocks = exports.MockArkHandler = exports.mockArkRemoveContainer = exports.mockArkStopContainer = exports.mockArkStartContainer = exports.mockArkCreateContainer = void 0;
exports.mockArkCreateContainer = jest.fn();
exports.mockArkStartContainer = jest.fn();
exports.mockArkStopContainer = jest.fn();
exports.mockArkRemoveContainer = jest.fn();
exports.MockArkHandler = jest.fn().mockImplementation(() => ({
    createContainer: exports.mockArkCreateContainer,
    startContainer: exports.mockArkStartContainer,
    stopContainer: exports.mockArkStopContainer,
    removeContainer: exports.mockArkRemoveContainer,
}));
const resetArkHandlerMocks = () => {
    exports.mockArkCreateContainer.mockReset();
    exports.mockArkStartContainer.mockReset();
    exports.mockArkStopContainer.mockReset();
    exports.mockArkRemoveContainer.mockReset();
};
exports.resetArkHandlerMocks = resetArkHandlerMocks;
const mockSuccessfulArkContainerCreation = (containerId = 'ark-container-123') => {
    exports.mockArkCreateContainer.mockResolvedValue({
        containerId,
        rconPassword: 'rcon-pass-ark',
    });
};
exports.mockSuccessfulArkContainerCreation = mockSuccessfulArkContainerCreation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja0Fya0hhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvbW9ja3MvTW9ja0Fya0hhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbkMsUUFBQSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbEMsUUFBQSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDakMsUUFBQSxzQkFBc0IsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFFbkMsUUFBQSxjQUFjLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEUsZUFBZSxFQUFFLDhCQUFzQjtJQUN2QyxjQUFjLEVBQUUsNkJBQXFCO0lBQ3JDLGFBQWEsRUFBRSw0QkFBb0I7SUFDbkMsZUFBZSxFQUFFLDhCQUFzQjtDQUN4QyxDQUFDLENBQUMsQ0FBQztBQUVHLE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxFQUFFO0lBQ3ZDLDhCQUFzQixDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25DLDZCQUFxQixDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2xDLDRCQUFvQixDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ2pDLDhCQUFzQixDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUxXLFFBQUEsb0JBQW9CLHdCQUsvQjtBQUdLLE1BQU0sa0NBQWtDLEdBQUcsQ0FDaEQsV0FBVyxHQUFHLG1CQUFtQixFQUNqQyxFQUFFO0lBQ0YsOEJBQXNCLENBQUMsaUJBQWlCLENBQUM7UUFDdkMsV0FBVztRQUNYLFlBQVksRUFBRSxlQUFlO0tBQzlCLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQVBXLFFBQUEsa0NBQWtDLHNDQU83QyJ9