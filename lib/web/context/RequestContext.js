"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Injector_1 = require("../../di/Injector");
/** Token under which the current Express request is stored in the RequestContext's injector. */
exports.REQUEST_TOKEN = Symbol('request');
/** Token under which the current Express response is stored in the RequestContext's injector. */
exports.RESPONSE_TOKEN = Symbol('response');
/**
 * Request context model.
 */
class RequestContext {
    constructor(request, response) {
        this.injector = new Injector_1.Injector();
        this.injector.register(exports.REQUEST_TOKEN, request);
        this.injector.register(exports.RESPONSE_TOKEN, response);
    }
    getInjector() {
        return this.injector;
    }
}
exports.RequestContext = RequestContext;
//# sourceMappingURL=RequestContext.js.map