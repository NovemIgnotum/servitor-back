export const mockSuccess = jest.fn();
export const mockError = jest.fn();
export const mockInfo = jest.fn();
export const mockWarning = jest.fn();

export const MockRetour = {
  success: mockSuccess,
  error: mockError,
  info: mockInfo,
  warning: mockWarning,
};

export const resetRetourMocks = () => {
  mockSuccess.mockReset();
  mockError.mockReset();
  mockInfo.mockReset();
  mockWarning.mockReset();
};
