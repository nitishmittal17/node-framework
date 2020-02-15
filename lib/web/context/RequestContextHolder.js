"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestContext_1 = require("./RequestContext");
const InvalidUsageError_1 = require("../../errors/InvalidUsageError");
/** The token under which the RequestContext is stored as a property on the Zone (zone.js). */
exports.REQUEST_CONTEXT_TOKEN = 'request-context';
/**
 * Request context holder.
 * Extracts the RequestContext from the current Zone (zone.js)
 * */
class RequestContextHolder {
    /**
     * Returns the current RequestContext.
     * @returns {RequestContext} the current request context
     */
    static get() {
        let currentRequestContext = Zone.current.get(exports.REQUEST_CONTEXT_TOKEN);
        if (!currentRequestContext) {
            throw new InvalidUsageError_1.InvalidUsageError('This method cannot be called outside request context.');
        }
        return currentRequestContext;
    }
    /**
     * Returns the injector from the current RequestContext
     * @returns {Injector} the injector from the current request context
     */
    static getInjector() {
        return this.get().getInjector();
    }
    /**
     * Returns the current Express Request from the current RequestContext.
     * @returns {Request} current Express request
     */
    static getRequest() {
        return this.getInjector().getComponent(RequestContext_1.REQUEST_TOKEN);
    }
    /**
     * Returns the current Express Response from the current RequestContext.
     * @returns {Response} current Express response
     */
    static getResponse() {
        return this.getInjector().getComponent(RequestContext_1.RESPONSE_TOKEN);
    }
}
exports.RequestContextHolder = RequestContextHolder;
//# sourceMappingURL=RequestContextHolder.js.map