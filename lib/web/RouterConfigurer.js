"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const OrderDecorator_1 = require("../decorators/OrderDecorator");
const WebErrors_1 = require("../errors/WebErrors");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
const ComponentDecorator_1 = require("../decorators/ComponentDecorator");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
/**
 * RouteConfigurer responsible for configuring the Express 4.x router that will be exposed by the dispatcher.
 * */
class RouterConfigurer {
    constructor(router) {
        this.router = router;
        this.interceptors = [];
        this.routeHandlers = new Map();
    }
    /**
     * Registers an interceptor.
     * @param instance instance of the interceptor
     * */
    registerInterceptor(instance) {
        logger.debug(`Registering interceptor ${ComponentDecorator_1.ComponentUtil.getComponentData(instance.constructor).componentName}.`);
        this.interceptors.push(instance);
    }
    /**
     * Registers new route handler for the given route.
     * @param route the route configuration
     * @param handler the instance responsible for handling the route
     * */
    registerHandler(route, handler) {
        this.routeHandlers.set(route, handler);
    }
    /**
     * Configures the Express router with the given interceptors and route handlers.
     * Note: this method needs to be called after all interceptors and route handlers have been registered.
     * */
    configure() {
        this.interceptors = OrderDecorator_1.OrderUtil.orderList(this.interceptors);
        //this.configureMiddlewares();
        this.registerRouteHandlers();
    }
    configureMiddlewares() {
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
    registerRouteHandlers() {
        for (let [route, handler] of this.routeHandlers.entries()) {
            let httpMethod = route.requestConfig.method;
            let path = route.requestConfig.path;
            path = '/api' + path;
            logger.debug(`Registering route. Path: '${path}', method: ${httpMethod}. Handler: ${ComponentDecorator_1.ComponentUtil
                .getComponentData(handler.constructor).componentName}.${route.methodHandler}()`);
            let self = this;
            this.router[httpMethod](path, this.wrap((ctx, next) => __awaiter(this, void 0, void 0, function* () {
                let result;
                try {
                    yield self.preHandler(ctx);
                    yield handler[route.methodHandler](ctx);
                }
                catch (err) {
                }
                yield next();
            })));
        }
    }
    preHandler(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this.interceptors.length; i += 1) {
                let interceptor = this.interceptors[i];
                if (_.isFunction(interceptor.preHandle)) {
                    try {
                        yield interceptor.preHandle(ctx);
                    }
                    catch (err) {
                        logger.debug("Error occurred in the pre handler.");
                    }
                }
            }
        });
    }
    postHandler(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // NOTE: postHandle is executed in the reversed order
            for (let i = this.interceptors.length - 1; i >= 0; i -= 1) {
                let interceptor = this.interceptors[i];
                if (_.isFunction(interceptor.postHandle)) {
                    try {
                        yield interceptor.postHandle(request, response);
                    }
                    catch (err) {
                        logger.debug("Error occurred in the post handler.");
                        next(new WebErrors_1.InterceptorError(`${ComponentDecorator_1.ComponentUtil.getComponentData(interceptor.constructor)
                            .componentName}.postHandle failed on ${request.method} ${request.url}`, err));
                        return;
                    }
                }
            }
            next();
        });
    }
    errorResolver(error, request, response, next) {
        logger.error('Unhandled error occurred. Returned status 500 with apropriate message.\n%s', error.stack);
        response.status(500);
        response.send("Code 500: Internal Server error");
    }
    resolver(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let handlingResult = response.$$frameworkData;
            if (handlingResult && response.finished === false) {
                if (_.isUndefined(handlingResult.view)) {
                    response.json(handlingResult.model);
                }
                else {
                    response.render(handlingResult.view, handlingResult.model);
                }
            }
        });
    }
    // TODO saskodh: replace this workaround when we upgrade express to 5.x
    // NOTE: workaround because express 4.x does not support middle-wares returning promise
    wrap(fn) {
        return (...args) => fn(...args).catch(args[2]);
    }
    ;
}
exports.RouterConfigurer = RouterConfigurer;
//# sourceMappingURL=RouterConfigurer.js.map