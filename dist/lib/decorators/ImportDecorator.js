"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConfigurationDecorator_1 = require("./ConfigurationDecorator");
const BadArgumentErrors_1 = require("../errors/BadArgumentErrors");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
const ComponentDecorator_1 = require("./ComponentDecorator");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
/**
 * Decorator used for composing configuration classes by importing other configuration classes.
 *
 * @param configurationClasses varargs configuration classes
 * @returns ClassDecorator for composing configuration classes
 * */
function Import(...configurationClasses) {
    return function (targetConfigurationClass) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Import, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.throwWhenNotOnConfigurationClass(Import, [...arguments]);
        let targetConfigurationData = ConfigurationDecorator_1.ConfigurationUtil.getConfigurationData(targetConfigurationClass);
        for (let configurationClass of configurationClasses) {
            if (!ConfigurationDecorator_1.ConfigurationUtil.isConfigurationClass(configurationClass)) {
                throw new BadArgumentErrors_1.DecoratorBadArgumentError(`${configurationClass.name} is not a configuration class.`, Import, [...arguments]);
            }
            logger.debug(`Importing configurations from ${ComponentDecorator_1.ComponentUtil.getComponentData(configurationClass)
                .componentName} to ${ComponentDecorator_1.ComponentUtil.getComponentData(targetConfigurationClass).componentName}`);
            let configurationData = ConfigurationDecorator_1.ConfigurationUtil.getConfigurationData(configurationClass);
            targetConfigurationData.componentFactory.components.push(...configurationData.componentFactory.components);
            targetConfigurationData.componentDefinitionPostProcessorFactory.components
                .push(...configurationData.componentDefinitionPostProcessorFactory.components);
            targetConfigurationData.componentPostProcessorFactory.components
                .push(...configurationData.componentPostProcessorFactory.components);
            targetConfigurationData.propertySourcePaths.push(...configurationData.propertySourcePaths);
            targetConfigurationData.componentScanPaths.push(...configurationData.componentScanPaths);
        }
    };
}
exports.Import = Import;
//# sourceMappingURL=ImportDecorator.js.map