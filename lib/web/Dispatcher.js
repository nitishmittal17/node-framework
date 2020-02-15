"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const ComponentDecorator_1 = require("../decorators/ComponentDecorator");
const RouterConfigurer_1 = require("./RouterConfigurer");
const RequestMappingDecorator_1 = require("../decorators/RequestMappingDecorator");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
class Dispatcher {
    constructor() {
        this.router = new Router();
        this.routerConfigurer = new RouterConfigurer_1.RouterConfigurer(this.router);
    }
    getRouter() {
        return this.router;
    }
    processAfterInit(clazz, instance) {
        if (ComponentDecorator_1.ComponentUtil.isInterceptor(clazz)) {
            this.routerConfigurer.registerInterceptor(instance);
        }
        if (ComponentDecorator_1.ComponentUtil.isController(clazz)) {
            this.registerController(clazz, instance);
        }
    }
    // TODO #29 saskodh: initialize the dispatcher with a post processor
    postConstruct() {
        this.routerConfigurer.configure();
    }
    registerController(clazz, instance) {
        logger.debug(`Registering controller ${ComponentDecorator_1.ComponentUtil.getComponentData(clazz).componentName}.`);
        let controllerMappingPath = RequestMappingDecorator_1.RequestMappingUtil.getControllerRequestMappingPath(clazz);
        for (let route of RequestMappingDecorator_1.RequestMappingUtil.getValidRoutes(clazz)) {
            route.requestConfig.path = controllerMappingPath + route.requestConfig.path;
            this.routerConfigurer.registerHandler(route, instance);
        }
    }
}
exports.Dispatcher = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map