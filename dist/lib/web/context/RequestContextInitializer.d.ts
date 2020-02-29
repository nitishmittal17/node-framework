import { RequestHandler } from "express-serve-static-core";
/**
 * Request context initializer.
 * Defines the Express middleware responsible for initializing the RequestContext for each incoming request.
 */
export declare class RequestContextInitializer {
    /**
     * Returns the Express middleware responsible for initializing the RequestContext for each incoming request.
     * Creates new Zone (zone.js) for each incoming request in which the continuing request handling will be done.
     * The RequestContext is stored as property in the newly created Zone.
     * @returns {RequestHandler}
     */
    static getMiddleware(): RequestHandler;
    private static createRequestZone;
}
