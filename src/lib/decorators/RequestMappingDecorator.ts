import * as _ from "lodash";
import { DecoratorUtil, DecoratorType } from "../helpers/DecoratorUtils";
import { DecoratorUsageTypeError } from "../errors/DecoratorUsageErrors";
import { BadArgumentError } from "../errors/BadArgumentErrors";

// NOTE: These are methods defined on the Express Router
// http://expressjs.com/en/4x/api.html#router
export class RequestMethod {
    static GET = 'get';
    static POST = 'post';
    static PUT = 'put';
    static DELETE = 'delete';
    static OPTIONS = 'options';
    static PATCH = 'patch';
}

export interface RequestMappingConfig {
    path: string;
    method?: string;
}

const ROUTER_CONFIG = Symbol('router_config');
const CLASS_ROUTER_CONFIG = Symbol('class_router_config');

export class RouterConfigItem {
    requestConfig: RequestMappingConfig;
    methodHandler: string;
    view: string;

    constructor(requestConfig: RequestMappingConfig, handler: string) {
        this.requestConfig = requestConfig;
        this.methodHandler = handler;
    }

    isValid() {
        return this.requestConfig && this.methodHandler;
    }
}

export class RouterConfig {
    routes: Array<RouterConfigItem> = [];
}

export function RequestMapping(config: RequestMappingConfig) {
    return function (...args) {
        let type = DecoratorUtil.getType(args);

        let target = args[0];
        if (type === DecoratorType.METHOD) {
            if (config.method === undefined) {
                throw new BadArgumentError
                        (`When using @${RequestMapping.name} on methods you must provide the request method type`);
            }
            let method = args[1];
            let routerConfig = RequestMappingUtil.initRouterConfigIfDoesntExist(target);
            let routeConfig = _.find(routerConfig.routes, {methodHandler: method});
            // TODO: Override bug #51
            if (routeConfig) {
                routeConfig.requestConfig = config;
            } else {
                routerConfig.routes.push(new RouterConfigItem(config, method));
            }
        } else if (type === DecoratorType.CLASS) {
            // TODO: refactor when new options are added on @RequestMapping for classes
            target[CLASS_ROUTER_CONFIG] = config.path;
        } else {
            let subjectName = DecoratorUtil.getSubjectName(args);
            throw new DecoratorUsageTypeError(RequestMapping, "classes and methods", subjectName);
        }
    };
}

export class RequestMappingUtil {

    static getValidRoutes(target): Array<RouterConfigItem> {
        let routerConfig = this.initRouterConfigIfDoesntExist(target.prototype);
        return _.filter(routerConfig.routes, (route) => route.isValid());
    }

    static initRouterConfigIfDoesntExist(target): RouterConfig {
        if (_.isUndefined(target[ROUTER_CONFIG])) {
            target[ROUTER_CONFIG] = new RouterConfig();
        }
        return target[ROUTER_CONFIG];
    }

    static getControllerRequestMappingPath(target) {
        return target[CLASS_ROUTER_CONFIG] || "";
    }
}