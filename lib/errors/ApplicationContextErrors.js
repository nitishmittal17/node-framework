"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class ApplicationContextError extends BaseError_1.BaseError {
}
exports.ApplicationContextError = ApplicationContextError;
class ComponentInitializationError extends ApplicationContextError {
}
exports.ComponentInitializationError = ComponentInitializationError;
class ComponentWiringError extends ApplicationContextError {
}
exports.ComponentWiringError = ComponentWiringError;
class PostConstructionError extends ApplicationContextError {
}
exports.PostConstructionError = PostConstructionError;
class PreDestructionError extends ApplicationContextError {
}
exports.PreDestructionError = PreDestructionError;
class PostProcessError extends ApplicationContextError {
}
exports.PostProcessError = PostProcessError;
//# sourceMappingURL=ApplicationContextErrors.js.map