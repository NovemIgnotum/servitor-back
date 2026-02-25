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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmV0b3VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3Rlc3RzL21vY2tzL1JldG91ci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFDeEIsUUFBQSxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ3RCLFFBQUEsUUFBUSxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztBQUNyQixRQUFBLFdBQVcsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7QUFFeEIsUUFBQSxVQUFVLEdBQUc7SUFDeEIsT0FBTyxFQUFFLG1CQUFXO0lBQ3BCLEtBQUssRUFBRSxpQkFBUztJQUNoQixJQUFJLEVBQUUsZ0JBQVE7SUFDZCxPQUFPLEVBQUUsbUJBQVc7Q0FDckIsQ0FBQztBQUVLLE1BQU0sZ0JBQWdCLEdBQUcsR0FBRyxFQUFFO0lBQ25DLG1CQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDeEIsaUJBQVMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUN0QixnQkFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3JCLG1CQUFXLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDMUIsQ0FBQyxDQUFDO0FBTFcsUUFBQSxnQkFBZ0Isb0JBSzNCIn0=