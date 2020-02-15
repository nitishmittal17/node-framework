"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class DecoratorUsageError extends BaseError_1.BaseError {
}
exports.DecoratorUsageError = DecoratorUsageError;
class DecoratorUsageTypeError extends DecoratorUsageError {
    constructor(decorator, subjectType, subjectName, rootCause) {
        super(`@${decorator.name} can be used only on ${subjectType}. Instead it is used on ${subjectName}`, rootCause);
    }
}
exports.DecoratorUsageTypeError = DecoratorUsageTypeError;
//# sourceMappingURL=DecoratorUsageErrors.js.map