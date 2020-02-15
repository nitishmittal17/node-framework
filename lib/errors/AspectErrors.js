"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class AspectErrorInfo {
    constructor(aspectClassName, aspectMethodName, subjectClassName, subjectMethodName) {
        this.aspectClassName = aspectClassName;
        this.aspectMethodName = aspectMethodName;
        this.subjectClassName = subjectClassName;
        this.subjectMethodName = subjectMethodName;
    }
}
exports.AspectErrorInfo = AspectErrorInfo;
class AspectError extends BaseError_1.BaseError {
    constructor(aspectErrorInfo, rootCause) {
        let message = `Advice ${aspectErrorInfo.aspectMethodName}() on Aspect ${aspectErrorInfo
            .aspectClassName} failed on ${aspectErrorInfo.subjectClassName}.${aspectErrorInfo.subjectMethodName}()`;
        super(message, rootCause);
    }
}
exports.AspectError = AspectError;
class BeforeAdviceError extends AspectError {
}
exports.BeforeAdviceError = BeforeAdviceError;
class AfterAdviceError extends AspectError {
}
exports.AfterAdviceError = AfterAdviceError;
class AfterReturningAdviceError extends AspectError {
}
exports.AfterReturningAdviceError = AfterReturningAdviceError;
class AfterThrowingAdviceError extends AspectError {
}
exports.AfterThrowingAdviceError = AfterThrowingAdviceError;
//# sourceMappingURL=AspectErrors.js.map