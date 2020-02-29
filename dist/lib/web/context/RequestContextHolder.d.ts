import { Request, Response } from "express-serve-static-core";
import { RequestContext } from "./RequestContext";
import { Injector } from "../../di/Injector";
/** The token under which the RequestContext is stored as a property on the Zone (zone.js). */
export declare const REQUEST_CONTEXT_TOKEN = "request-context";
/**
 * Request context holder.
 * Extracts the RequestContext from the current Zone (zone.js)
 * */
export declare class RequestContextHolder {
    /**
     * Returns the current RequestContext.
     * @returns {RequestContext} the current request context
     */
    static get(): RequestContext;
    /**
     * Returns the injector from the current RequestContext
     * @returns {Injector} the injector from the current request context
     */
    static getInjector(): Injector;
    /**
     * Returns the current Express Request from the current RequestContext.
     * @returns {Request} current Express request
     */
    static getRequest(): Request;
    /**
     * Returns the current Express Response from the current RequestContext.
     * @returns {Response} current Express response
     */
    static getResponse(): Response;
}
