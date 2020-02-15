"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
const DecoratorUsageErrors_1 = require("../errors/DecoratorUsageErrors");
const BadArgumentErrors_1 = require("../errors/BadArgumentErrors");
class RequestMethod {
}
exports.RequestMethod = RequestMethod;
RequestMethod.GET = 'get';
RequestMethod.POST = 'post';
RequestMethod.PUT = 'put';
RequestMethod.DELETE = 'delete';
RequestMethod.OPTIONS = 'options';
RequestMethod.PATCH = 'patch';
const ROUTER_CONFIG = Symbol('router_config');
const CLASS_ROUTER_CONFIG = Symbol('class_router_config');
class RouterConfigItem {
    constructor(requestConfig, handler) {
        this.requestConfig = requestConfig;
        this.methodHandler = handler;
    }
    isValid() {
        return this.requestConfig && this.methodHandler;
    }
}
exports.RouterConfigItem = RouterConfigItem;
class RouterConfig {
    constructor() {
        this.routes = [];
    }
}
exports.RouterConfig = RouterConfig;
function RequestMapping(config) {
    return function (...args) {
        let type = DecoratorUtils_1.DecoratorUtil.getType(args);
        let target = args[0];
        if (type === DecoratorUtils_1.DecoratorType.METHOD) {
            if (config.method === undefined) {
                throw new BadArgumentErrors_1.BadArgumentError(`When using @${RequestMapping.name} on methods you must provide the request method type`);
            }
            let method = args[1];
            let routerConfig = RequestMappingUtil.initRouterConfigIfDoesntExist(target);
            let routeConfig = _.find(routerConfig.routes, { methodHandler: method });
            // TODO: Override bug #51
            if (routeConfig) {
                routeConfig.requestConfig = config;
            }
            else {
                routerConfig.routes.push(new RouterConfigItem(config, method));
            }
        }
        else if (type === DecoratorUtils_1.DecoratorType.CLASS) {
            // TODO: refactor when new options are added on @RequestMapping for classes
            target[CLASS_ROUTER_CONFIG] = config.path;
        }
        else {
            let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName(args);
            throw new DecoratorUsageErrors_1.DecoratorUsageTypeError(RequestMapping, "classes and methods", subjectName);
        }
    };
}
exports.RequestMapping = RequestMapping;
class RequestMappingUtil {
    static getValidRoutes(target) {
        let routerConfig = this.initRouterConfigIfDoesntExist(target.prototype);
        return routerConfig.routes.filter(route => route.isValid());
    }
    static initRouterConfigIfDoesntExist(target) {
        if (_.isUndefined(target[ROUTER_CONFIG])) {
            target[ROUTER_CONFIG] = new RouterConfig();
        }
        return target[ROUTER_CONFIG];
    }
    static getControllerRequestMappingPath(target) {
        return target[CLASS_ROUTER_CONFIG] || "";
    }
}
exports.RequestMappingUtil = RequestMappingUtil;
//# sourceMappingURL=RequestMappingDecorator.js.map