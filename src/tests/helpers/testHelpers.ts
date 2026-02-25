/**
 * Helpers pour les tests unitaires
 * Fonctions utilitaires réutilisables dans tous les tests
 */

/**
 * Crée un objet Request mocké pour les tests
 */
export const createMockRequest = (body = {}, params = {}, extras = {}) =>
  ({
    body,
    params,
    query: {},
    headers: {},
    hostname: "192.168.1.100",
    socket: { remoteAddress: "192.168.1.100" },
    ...extras,
  }) as any;

/**
 * Crée un objet Response mocké pour les tests
 */
export const createMockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Reset tous les mocks d'un module
 */
export const resetAllMocks = (...resetFunctions: Array<() => void>) => {
  resetFunctions.forEach((fn) => fn());
};

/**
 * Attend qu'une promesse soit résolue (utile pour les tests async)
 */
export const waitForAsync = () =>
  new Promise((resolve) => setImmediate(resolve));

/**
 * Vérifie qu'une fonction a été appelée avec des paramètres partiels
 */
export const expectCalledWithPartial = (
  mockFn: jest.Mock,
  expectedPartial: Record<string, any>
) => {
  const calls = mockFn.mock.calls;
  const found = calls.some((call) => {
    const arg = call[0];
    return Object.keys(expectedPartial).every(
      (key) => arg[key] === expectedPartial[key]
    );
  });

  if (!found) {
    throw new Error(
      `Expected mock to be called with partial ${JSON.stringify(
        expectedPartial
      )}, but was called with ${JSON.stringify(calls)}`
    );
  }
};

/**
 * Simule une erreur de base de données
 */
export const createDBError = (message = "Database error") => {
  const error: any = new Error(message);
  error.name = "MongoError";
  error.code = 11000;
  return error;
};

/**
 * Simule une erreur Docker
 */
export const createDockerError = (message = "Docker daemon error") => {
  const error: any = new Error(message);
  error.statusCode = 500;
  error.reason = "container not found";
  return error;
};

/**
 * Vérifie qu'une réponse HTTP contient les bonnes données
 */
export const expectSuccessResponse = (
  res: any,
  statusCode: number,
  messageContains?: string,
  data?: any
) => {
  expect(res.status).toHaveBeenCalledWith(statusCode);

  if (messageContains) {
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(messageContains),
      })
    );
  }

  if (data) {
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(data));
  }
};

/**
 * Vérifie qu'une réponse HTTP est une erreur
 */
export const expectErrorResponse = (
  res: any,
  statusCode: number,
  message?: string
) => {
  expect(res.status).toHaveBeenCalledWith(statusCode);

  if (message) {
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining(message),
      })
    );
  }
};

/**
 * Setup rapide pour tests de controller
 */
export const setupControllerTest = () => {
  const req = createMockRequest();
  const res = createMockResponse();
  return { req, res };
};
