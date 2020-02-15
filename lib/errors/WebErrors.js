"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseError_1 = require("./BaseError");
class WebError extends BaseError_1.BaseError {
}
exports.WebError = WebError;
class RouteHandlerError extends WebError {
}
exports.RouteHandlerError = RouteHandlerError;
class InterceptorError extends WebError {
}
exports.InterceptorError = InterceptorError;
//# sourceMappingURL=WebErrors.js.map