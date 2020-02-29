import * as _ from "lodash";
import * as Router from "koa-router";
import { OrderUtil } from "../decorators/OrderDecorator";
import { RouterConfigItem } from "../decorators/RequestMappingDecorator";
import { RequestContextInitializer } from "./context/RequestContextInitializer";
import { RouteHandlerError, InterceptorError } from "../errors/WebErrors";
import { LoggerFactory } from "../helpers/logging/LoggerFactory";
import { ComponentUtil } from "../decorators/ComponentDecorator";

let logger = LoggerFactory.getInstance();

/**
 * RouteConfigurer responsible for configuring the Express 4.x router that will be exposed by the dispatcher.
 * */
export class RouterConfigurer {

    private router: Router;
    private interceptors: Array<any>;
    private routeHandlers: Map<RouterConfigItem, any>;

    constructor (router: Router) {
        this.router = router;
        this.interceptors = [];
        this.routeHandlers = new Map();
    }

    /**
     * Registers an interceptor.
     * @param instance instance of the interceptor
     * */
    registerInterceptor(instance) {
        logger.debug(`Registering interceptor ${ComponentUtil.getComponentData(instance.constructor).componentName}.`);
        this.interceptors.push(instance);
    }

    /**
     * Registers new route handler for the given route.
     * @param route the route configuration
     * @param handler the instance responsible for handling the route
     * */
    registerHandler(route: RouterConfigItem, handler) {
        this.routeHandlers.set(route, handler);
    }

    /**
     * Configures the Express router with the given interceptors and route handlers.
     * Note: this method needs to be called after all interceptors and route handlers have been registered.
     * */
    configure() {
        this.interceptors = OrderUtil.orderList(this.interceptors);
        //this.configureMiddlewares();
        this.registerRouteHandlers();
    }

    private configureMiddlewares() {
        /*logger.info('Configuring the exposed express router...');

        // NOTE: The request context middleware should always be registered first
        logger.debug('Registering request context initializer middleware...');
        this.router.use(RequestContextInitializer.getMiddleware());

        logger.debug('Registering pre-handler middleware...');
        this.router.use(this.wrap(this.preHandler.bind(this)));
        // NOTE: we will have our middleware handler when we drop the dependency to express
        // That would require the dispatching by path to be implemented on our side
        logger.debug('Registering route-handler (RequestMapping) middleware...');
        this.registerRouteHandlers();
        logger.debug('Registering post-handler middleware...');
        this.router.use(this.wrap(this.postHandler.bind(this)));
        logger.debug('Registering error-resolver middleware...');
        this.router.use(this.errorResolver);
        logger.debug('Registering resolver middleware...');
        this.router.use(this.wrap(this.resolver.bind(this)));*/
    }

    private registerRouteHandlers() {
        for (let [route, handler] of this.routeHandlers.entries()) {
            let httpMethod = route.requestConfig.method;
            let path = route.requestConfig.path;
            logger.debug(`Registering route. Path: '${path}', method: ${httpMethod}. Handler: ${ComponentUtil
                .getComponentData(handler.constructor).componentName}.${route.methodHandler}()`);

            let self = this;
            this.router[httpMethod](path, this.wrap(async(ctx, next) => {
                let result;

                try {
                    await self.preHandler(ctx);
                    await handler[route.methodHandler](ctx);
                } catch(err) {

                }
                await next();
            }))
        }
    }

    private async preHandler(ctx) {
        for (let i = 0; i < this.interceptors.length; i += 1) {
            let interceptor = this.interceptors[i];
            if (_.isFunction(interceptor.preHandle)) {
                try {
                    await interceptor.preHandle(ctx)
                } catch (err) {
                    logger.debug("Error occurred in the pre handler.");
                }
            }
        }
    }

    private async postHandler(request, response, next) {
        // NOTE: postHandle is executed in the reversed order
        for (let i = this.interceptors.length - 1; i >= 0; i -= 1) {
            let interceptor = this.interceptors[i];
            if (_.isFunction(interceptor.postHandle)) {
                try {
                    await interceptor.postHandle(request, response);
                } catch (err) {
                    logger.debug("Error occurred in the post handler.");
                    next(new InterceptorError(`${ComponentUtil.getComponentData(interceptor.constructor)
                        .componentName}.postHandle failed on ${request.method} ${request.url}`, err));
                    return;
                }
            }
        }
        next();
    }
    private errorResolver(error: Error, request, response, next) {
        logger.error('Unhandled error occurred. Returned status 500 with apropriate message.\n%s', error.stack);
        response.status(500);
        response.send("Code 500: Internal Server error");
    }

    private async resolver(request, response) {
        let handlingResult = response.$$frameworkData;
        if (handlingResult && response.finished === false) {
            if (_.isUndefined(handlingResult.view)) {
                response.json(handlingResult.model);
            } else {
                response.render(handlingResult.view, handlingResult.model);
            }
        }
    }

    // TODO saskodh: replace this workaround when we upgrade express to 5.x
    // NOTE: workaround because express 4.x does not support middle-wares returning promise
    private wrap(fn) {
        return (...args) => fn(...args).catch(args[2]);
    };
}