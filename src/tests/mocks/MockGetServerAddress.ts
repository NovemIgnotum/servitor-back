export const mockGetGameServerAddress = jest.fn();

export const resetGetServerAddressMock = () => {
  mockGetGameServerAddress.mockReset();
};

// Helper
export const mockSuccessfulAddress = (address = "192.168.1.100:25565") => {
  mockGetGameServerAddress.mockResolvedValue({ address });
};
