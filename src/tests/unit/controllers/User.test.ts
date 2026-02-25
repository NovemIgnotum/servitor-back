import {
  MockUserModel,
  mockUserFindById,
  mockUserFind,
  mockUserFindOne,
  mockUserFindByIdAndUpdate,
  mockUserFindByIdAndDelete,
  mockUserSave,
  resetUserModelMocks,
} from "../../mocks/MockUserModel";

import {
  MockPassword,
  mockHashPassword,
  mockVerifyPassword,
  resetPasswordMocks,
  mockSuccessfulHash,
  mockSuccessfulVerify,
  mockFailedVerify,
} from "../../mocks/MockPassword";

import {
  MockRetour,
  mockSuccess,
  mockError,
  resetRetourMocks,
} from "../../mocks/MockRetour";

import {
  validUserPayload,
  validLoginPayload,
  invalidLoginPayload,
  mockUser,
  mockUserWithServers,
  updateUserPayload,
  updatePasswordPayload,
  userList,
} from "../../fixtures/UserFixtures";

// Mocks globaux
jest.mock("../../../src/models/User", () => ({
  __esModule: true,
  default: MockUserModel,
}));

jest.mock("../../../src/library/Password", () => ({
  __esModule: true,
  hashPassword: mockHashPassword,
  verifyPassword: mockVerifyPassword,
}));

jest.mock("../../../src/library/Retour", () => ({
  __esModule: true,
  default: MockRetour,
}));

// Import après les mocks
import UserController from "../../../controllers/User";

function createMockRequest(body?: any, params?: any): any {
  const req: any = {};
  req.body = body || {};
  req.params = params || {};
  return req;
}

function createMockResponse(): any {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

describe("UserController", () => {
  beforeEach(() => {
    resetUserModelMocks();
    resetPasswordMocks();
    resetRetourMocks();
  });

  describe("createUser", () => {
    it("devrait créer un utilisateur avec succès", async () => {
      // Arrange
      mockUserFindOne.mockResolvedValue(null); // Aucun utilisateur existant
      mockSuccessfulHash("hashed-password-123");
      mockUserSave.mockResolvedValue(mockUser);

      const req = createMockRequest(validUserPayload);
      const res = createMockResponse();

      // Act
      await UserController.createUser(req, res);

      // Assert
      expect(mockUserFindOne).toHaveBeenCalledWith({
        email: validUserPayload.email,
      });
      expect(mockHashPassword).toHaveBeenCalledWith(validUserPayload.password);
      expect(MockUserModel).toHaveBeenCalledWith({
        email: validUserPayload.email,
        password: "hashed-password-123",
      });
      expect(mockUserSave).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User created successfully",
      });
      expect(mockSuccess).toHaveBeenCalledWith("User created successfully");
    });

    it("devrait rejeter si email ou password manquant", async () => {
      // Arrange
      const req = createMockRequest({ email: "test@example.com" }); // password manquant
      const res = createMockResponse();

      // Act
      await UserController.createUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
      expect(mockError).toHaveBeenCalledWith("Email and password are required");
      expect(mockUserFindOne).not.toHaveBeenCalled();
    });

    it("devrait rejeter si l'utilisateur existe déjà", async () => {
      // Arrange
      mockUserFindOne.mockResolvedValue(mockUser); // Utilisateur existe

      const req = createMockRequest(validUserPayload);
      const res = createMockResponse();

      // Act
      await UserController.createUser(req, res);

      // Assert
      expect(mockUserFindOne).toHaveBeenCalledWith({
        email: validUserPayload.email,
      });
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
      expect(mockError).toHaveBeenCalledWith("User already exists");
      expect(mockHashPassword).not.toHaveBeenCalled();
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockUserFindOne.mockRejectedValue(new Error("Database error"));

      const req = createMockRequest(validUserPayload);
      const res = createMockResponse();

      // Act
      await UserController.createUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(mockError).toHaveBeenCalledWith("Error while creating user");
    });
  });

  describe("loginUser", () => {
    it("devrait connecter un utilisateur avec succès", async () => {
      // Arrange
      mockUserFindOne.mockResolvedValue(mockUser);
      mockSuccessfulVerify(true);

      const req = createMockRequest(validLoginPayload);
      const res = createMockResponse();

      // Act
      await UserController.loginUser(req, res);

      // Assert
      expect(mockUserFindOne).toHaveBeenCalledWith({
        email: validLoginPayload.email,
      });
      expect(mockVerifyPassword).toHaveBeenCalledWith(
        mockUser.password,
        validLoginPayload.password
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User logged in successfully",
        userId: mockUser._id,
      });
      expect(mockSuccess).toHaveBeenCalledWith("User logged in successfully");
    });

    it("devrait rejeter si email ou password manquant", async () => {
      // Arrange
      const req = createMockRequest({ email: "test@example.com" });
      const res = createMockResponse();

      // Act
      await UserController.loginUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email and password are required",
      });
      expect(mockUserFindOne).not.toHaveBeenCalled();
    });

    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
      // Arrange
      mockUserFindOne.mockResolvedValue(null);

      const req = createMockRequest(validLoginPayload);
      const res = createMockResponse();

      // Act
      await UserController.loginUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
      expect(mockError).toHaveBeenCalledWith("Invalid email or password");
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("devrait rejeter si le mot de passe est incorrect", async () => {
      // Arrange
      mockUserFindOne.mockResolvedValue(mockUser);
      mockFailedVerify();

      const req = createMockRequest(invalidLoginPayload);
      const res = createMockResponse();

      // Act
      await UserController.loginUser(req, res);

      // Assert
      expect(mockVerifyPassword).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Invalid email or password",
      });
      expect(mockError).toHaveBeenCalledWith("Invalid email or password");
    });

    it("devrait gérer les erreurs inattendues", async () => {
      // Arrange
      mockUserFindOne.mockRejectedValue(new Error("Database connection lost"));

      const req = createMockRequest(validLoginPayload);
      const res = createMockResponse();

      // Act
      await UserController.loginUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("readOneUser", () => {
    it("devrait retourner un utilisateur par ID", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);

      const req = createMockRequest({}, { userId: mockUser._id });
      const res = createMockResponse();

      // Act
      await UserController.readOneUser(req, res);

      // Assert
      expect(mockUserFindById).toHaveBeenCalledWith(mockUser._id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User fetched successfully",
        user: mockUser,
      });
      expect(mockSuccess).toHaveBeenCalledWith("User fetched successfully");
    });

    it("devrait retourner 404 si l'utilisateur n'existe pas", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(null);

      const req = createMockRequest({}, { userId: "nonexistent-id" });
      const res = createMockResponse();

      // Act
      await UserController.readOneUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
      expect(mockError).toHaveBeenCalledWith("User not found");
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockUserFindById.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest({}, { userId: "user-123" });
      const res = createMockResponse();

      // Act
      await UserController.readOneUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("readAllUsers", () => {
    it("devrait retourner tous les utilisateurs", async () => {
      // Arrange
      mockUserFind.mockResolvedValue(userList);

      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      await UserController.readAllUsers(req, res);

      // Assert
      expect(mockUserFind).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Users fetched successfully",
        users: userList,
      });
      expect(mockSuccess).toHaveBeenCalledWith("Users fetched successfully");
    });

    it("devrait retourner un tableau vide si aucun utilisateur", async () => {
      // Arrange
      mockUserFind.mockResolvedValue([]);

      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      await UserController.readAllUsers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Users fetched successfully",
        users: [],
      });
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockUserFind.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest();
      const res = createMockResponse();

      // Act
      await UserController.readAllUsers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("updateUser", () => {
    it("devrait mettre à jour l'email de l'utilisateur", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);
      mockUserFindOne.mockResolvedValue(null); // Email pas utilisé
      mockUserFindByIdAndUpdate.mockResolvedValue(null);

      const updatedUser = { ...mockUser, email: updateUserPayload.email };
      mockUserFindById
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedUser);

      const req = createMockRequest(updateUserPayload, {
        userId: mockUser._id,
      });
      const res = createMockResponse();

      // Act
      await UserController.updateUser(req, res);

      // Assert
      expect(mockUserFindById).toHaveBeenCalledWith(mockUser._id);
      expect(mockUserFindOne).toHaveBeenCalledWith({
        email: updateUserPayload.email,
      });
      expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, {
        email: updateUserPayload.email,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User updated successfully",
        user: updatedUser,
      });
    });

    it("devrait rejeter si le nouvel email est déjà utilisé", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);
      mockUserFindOne.mockResolvedValue({
        _id: "other-user-id",
        email: updateUserPayload.email,
      });

      const req = createMockRequest(updateUserPayload, {
        userId: mockUser._id,
      });
      const res = createMockResponse();

      // Act
      await UserController.updateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email already in use",
      });
      expect(mockError).toHaveBeenCalledWith("Email already in use");
      expect(mockUserFindByIdAndUpdate).not.toHaveBeenCalled();
    });

    it("devrait mettre à jour le mot de passe avec l'ancien mot de passe correct", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);
      mockSuccessfulVerify(true); // Ancien mot de passe correct
      mockSuccessfulHash("new-hashed-password");
      mockUserFindByIdAndUpdate.mockResolvedValue(null);

      const updatedUser = { ...mockUser, password: "new-hashed-password" };
      mockUserFindById
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(updatedUser);

      const req = createMockRequest(updatePasswordPayload, {
        userId: mockUser._id,
      });
      const res = createMockResponse();

      // Act
      await UserController.updateUser(req, res);

      // Assert
      expect(mockVerifyPassword).toHaveBeenCalledWith(
        mockUser.password,
        updatePasswordPayload.oldPassword
      );
      expect(mockHashPassword).toHaveBeenCalledWith(
        updatePasswordPayload.password
      );
      expect(mockUserFindByIdAndUpdate).toHaveBeenCalledWith(mockUser._id, {
        password: "new-hashed-password",
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("devrait rejeter si oldPassword manquant pour changer le mot de passe", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);

      const req = createMockRequest(
        { password: "NewPassword123!" },
        { userId: mockUser._id }
      );
      const res = createMockResponse();

      // Act
      await UserController.updateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Old password is required to set a new password",
      });
      expect(mockVerifyPassword).not.toHaveBeenCalled();
    });

    it("devrait rejeter si oldPassword est incorrect", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);
      mockFailedVerify();

      const req = createMockRequest(updatePasswordPayload, {
        userId: mockUser._id,
      });
      const res = createMockResponse();

      // Act
      await UserController.updateUser(req, res);

      // Assert
      expect(mockVerifyPassword).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Old password is incorrect",
      });
      expect(mockHashPassword).not.toHaveBeenCalled();
    });

    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(null);

      const req = createMockRequest(updateUserPayload, {
        userId: "nonexistent-id",
      });
      const res = createMockResponse();

      // Act
      await UserController.updateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockUserFindById.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest(updateUserPayload, { userId: "user-123" });
      const res = createMockResponse();

      // Act
      await UserController.updateUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });

  describe("deleteUser", () => {
    it("devrait supprimer un utilisateur avec succès", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);
      mockUserFindByIdAndDelete.mockResolvedValue(mockUser);

      const req = createMockRequest({}, { userId: mockUser._id });
      const res = createMockResponse();

      // Act
      await UserController.deleteUser(req, res);

      // Assert
      expect(mockUserFindById).toHaveBeenCalledWith(mockUser._id);
      expect(mockUserFindByIdAndDelete).toHaveBeenCalledWith(mockUser._id);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
      expect(mockSuccess).toHaveBeenCalledWith("User deleted successfully");
    });

    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(null);

      const req = createMockRequest({}, { userId: "nonexistent-id" });
      const res = createMockResponse();

      // Act
      await UserController.deleteUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "User not found",
      });
      expect(mockUserFindByIdAndDelete).not.toHaveBeenCalled();
    });

    it("devrait gérer les erreurs de base de données", async () => {
      // Arrange
      mockUserFindById.mockResolvedValue(mockUser);
      mockUserFindByIdAndDelete.mockRejectedValue(new Error("DB error"));

      const req = createMockRequest({}, { userId: mockUser._id });
      const res = createMockResponse();

      // Act
      await UserController.deleteUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });
    });
  });
});
