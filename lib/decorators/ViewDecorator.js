"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const RequestMappingDecorator_1 = require("../decorators/RequestMappingDecorator");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
function View(name) {
    return function (target, methodName) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(View, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        let viewName = name || methodName;
        let routerConfig = RequestMappingDecorator_1.RequestMappingUtil.initRouterConfigIfDoesntExist(target);
        let routeConfig = _.find(routerConfig.routes, { methodHandler: methodName });
        if (!routeConfig) {
            // NOTE: in case when @View is before @RequestMapping
            routeConfig = new RequestMappingDecorator_1.RouterConfigItem(null, methodName);
            routerConfig.routes.push(routeConfig);
        }
        routeConfig.view = viewName;
    };
}
exports.View = View;
//# sourceMappingURL=ViewDecorator.js.map