"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockServer = exports.resetServerModelMocks = exports.MockServerModel = exports.mockSave = exports.mockFindByIdAndDelete = exports.mockFindByIdAndUpdate = exports.mockCreate = exports.mockFind = exports.mockFindById = void 0;
exports.mockFindById = jest.fn();
exports.mockFind = jest.fn();
exports.mockCreate = jest.fn();
exports.mockFindByIdAndUpdate = jest.fn();
exports.mockFindByIdAndDelete = jest.fn();
exports.mockSave = jest.fn();
exports.MockServerModel = {
    findById: exports.mockFindById,
    find: exports.mockFind,
    create: exports.mockCreate,
    findByIdAndUpdate: exports.mockFindByIdAndUpdate,
    findByIdAndDelete: exports.mockFindByIdAndDelete,
};
const resetServerModelMocks = () => {
    exports.mockFindById.mockReset();
    exports.mockFind.mockReset();
    exports.mockCreate.mockReset();
    exports.mockFindByIdAndUpdate.mockReset();
    exports.mockFindByIdAndDelete.mockReset();
    exports.mockSave.mockReset();
};
exports.resetServerModelMocks = resetServerModelMocks;
const createMockServer = (overrides = {}) => (Object.assign({ _id: "mock-server-id-123", name: "Test Server", game: "minecraft", version: "1.20.1", status: "running", containerId: "mock-container-abc", owner: "mock-user-id", rconPassword: "test-rcon-pass", save: exports.mockSave.mockResolvedValue(this) }, overrides));
exports.createMockServer = createMockServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2VydmVyTW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvbW9ja3MvU2VydmVyTW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQWEsUUFBQSxZQUFZLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3pCLFFBQUEsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNyQixRQUFBLFVBQVUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDdkIsUUFBQSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbEMsUUFBQSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDbEMsUUFBQSxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBRXJCLFFBQUEsZUFBZSxHQUFHO0lBQzdCLFFBQVEsRUFBRSxvQkFBWTtJQUN0QixJQUFJLEVBQUUsZ0JBQVE7SUFDZCxNQUFNLEVBQUUsa0JBQVU7SUFDbEIsaUJBQWlCLEVBQUUsNkJBQXFCO0lBQ3hDLGlCQUFpQixFQUFFLDZCQUFxQjtDQUNsQyxDQUFDO0FBRUYsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLEVBQUU7SUFDeEMsb0JBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN6QixnQkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLGtCQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDdkIsNkJBQXFCLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEMsNkJBQXFCLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEMsZ0JBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUN2QixDQUFDLENBQUM7QUFQVyxRQUFBLHFCQUFxQix5QkFPaEM7QUFHSyxNQUFNLGdCQUFnQixHQUFHLENBQUMsU0FBUyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsaUJBQ2xELEdBQUcsRUFBRSxvQkFBb0IsRUFDekIsSUFBSSxFQUFFLGFBQWEsRUFDbkIsSUFBSSxFQUFFLFdBQVcsRUFDakIsT0FBTyxFQUFFLFFBQVEsRUFDakIsTUFBTSxFQUFFLFNBQVMsRUFDakIsV0FBVyxFQUFFLG9CQUFvQixFQUNqQyxLQUFLLEVBQUUsY0FBYyxFQUNyQixZQUFZLEVBQUUsZ0JBQWdCLEVBQzlCLElBQUksRUFBRSxnQkFBUSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUNuQyxTQUFTLEVBQ1osQ0FBQztBQVhVLFFBQUEsZ0JBQWdCLG9CQVcxQiJ9