"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MockUserModel_1 = require("../../mocks/MockUserModel");
const MockPassword_1 = require("../../mocks/MockPassword");
const MockRetour_1 = require("../../mocks/MockRetour");
const UserFixtures_1 = require("../../fixtures/UserFixtures");
jest.mock('../../../src/models/User', () => ({
    __esModule: true,
    default: MockUserModel_1.MockUserModel,
}));
jest.mock('../../../src/library/Password', () => ({
    __esModule: true,
    hashPassword: MockPassword_1.mockHashPassword,
    verifyPassword: MockPassword_1.mockVerifyPassword,
}));
jest.mock('../../../src/library/Retour', () => ({
    __esModule: true,
    default: MockRetour_1.MockRetour,
}));
const User_1 = __importDefault(require("../../../controllers/User"));
describe('UserController', () => {
    const createMockRequest = (body = {}, params = {}) => ({
        body,
        params,
    });
    const createMockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    beforeEach(() => {
        (0, MockUserModel_1.resetUserModelMocks)();
        (0, MockPassword_1.resetPasswordMocks)();
        (0, MockRetour_1.resetRetourMocks)();
    });
    describe('createUser', () => {
        it('devrait créer un utilisateur avec succès', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindOne.mockResolvedValue(null);
            (0, MockPassword_1.mockSuccessfulHash)('hashed-password-123');
            MockUserModel_1.mockUserSave.mockResolvedValue(UserFixtures_1.mockUser);
            const req = createMockRequest(UserFixtures_1.validUserPayload);
            const res = createMockResponse();
            yield User_1.default.createUser(req, res);
            expect(MockUserModel_1.mockUserFindOne).toHaveBeenCalledWith({ email: UserFixtures_1.validUserPayload.email });
            expect(MockPassword_1.mockHashPassword).toHaveBeenCalledWith(UserFixtures_1.validUserPayload.password);
            expect(MockUserModel_1.MockUserModel).toHaveBeenCalledWith({
                email: UserFixtures_1.validUserPayload.email,
                password: 'hashed-password-123',
            });
            expect(MockUserModel_1.mockUserSave).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User created successfully',
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('User created successfully');
        }));
        it('devrait rejeter si email ou password manquant', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = createMockRequest({ email: 'test@example.com' });
            const res = createMockResponse();
            yield User_1.default.createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Email and password are required',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('Email and password are required');
            expect(MockUserModel_1.mockUserFindOne).not.toHaveBeenCalled();
        }));
        it('devrait rejeter si l\'utilisateur existe déjà', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindOne.mockResolvedValue(UserFixtures_1.mockUser);
            const req = createMockRequest(UserFixtures_1.validUserPayload);
            const res = createMockResponse();
            yield User_1.default.createUser(req, res);
            expect(MockUserModel_1.mockUserFindOne).toHaveBeenCalledWith({ email: UserFixtures_1.validUserPayload.email });
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User already exists',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('User already exists');
            expect(MockPassword_1.mockHashPassword).not.toHaveBeenCalled();
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindOne.mockRejectedValue(new Error('Database error'));
            const req = createMockRequest(UserFixtures_1.validUserPayload);
            const res = createMockResponse();
            yield User_1.default.createUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('Error while creating user');
        }));
    });
    describe('loginUser', () => {
        it('devrait connecter un utilisateur avec succès', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindOne.mockResolvedValue(UserFixtures_1.mockUser);
            (0, MockPassword_1.mockSuccessfulVerify)(true);
            const req = createMockRequest(UserFixtures_1.validLoginPayload);
            const res = createMockResponse();
            yield User_1.default.loginUser(req, res);
            expect(MockUserModel_1.mockUserFindOne).toHaveBeenCalledWith({ email: UserFixtures_1.validLoginPayload.email });
            expect(MockPassword_1.mockVerifyPassword).toHaveBeenCalledWith(UserFixtures_1.mockUser.password, UserFixtures_1.validLoginPayload.password);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User logged in successfully',
                userId: UserFixtures_1.mockUser._id,
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('User logged in successfully');
        }));
        it('devrait rejeter si email ou password manquant', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = createMockRequest({ email: 'test@example.com' });
            const res = createMockResponse();
            yield User_1.default.loginUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Email and password are required',
            });
            expect(MockUserModel_1.mockUserFindOne).not.toHaveBeenCalled();
        }));
        it('devrait rejeter si l\'utilisateur n\'existe pas', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindOne.mockResolvedValue(null);
            const req = createMockRequest(UserFixtures_1.validLoginPayload);
            const res = createMockResponse();
            yield User_1.default.loginUser(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid email or password',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('Invalid email or password');
            expect(MockPassword_1.mockVerifyPassword).not.toHaveBeenCalled();
        }));
        it('devrait rejeter si le mot de passe est incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindOne.mockResolvedValue(UserFixtures_1.mockUser);
            (0, MockPassword_1.mockFailedVerify)();
            const req = createMockRequest(UserFixtures_1.invalidLoginPayload);
            const res = createMockResponse();
            yield User_1.default.loginUser(req, res);
            expect(MockPassword_1.mockVerifyPassword).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid email or password',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('Invalid email or password');
        }));
        it('devrait gérer les erreurs inattendues', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindOne.mockRejectedValue(new Error('Database connection lost'));
            const req = createMockRequest(UserFixtures_1.validLoginPayload);
            const res = createMockResponse();
            yield User_1.default.loginUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
        }));
    });
    describe('readOneUser', () => {
        it('devrait retourner un utilisateur par ID', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            const req = createMockRequest({}, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.readOneUser(req, res);
            expect(MockUserModel_1.mockUserFindById).toHaveBeenCalledWith(UserFixtures_1.mockUser._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User fetched successfully',
                user: UserFixtures_1.mockUser,
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('User fetched successfully');
        }));
        it('devrait retourner 404 si l\'utilisateur n\'existe pas', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { userId: 'nonexistent-id' });
            const res = createMockResponse();
            yield User_1.default.readOneUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('User not found');
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest({}, { userId: 'user-123' });
            const res = createMockResponse();
            yield User_1.default.readOneUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
        }));
    });
    describe('readAllUsers', () => {
        it('devrait retourner tous les utilisateurs', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFind.mockResolvedValue(UserFixtures_1.userList);
            const req = createMockRequest();
            const res = createMockResponse();
            yield User_1.default.readAllUsers(req, res);
            expect(MockUserModel_1.mockUserFind).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Users fetched successfully',
                users: UserFixtures_1.userList,
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('Users fetched successfully');
        }));
        it('devrait retourner un tableau vide si aucun utilisateur', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFind.mockResolvedValue([]);
            const req = createMockRequest();
            const res = createMockResponse();
            yield User_1.default.readAllUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Users fetched successfully',
                users: [],
            });
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFind.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest();
            const res = createMockResponse();
            yield User_1.default.readAllUsers(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
        }));
    });
    describe('updateUser', () => {
        it('devrait mettre à jour l\'email de l\'utilisateur', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            MockUserModel_1.mockUserFindOne.mockResolvedValue(null);
            MockUserModel_1.mockUserFindByIdAndUpdate.mockResolvedValue(null);
            const updatedUser = Object.assign(Object.assign({}, UserFixtures_1.mockUser), { email: UserFixtures_1.updateUserPayload.email });
            MockUserModel_1.mockUserFindById.mockResolvedValueOnce(UserFixtures_1.mockUser).mockResolvedValueOnce(updatedUser);
            const req = createMockRequest(UserFixtures_1.updateUserPayload, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.updateUser(req, res);
            expect(MockUserModel_1.mockUserFindById).toHaveBeenCalledWith(UserFixtures_1.mockUser._id);
            expect(MockUserModel_1.mockUserFindOne).toHaveBeenCalledWith({ email: UserFixtures_1.updateUserPayload.email });
            expect(MockUserModel_1.mockUserFindByIdAndUpdate).toHaveBeenCalledWith(UserFixtures_1.mockUser._id, {
                email: UserFixtures_1.updateUserPayload.email,
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User updated successfully',
                user: updatedUser,
            });
        }));
        it('devrait rejeter si le nouvel email est déjà utilisé', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            MockUserModel_1.mockUserFindOne.mockResolvedValue({ _id: 'other-user-id', email: UserFixtures_1.updateUserPayload.email });
            const req = createMockRequest(UserFixtures_1.updateUserPayload, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Email already in use',
            });
            expect(MockRetour_1.mockError).toHaveBeenCalledWith('Email already in use');
            expect(MockUserModel_1.mockUserFindByIdAndUpdate).not.toHaveBeenCalled();
        }));
        it('devrait mettre à jour le mot de passe avec l\'ancien mot de passe correct', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            (0, MockPassword_1.mockSuccessfulVerify)(true);
            (0, MockPassword_1.mockSuccessfulHash)('new-hashed-password');
            MockUserModel_1.mockUserFindByIdAndUpdate.mockResolvedValue(null);
            const updatedUser = Object.assign(Object.assign({}, UserFixtures_1.mockUser), { password: 'new-hashed-password' });
            MockUserModel_1.mockUserFindById.mockResolvedValueOnce(UserFixtures_1.mockUser).mockResolvedValueOnce(updatedUser);
            const req = createMockRequest(UserFixtures_1.updatePasswordPayload, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.updateUser(req, res);
            expect(MockPassword_1.mockVerifyPassword).toHaveBeenCalledWith(UserFixtures_1.mockUser.password, UserFixtures_1.updatePasswordPayload.oldPassword);
            expect(MockPassword_1.mockHashPassword).toHaveBeenCalledWith(UserFixtures_1.updatePasswordPayload.password);
            expect(MockUserModel_1.mockUserFindByIdAndUpdate).toHaveBeenCalledWith(UserFixtures_1.mockUser._id, {
                password: 'new-hashed-password',
            });
            expect(res.status).toHaveBeenCalledWith(200);
        }));
        it('devrait rejeter si oldPassword manquant pour changer le mot de passe', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            const req = createMockRequest({ password: 'NewPassword123!' }, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Old password is required to set a new password',
            });
            expect(MockPassword_1.mockVerifyPassword).not.toHaveBeenCalled();
        }));
        it('devrait rejeter si oldPassword est incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            (0, MockPassword_1.mockFailedVerify)();
            const req = createMockRequest(UserFixtures_1.updatePasswordPayload, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.updateUser(req, res);
            expect(MockPassword_1.mockVerifyPassword).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Old password is incorrect',
            });
            expect(MockPassword_1.mockHashPassword).not.toHaveBeenCalled();
        }));
        it('devrait rejeter si l\'utilisateur n\'existe pas', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(null);
            const req = createMockRequest(UserFixtures_1.updateUserPayload, { userId: 'nonexistent-id' });
            const res = createMockResponse();
            yield User_1.default.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found',
            });
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest(UserFixtures_1.updateUserPayload, { userId: 'user-123' });
            const res = createMockResponse();
            yield User_1.default.updateUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
        }));
    });
    describe('deleteUser', () => {
        it('devrait supprimer un utilisateur avec succès', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            MockUserModel_1.mockUserFindByIdAndDelete.mockResolvedValue(UserFixtures_1.mockUser);
            const req = createMockRequest({}, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.deleteUser(req, res);
            expect(MockUserModel_1.mockUserFindById).toHaveBeenCalledWith(UserFixtures_1.mockUser._id);
            expect(MockUserModel_1.mockUserFindByIdAndDelete).toHaveBeenCalledWith(UserFixtures_1.mockUser._id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User deleted successfully',
            });
            expect(MockRetour_1.mockSuccess).toHaveBeenCalledWith('User deleted successfully');
        }));
        it('devrait rejeter si l\'utilisateur n\'existe pas', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(null);
            const req = createMockRequest({}, { userId: 'nonexistent-id' });
            const res = createMockResponse();
            yield User_1.default.deleteUser(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User not found',
            });
            expect(MockUserModel_1.mockUserFindByIdAndDelete).not.toHaveBeenCalled();
        }));
        it('devrait gérer les erreurs de base de données', () => __awaiter(void 0, void 0, void 0, function* () {
            MockUserModel_1.mockUserFindById.mockResolvedValue(UserFixtures_1.mockUser);
            MockUserModel_1.mockUserFindByIdAndDelete.mockRejectedValue(new Error('DB error'));
            const req = createMockRequest({}, { userId: UserFixtures_1.mockUser._id });
            const res = createMockResponse();
            yield User_1.default.deleteUser(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal server error',
            });
        }));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3Rlc3RzL3VuaXQvY29udHJvbGxlcnMvVXNlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBU21DO0FBRW5DLDJEQVFrQztBQUVsQyx1REFLZ0M7QUFFaEMsOERBU3FDO0FBR3JDLElBQUksQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzQyxVQUFVLEVBQUUsSUFBSTtJQUNoQixPQUFPLEVBQUUsNkJBQWE7Q0FDdkIsQ0FBQyxDQUFDLENBQUM7QUFFSixJQUFJLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsVUFBVSxFQUFFLElBQUk7SUFDaEIsWUFBWSxFQUFFLCtCQUFnQjtJQUM5QixjQUFjLEVBQUUsaUNBQWtCO0NBQ25DLENBQUMsQ0FBQyxDQUFDO0FBRUosSUFBSSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzlDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLE9BQU8sRUFBRSx1QkFBVTtDQUNwQixDQUFDLENBQUMsQ0FBQztBQUdKLHFFQUF1RDtBQUV2RCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckQsSUFBSTtRQUNKLE1BQU07S0FDQyxDQUFBLENBQUM7SUFFVixNQUFNLGtCQUFrQixHQUFHLEdBQUcsRUFBRTtRQUM5QixNQUFNLEdBQUcsR0FBUSxFQUFFLENBQUM7UUFDcEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFD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