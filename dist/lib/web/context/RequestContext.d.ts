import { Request, Response } from "express-serve-static-core";
import { Injector } from "../../di/Injector";
/** Token under which the current Express request is stored in the RequestContext's injector. */
export declare const REQUEST_TOKEN: unique symbol;
/** Token under which the current Express response is stored in the RequestContext's injector. */
export declare const RESPONSE_TOKEN: unique symbol;
/**
 * Request context model.
 */
export declare class RequestContext {
    private injector;
    constructor(request: Request, response: Response);
    getInjector(): Injector;
}
