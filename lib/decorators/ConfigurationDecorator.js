"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentFactory_1 = require("../di/ComponentFactory");
const ComponentScanDecorator_1 = require("./ComponentScanDecorator");
const ComponentDecorator_1 = require("./ComponentDecorator");
const DecoratorUsageErrors_1 = require("../errors/DecoratorUsageErrors");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
const CONFIGURATION_HOLDER_TOKEN = Symbol('configuration_holder_token');
class ProfiledPath {
    constructor(profiles, path) {
        this.profiles = profiles;
        this.path = path;
    }
}
exports.ProfiledPath = ProfiledPath;
class ConfigurationData {
    constructor() {
        this.componentFactory = new ComponentFactory_1.ComponentFactory();
        this.componentPostProcessorFactory = new ComponentFactory_1.ComponentFactory();
        this.componentDefinitionPostProcessorFactory = new ComponentFactory_1.ComponentFactory();
        this.componentScanPaths = [];
        this.propertySourcePaths = [];
        this.activeProfiles = [];
    }
    loadAllComponents(environment) {
        logger.info('Loading components by component scan...');
        ComponentScanDecorator_1.ComponentScanUtil.getComponentsFromPaths(this.componentScanPaths, environment)
            .forEach((component) => {
            if (ComponentDecorator_1.ComponentUtil.isComponentDefinitionPostProcessor(component)) {
                this.componentDefinitionPostProcessorFactory.components.push(component);
            }
            else if (ComponentDecorator_1.ComponentUtil.isComponentPostProcessor(component)) {
                this.componentPostProcessorFactory.components.push(component);
            }
            else {
                this.componentFactory.components.push(component);
            }
        });
    }
}
exports.ConfigurationData = ConfigurationData;
function Configuration() {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Configuration, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        if (target[CONFIGURATION_HOLDER_TOKEN]) {
            let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName([...arguments]);
            throw new DecoratorUsageErrors_1.DecoratorUsageError(`Duplicate @Configuration decorator' (${subjectName})`);
        }
        ComponentDecorator_1.Component()(target);
        target[CONFIGURATION_HOLDER_TOKEN] = new ConfigurationData();
        // todo allow registering components in this target class
    };
}
exports.Configuration = Configuration;
class ConfigurationUtil {
    static getConfigurationData(target) {
        if (!this.isConfigurationClass(target)) {
            let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName([...arguments]);
            throw new Error(`${subjectName} is not a @Configuration class`);
        }
        return target[CONFIGURATION_HOLDER_TOKEN];
    }
    static isConfigurationClass(target) {
        return !!target[CONFIGURATION_HOLDER_TOKEN];
    }
    static addComponentScanPath(target, path) {
        this.getConfigurationData(target).componentScanPaths.push(new ProfiledPath(ComponentDecorator_1.ComponentUtil.getComponentData(target).profiles, path));
    }
    static addPropertySourcePath(target, path) {
        this.getConfigurationData(target).propertySourcePaths.push(new ProfiledPath(ComponentDecorator_1.ComponentUtil.getComponentData(target).profiles, path));
    }
    static throwWhenNotOnConfigurationClass(decorator, decoratorArgs, rootCause) {
        if (!this.isConfigurationClass(decoratorArgs[0])) {
            let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName(decoratorArgs);
            throw new DecoratorUsageErrors_1.DecoratorUsageTypeError(decorator, `@${Configuration.name} classes`, subjectName, rootCause);
        }
    }
}
exports.ConfigurationUtil = ConfigurationUtil;
//# sourceMappingURL=ConfigurationDecorator.js.map