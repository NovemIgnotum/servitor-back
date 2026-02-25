export const mockArkCreateContainer = jest.fn();
export const mockArkStartContainer = jest.fn();
export const mockArkStopContainer = jest.fn();
export const mockArkRemoveContainer = jest.fn();

export const MockArkHandler = jest.fn().mockImplementation(() => ({
  createContainer: mockArkCreateContainer,
  startContainer: mockArkStartContainer,
  stopContainer: mockArkStopContainer,
  removeContainer: mockArkRemoveContainer,
}));

export const resetArkHandlerMocks = () => {
  mockArkCreateContainer.mockReset();
  mockArkStartContainer.mockReset();
  mockArkStopContainer.mockReset();
  mockArkRemoveContainer.mockReset();
};

// Helpers
export const mockSuccessfulArkContainerCreation = (
  containerId = "ark-container-123"
) => {
  mockArkCreateContainer.mockResolvedValue({
    containerId,
    rconPassword: "rcon-pass-ark",
  });
};
