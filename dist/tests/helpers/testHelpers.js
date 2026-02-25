"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupControllerTest = exports.expectErrorResponse = exports.expectSuccessResponse = exports.createDockerError = exports.createDBError = exports.expectCalledWithPartial = exports.waitForAsync = exports.resetAllMocks = exports.createMockResponse = exports.createMockRequest = void 0;
const createMockRequest = (body = {}, params = {}, extras = {}) => (Object.assign({ body,
    params, query: {}, headers: {}, hostname: '192.168.1.100', socket: { remoteAddress: '192.168.1.100' } }, extras));
exports.createMockRequest = createMockRequest;
const createMockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.end = jest.fn().mockReturnValue(res);
    return res;
};
exports.createMockResponse = createMockResponse;
const resetAllMocks = (...resetFunctions) => {
    resetFunctions.forEach((fn) => fn());
};
exports.resetAllMocks = resetAllMocks;
const waitForAsync = () => new Promise((resolve) => setImmediate(resolve));
exports.waitForAsync = waitForAsync;
const expectCalledWithPartial = (mockFn, expectedPartial) => {
    const calls = mockFn.mock.calls;
    const found = calls.some((call) => {
        const arg = call[0];
        return Object.keys(expectedPartial).every((key) => arg[key] === expectedPartial[key]);
    });
    if (!found) {
        throw new Error(`Expected mock to be called with partial ${JSON.stringify(expectedPartial)}, but was called with ${JSON.stringify(calls)}`);
    }
};
exports.expectCalledWithPartial = expectCalledWithPartial;
const createDBError = (message = 'Database error') => {
    const error = new Error(message);
    error.name = 'MongoError';
    error.code = 11000;
    return error;
};
exports.createDBError = createDBError;
const createDockerError = (message = 'Docker daemon error') => {
    const error = new Error(message);
    error.statusCode = 500;
    error.reason = 'container not found';
    return error;
};
exports.createDockerError = createDockerError;
const expectSuccessResponse = (res, statusCode, messageContains, data) => {
    expect(res.status).toHaveBeenCalledWith(statusCode);
    if (messageContains) {
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining(messageContains),
        }));
    }
    if (data) {
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(data));
    }
};
exports.expectSuccessResponse = expectSuccessResponse;
const expectErrorResponse = (res, statusCode, message) => {
    expect(res.status).toHaveBeenCalledWith(statusCode);
    if (message) {
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining(message),
        }));
    }
};
exports.expectErrorResponse = expectErrorResponse;
const setupControllerTest = () => {
    const req = (0, exports.createMockRequest)();
    const res = (0, exports.createMockResponse)();
    return { req, res };
};
exports.setupControllerTest = setupControllerTest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdEhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdGVzdHMvaGVscGVycy90ZXN0SGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFRTyxNQUFNLGlCQUFpQixHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsZ0JBQ3pFLElBQUk7SUFDSixNQUFNLEVBQ04sS0FBSyxFQUFFLEVBQUUsRUFDVCxPQUFPLEVBQUUsRUFBRSxFQUNYLFFBQVEsRUFBRSxlQUFlLEVBQ3pCLE1BQU0sRUFBRSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsSUFDdkMsTUFBTSxDQUNGLENBQUEsQ0FBQztBQVJHLFFBQUEsaUJBQWlCLHFCQVFwQjtBQUtILE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFO0lBQ3JDLE1BQU0sR0FBRyxHQUFRLEVBQUUsQ0FBQztJQUNwQixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekMsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUM7QUFQVyxRQUFBLGtCQUFrQixzQkFPN0I7QUFLSyxNQUFNLGFBQWEsR0FBRyxDQUFDLEdBQUcsY0FBaUMsRUFBRSxFQUFFO0lBQ3BFLGNBQWMsQ0FBQyxP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