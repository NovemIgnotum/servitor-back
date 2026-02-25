export const mockUserFindById = jest.fn();
export const mockUserFind = jest.fn();
export const mockUserFindOne = jest.fn();
export const mockUserCreate = jest.fn();
export const mockUserFindByIdAndUpdate = jest.fn();
export const mockUserFindByIdAndDelete = jest.fn();
export const mockUserSave = jest.fn();

export const MockUserModel: any = jest.fn().mockImplementation((data) => ({
  ...data,
  save: mockUserSave,
}));

MockUserModel.findById = mockUserFindById;
MockUserModel.find = mockUserFind;
MockUserModel.findOne = mockUserFindOne;
MockUserModel.create = mockUserCreate;
MockUserModel.findByIdAndUpdate = mockUserFindByIdAndUpdate;
MockUserModel.findByIdAndDelete = mockUserFindByIdAndDelete;

export const resetUserModelMocks = () => {
  mockUserFindById.mockReset();
  mockUserFind.mockReset();
  mockUserFindOne.mockReset();
  mockUserCreate.mockReset();
  mockUserFindByIdAndUpdate.mockReset();
  mockUserFindByIdAndDelete.mockReset();
  mockUserSave.mockReset();
};

// Helper pour créer un faux utilisateur
export const createMockUser = (overrides = {}) => ({
  _id: "user-456",
  email: "test@example.com",
  password: "password123",
  servers: [],
  ...overrides,
});
