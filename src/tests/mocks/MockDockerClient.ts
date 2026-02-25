export const mockCreateContainer = jest.fn();
export const mockStartContainer = jest.fn();
export const mockStopContainer = jest.fn();
export const mockRemoveContainer = jest.fn();
export const mockGetContainerLogs = jest.fn();
export const mockExecInContainer = jest.fn();

export const MockDockerClient = {
  createContainer: mockCreateContainer,
  startContainer: mockStartContainer,
  stopContainer: mockStopContainer,
  removeContainer: mockRemoveContainer,
  getContainerLogs: mockGetContainerLogs,
  execInContainer: mockExecInContainer,
};

export const resetDockerClientMocks = () => {
  mockCreateContainer.mockReset();
  mockStartContainer.mockReset();
  mockStopContainer.mockReset();
  mockRemoveContainer.mockReset();
  mockGetContainerLogs.mockReset();
  mockExecInContainer.mockReset();
};

// Helper pour simuler une création réussie
export const mockSuccessfulContainerCreation = (
  containerId = "container-abc-123"
) => {
  mockCreateContainer.mockResolvedValue({
    id: containerId,
    name: "minecraft-server-test",
    state: "created",
  });
  mockStartContainer.mockResolvedValue({ success: true });
};

// Helper pour simuler une erreur Docker
export const mockFailedContainerCreation = (
  error = new Error("Docker daemon not responding")
) => {
  mockCreateContainer.mockRejectedValue(error);
};
