export const mockGetStats = jest.fn();
export const mockGetPlayerInfo = jest.fn();
export const mockExecuteCommande = jest.fn();
export const mockStartContainer = jest.fn();
export const mockStopContainer = jest.fn();
export const mockCreateContainer = jest.fn();
export const mockRemoveContainer = jest.fn();

export const MockMinecraftHandler = jest.fn().mockImplementation(() => ({
  getStats: mockGetStats,
  getPlayerInfo: mockGetPlayerInfo,
  executeCommande: mockExecuteCommande,
  startContainer: mockStartContainer,
  stopContainer: mockStopContainer,
  createContainer: mockCreateContainer,
  removeContainer: mockRemoveContainer,
}));

export const resetMinecraftHandlerMocks = () => {
  mockGetStats.mockReset();
  mockGetPlayerInfo.mockReset();
  mockExecuteCommande.mockReset();
  mockStartContainer.mockReset();
  mockStopContainer.mockReset();
  mockCreateContainer.mockReset();
  mockRemoveContainer.mockReset();
};

export const mockSuccessfulStats = () => {
  mockGetStats.mockResolvedValue({
    cpuPercent: 25,
    memoryUsage: 512,
    memoryLimit: 2048,
    memoryPercent: 25,
  });
};

export const mockSuccessfulPlayerInfo = (
  count = 2,
  players = ["Alice", "Bob"]
) => {
  mockGetPlayerInfo.mockResolvedValue({
    count,
    players,
  });
};

export const mockFailedStats = (
  error = new Error("Docker container not found")
) => {
  mockGetStats.mockRejectedValue(error);
};
