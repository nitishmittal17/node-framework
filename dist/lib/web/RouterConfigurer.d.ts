import * as Router from "koa-router";
import { RouterConfigItem } from "../decorators/RequestMappingDecorator";
/**
 * RouteConfigurer responsible for configuring the Express 4.x router that will be exposed by the dispatcher.
 * */
export declare class RouterConfigurer {
    private router;
    private interceptors;
    private routeHandlers;
    constructor(router: Router);
    /**
     * Registers an interceptor.
     * @param instance instance of the interceptor
     * */
    registerInterceptor(instance: any): void;
    /**
     * Registers new route handler for the given route.
     * @param route the route configuration
     * @param handler the instance responsible for handling the route
     * */
    registerHandler(route: RouterConfigItem, handler: any): void;
    /**
     * Configures the Express router with the given interceptors and route handlers.
     * Note: this method needs to be called after all interceptors and route handlers have been registered.
     * */
    configure(): void;
    private configureMiddlewares;
    private registerRouteHandlers;
    private preHandler;
    private postHandler;
    private errorResolver;
    private resolver;
    private wrap;
}
