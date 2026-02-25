export const mockFindById = jest.fn();
export const mockFind = jest.fn();
export const mockFindOne = jest.fn();
export const mockCreate = jest.fn();
export const mockFindByIdAndUpdate = jest.fn();
export const mockFindByIdAndDelete = jest.fn();
export const mockSave = jest.fn();

export const MockServerModel: any = jest.fn().mockImplementation((data) => ({
  ...data,
  _id: data._id || "mock-server-id-123",
  save: mockSave,
  operators: data.operators || [],
}));

MockServerModel.findById = mockFindById;
MockServerModel.find = mockFind;
MockServerModel.findOne = mockFindOne;
MockServerModel.create = mockCreate;
MockServerModel.findByIdAndUpdate = mockFindByIdAndUpdate;
MockServerModel.findByIdAndDelete = mockFindByIdAndDelete;

export const resetServerModelMocks = () => {
  mockFindById.mockReset();
  mockFind.mockReset();
  mockFindOne.mockReset();
  mockCreate.mockReset();
  mockFindByIdAndUpdate.mockReset();
  mockFindByIdAndDelete.mockReset();
  mockSave.mockReset();
};

// Helper pour créer un faux document serveur
export const createMockServer = (overrides = {}) => ({
  _id: "mock-server-id-123",
  name: "Test Server",
  game: "minecraft",
  version: "1.20.1",
  status: "running",
  containerId: "mock-container-abc",
  owner: "mock-user-id",
  rconPassword: "test-rcon-pass",
  save: mockSave.mockResolvedValue(this),
  ...overrides,
});
