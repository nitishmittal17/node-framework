"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationDecorator_1 = require("./ConfigurationDecorator");
const CacheDefinitionPostProcessor_1 = require("../processors/cache/CacheDefinitionPostProcessor");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
/**
 *
 * A decorator which enables the caching decorators (@Cacheable, @CacheEvict, @CachePut)
 * May only be put on @Configuration() classes.
 */
function EnableCaching() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(EnableCaching, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.throwWhenNotOnConfigurationClass(EnableCaching, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.getConfigurationData(target).componentDefinitionPostProcessorFactory.components
            .push(CacheDefinitionPostProcessor_1.CacheDefinitionPostProcessor);
    };
}
exports.EnableCaching = EnableCaching;
//# sourceMappingURL=EnableCachingDecorator.js.map