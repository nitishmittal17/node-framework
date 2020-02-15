"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestContext_1 = require("./RequestContext");
const RequestContextHolder_1 = require("./RequestContextHolder");
/**
 * Request context initializer.
 * Defines the Express middleware responsible for initializing the RequestContext for each incoming request.
 */
class RequestContextInitializer {
    /**
     * Returns the Express middleware responsible for initializing the RequestContext for each incoming request.
     * Creates new Zone (zone.js) for each incoming request in which the continuing request handling will be done.
     * The RequestContext is stored as property in the newly created Zone.
     * @returns {RequestHandler}
     */
    static getMiddleware() {
        return function (request, response, next) {
            let requestContext = new RequestContext_1.RequestContext(request, response);
            RequestContextInitializer.createRequestZone(requestContext).run(next);
        };
    }
    static createRequestZone(requestContext) {
        let requestZoneSpec = {
            name: RequestContextHolder_1.REQUEST_CONTEXT_TOKEN,
            properties: {}
        };
        requestZoneSpec.properties[RequestContextHolder_1.REQUEST_CONTEXT_TOKEN] = requestContext;
        return Zone.current.fork(requestZoneSpec).fork(Zone['longStackTraceZoneSpec']);
    }
}
exports.RequestContextInitializer = RequestContextInitializer;
//# sourceMappingURL=RequestContextInitializer.js.map