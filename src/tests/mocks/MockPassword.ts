export const mockHashPassword = jest.fn();
export const mockVerifyPassword = jest.fn();

export const MockPassword = {
  hashPassword: mockHashPassword,
  verifyPassword: mockVerifyPassword,
};

export const resetPasswordMocks = () => {
  mockHashPassword.mockReset();
  mockVerifyPassword.mockReset();
};

// Helpers pour configurer des réponses par défaut
export const mockSuccessfulHash = (hashedValue = "hashed-password-123") => {
  mockHashPassword.mockResolvedValue(hashedValue);
};

export const mockSuccessfulVerify = (isValid = true) => {
  mockVerifyPassword.mockResolvedValue(isValid);
};

export const mockFailedVerify = () => {
  mockVerifyPassword.mockResolvedValue(false);
};
