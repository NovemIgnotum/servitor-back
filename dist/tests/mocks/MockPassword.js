"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockFailedVerify = exports.mockSuccessfulVerify = exports.mockSuccessfulHash = exports.resetPasswordMocks = exports.MockPassword = exports.mockVerifyPassword = exports.mockHashPassword = void 0;
exports.mockHashPassword = jest.fn();
exports.mockVerifyPassword = jest.fn();
exports.MockPassword = {
    hashPassword: exports.mockHashPassword,
    verifyPassword: exports.mockVerifyPassword,
};
const resetPasswordMocks = () => {
    exports.mockHashPassword.mockReset();
    exports.mockVerifyPassword.mockReset();
};
exports.resetPasswordMocks = resetPasswordMocks;
const mockSuccessfulHash = (hashedValue = 'hashed-password-123') => {
    exports.mockHashPassword.mockResolvedValue(hashedValue);
};
exports.mockSuccessfulHash = mockSuccessfulHash;
const mockSuccessfulVerify = (isValid = true) => {
    exports.mockVerifyPassword.mockResolvedValue(isValid);
};
exports.mockSuccessfulVerify = mockSuccessfulVerify;
const mockFailedVerify = () => {
    exports.mockVerifyPassword.mockResolvedValue(false);
};
exports.mockFailedVerify = mockFailedVerify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja1Bhc3N3b3JkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rlc3RzL21vY2tzL01vY2tQYXNzd29yZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLGdCQUFnQixHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUM3QixRQUFBLGtCQUFrQixHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUUvQixRQUFBLFlBQVksR0FBRztJQUMxQixZQUFZLEVBQUUsd0JBQWdCO0lBQzlCLGNBQWMsRUFBRSwwQkFBa0I7Q0FDbkMsQ0FBQztBQUVLLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFO0lBQ3JDLHdCQUFnQixDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzdCLDBCQUFrQixDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2pDLENBQUMsQ0FBQztBQUhXLFFBQUEsa0JBQWtCLHNCQUc3QjtBQUdLLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxXQUFXLEdBQUcscUJBQXFCLEVBQUUsRUFBRTtJQUN4RSx3QkFBZ0IsQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsRCxDQUFDLENBQUM7QUFGVyxRQUFBLGtCQUFrQixzQkFFN0I7QUFFSyxNQUFNLG9CQUFvQixHQUFHLENBQUMsT0FBTyxHQUFHLElBQUksRUFBRSxFQUFFO0lBQ3JELDBCQUFrQixDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2hELENBQUMsQ0FBQztBQUZXLFFBQUEsb0JBQW9CLHdCQUUvQjtBQUVLLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO0lBQ25DLDBCQUFrQixDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLENBQUMsQ0FBQztBQUZXLFFBQUEsZ0JBQWdCLG9CQUUzQiJ9