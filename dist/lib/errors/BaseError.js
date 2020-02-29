"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class BaseError extends Error {
    constructor(message, rootCause) {
        super(message);
        this.name = this.constructor.name;
        this.rootCause = rootCause;
        Error.captureStackTrace(this, this.constructor);
        this.message = message;
        if (!_.isUndefined(rootCause)) {
            this.stack = `${this.stack}\nRoot cause: ${rootCause.stack}\n`;
        }
    }
}
exports.BaseError = BaseError;
//# sourceMappingURL=BaseError.js.map