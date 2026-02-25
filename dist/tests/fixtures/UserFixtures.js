"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userList = exports.updatePasswordPayload = exports.updateUserPayload = exports.mockUserWithServers = exports.mockUser = exports.invalidLoginPayload = exports.validLoginPayload = exports.validUserPayload = void 0;
exports.validUserPayload = {
    email: 'testuser@example.com',
    password: 'SecurePassword123!',
};
exports.validLoginPayload = {
    email: 'testuser@example.com',
    password: 'SecurePassword123!',
};
exports.invalidLoginPayload = {
    email: 'testuser@example.com',
    password: 'WrongPassword',
};
exports.mockUser = {
    _id: 'user-123',
    email: 'testuser@example.com',
    password: 'hashed-password-123',
    servers: [],
};
exports.mockUserWithServers = {
    _id: 'user-456',
    email: 'userservers@example.com',
    password: 'hashed-password-456',
    servers: ['server-1', 'server-2'],
};
exports.updateUserPayload = {
    email: 'newemail@example.com',
};
exports.updatePasswordPayload = {
    password: 'NewPassword456!',
    oldPassword: 'SecurePassword123!',
};
exports.userList = [
    {
        _id: 'user-1',
        email: 'user1@example.com',
        password: 'hash1',
    },
    {
        _id: 'user-2',
        email: 'user2@example.com',
        password: 'hash2',
    },
    {
        _id: 'user-3',
        email: 'user3@example.com',
        password: 'hash3',
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXNlckZpeHR1cmVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rlc3RzL2ZpeHR1cmVzL1VzZXJGaXh0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFYSxRQUFBLGdCQUFnQixHQUFHO0lBQzlCLEtBQUssRUFBRSxzQkFBc0I7SUFDN0IsUUFBUSxFQUFFLG9CQUFvQjtDQUMvQixDQUFDO0FBRVcsUUFBQSxpQkFBaUIsR0FBRztJQUMvQixLQUFLLEVBQUUsc0JBQXNCO0lBQzdCLFFBQVEsRUFBRSxvQkFBb0I7Q0FDL0IsQ0FBQztBQUVXLFFBQUEsbUJBQW1CLEdBQUc7SUFDakMsS0FBSyxFQUFFLHNCQUFzQjtJQUM3QixRQUFRLEVBQUUsZUFBZTtDQUMxQixDQUFDO0FBRVcsUUFBQSxRQUFRLEdBQUc7SUFDdEIsR0FBRyxFQUFFLFVBQVU7SUFDZixLQUFLLEVBQUUsc0JBQXNCO0lBQzdCLFFBQVEsRUFBRSxxQkFBcUI7SUFDL0IsT0FBTyxFQUFFLEVBQUU7Q0FDWixDQUFDO0FBRVcsUUFBQSxtQkFBbUIsR0FBRztJQUNqQyxHQUFHLEVBQUUsVUFBVTtJQUNmLEtBQUssRUFBRSx5QkFBeUI7SUFDaEMsUUFBUSxFQUFFLHFCQUFxQjtJQUMvQixPQUFPLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO0NBQ2xDLENBQUM7QUFFVyxRQUFBLGlCQUFpQixHQUFHO0lBQy9CLEtBQUssRUFBRSxzQkFBc0I7Q0FDOUIsQ0FBQztBQUVXLFFBQUEscUJBQXFCLEdBQUc7SUFDbkMsUUFBUSxFQUFFLGlCQUFpQjtJQUMzQixXQUFXLEVBQUUsb0JBQW9CO0NBQ2xDLENBQUM7QUFFVyxRQUFBLFFBQVEsR0FBRztJQUN0QjtRQUNFLEdBQUcsRUFBRSxRQUFRO1FBQ2IsS0FBSyxFQUFFLG1CQUFtQjtRQUMxQixRQUFRLEVBQUUsT0FBTztLQUNsQjtJQUNEO1FBQ0UsR0FBRyxFQUFFLFFBQVE7UUFDYixLQUFLLEVBQUUsbUJBQW1CO1FBQzFCLFFBQVEsRUFBRSxPQUFPO0tBQ2xCO0lBQ0Q7UUFDRSxHQUFHLEVBQUUsUUFBUTtRQUNiLEtBQUssRUFBRSxtQkFBbUI7UUFDMUIsUUFBUSxFQUFFLE9BQU87S0FDbEI7Q0FDRixDQUFDIn0=