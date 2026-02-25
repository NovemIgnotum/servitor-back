// Fixtures pour les tests User

export const validUserPayload = {
  email: "testuser@example.com",
  password: "SecurePassword123!",
};

export const validLoginPayload = {
  email: "testuser@example.com",
  password: "SecurePassword123!",
};

export const invalidLoginPayload = {
  email: "testuser@example.com",
  password: "WrongPassword",
};

export const mockUser = {
  _id: "user-123",
  email: "testuser@example.com",
  password: "hashed-password-123",
  servers: [],
};

export const mockUserWithServers = {
  _id: "user-456",
  email: "userservers@example.com",
  password: "hashed-password-456",
  servers: ["server-1", "server-2"],
};

export const updateUserPayload = {
  email: "newemail@example.com",
};

export const updatePasswordPayload = {
  password: "NewPassword456!",
  oldPassword: "SecurePassword123!",
};

export const userList = [
  {
    _id: "user-1",
    email: "user1@example.com",
    password: "hash1",
  },
  {
    _id: "user-2",
    email: "user2@example.com",
    password: "hash2",
  },
  {
    _id: "user-3",
    email: "user3@example.com",
    password: "hash3",
  },
];
