"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetRetourMocks = exports.MockRetour = exports.mockWarning = exports.mockInfo = exports.mockError = exports.mockSuccess = void 0;
exports.mockSuccess = jest.fn();
exports.mockError = jest.fn();
exports.mockInfo = jest.fn();
exports.mockWarning = jest.fn();
exports.MockRetour = {
    success: exports.mockSuccess,
    error: exports.mockError,
    info: exports.mockInfo,
    warning: exports.mockWarning,
};
const resetRetourMocks = () => {
    exports.mockSuccess.mockReset();
    exports.mockError.mockReset();
    exports.mockInfo.mockReset();
    exports.mockWarning.mockReset();
};
exports.resetRetourMocks = resetRetourMocks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9ja1JldG91ci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9tb2Nrcy9Nb2NrUmV0b3VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFhLFFBQUEsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUN4QixRQUFBLFNBQVMsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDdEIsUUFBQSxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3JCLFFBQUEsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUV4QixRQUFBLFVBQVUsR0FBRztJQUN4QixPQUFPLEVBQUUsbUJBQVc7SUFDcEIsS0FBSyxFQUFFLGlCQUFTO0lBQ2hCLElBQUksRUFBRSxnQkFBUTtJQUNkLE9BQU8sRUFBRSxtQkFBVztDQUNyQixDQUFDO0FBRUssTUFBTSxnQkFBZ0IsR0FBRyxHQUFHLEVBQUU7SUFDbkMsbUJBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN4QixpQkFBUyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3RCLGdCQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDckIsbUJBQVcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMxQixDQUFDLENBQUM7QUFMVyxRQUFBLGdCQUFnQixvQkFLM0IifQ==