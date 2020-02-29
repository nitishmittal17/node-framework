"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ConfigurationDecorator_1 = require("./ConfigurationDecorator");
const GeneralUtils_1 = require("../helpers/GeneralUtils");
const RequireUtils_1 = require("../helpers/RequireUtils");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
const BadArgumentErrors_1 = require("../errors/BadArgumentErrors");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
/**
 * A decorator for defining a JSON property source for the configuration properties.
 * May only be put on @Configuration() classes.
 * @param path to the property source. (For relative paths use __dirname)
 */
function PropertySource(path) {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(PropertySource, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.throwWhenNotOnConfigurationClass(PropertySource, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.addPropertySourcePath(target, path);
    };
}
exports.PropertySource = PropertySource;
class PropertySourceUtil {
    static getPropertiesFromPaths(...propertySourcePaths) {
        let resultPropertiesMap = new Map();
        for (let path of propertySourcePaths) {
            logger.debug(`Loading properties by @PropertySource from "${path}"`);
            let properties;
            try {
                properties = RequireUtils_1.RequireUtils.require(path);
            }
            catch (err) {
                throw new BadArgumentErrors_1.BadArgumentError(`couldn't read property source at ${path}`, err);
            }
            this.parseProperties(properties).forEach((value, prop) => resultPropertiesMap.set(prop, value));
        }
        return resultPropertiesMap;
    }
    static parseProperties(properties) {
        if (_.isObject(properties)) {
            return GeneralUtils_1.GeneralUtils.flattenObject(properties);
        }
        return new Map();
    }
}
exports.PropertySourceUtil = PropertySourceUtil;
//# sourceMappingURL=PropertySourceDecorator.js.map