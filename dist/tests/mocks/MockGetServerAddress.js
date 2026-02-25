"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockSuccessfulAddress = exports.resetGetServerAddressMock = exports.mockGetGameServerAddress = void 0;
exports.mockGetGameServerAddress = jest.fn();
const resetGetServerAddressMock = () => {
    exports.mockGetGameServerAddress.mockReset();
};
exports.resetGetServerAddressMock = resetGetServerAddressMock;
const mockSuccessfulAddress = (address = '192.168.1.100:25565') => {
    exports.mockGetGameServerAddress.mockResolvedValue({ address });
};
exports.mockSuccessfulAddress = mockSuccessfulAddress;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja0dldFNlcnZlckFkZHJlc3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvbW9ja3MvTW9ja0dldFNlcnZlckFkZHJlc3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFFM0MsTUFBTSx5QkFBeUIsR0FBRyxHQUFHLEVBQUU7SUFDNUMsZ0NBQXdCLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDdkMsQ0FBQyxDQUFDO0FBRlcsUUFBQSx5QkFBeUIsNkJBRXBDO0FBR0ssTUFBTSxxQkFBcUIsR0FBRyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsRUFBRSxFQUFFO0lBQ3ZFLGdDQUF3QixDQUFDLGlCQUFpQixDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUMxRCxDQUFDLENBQUM7QUFGVyxRQUFBLHFCQUFxQix5QkFFaEMifQ==