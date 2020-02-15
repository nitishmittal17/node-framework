"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
class BadArgumentError extends BaseError_1.BaseError {
}
exports.BadArgumentError = BadArgumentError;
class DecoratorBadArgumentError extends BadArgumentError {
    constructor(message, decorator, decoratorArgs, rootCause) {
        let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName(decoratorArgs);
        super(`${message} (In @${decorator.name} on ${subjectName})`, rootCause);
    }
}
exports.DecoratorBadArgumentError = DecoratorBadArgumentError;
//# sourceMappingURL=BadArgumentErrors.js.map