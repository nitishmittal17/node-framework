"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const fileSystem = require("fs");
const path_module = require("path");
const ConfigurationDecorator_1 = require("./ConfigurationDecorator");
const ComponentDecorator_1 = require("./ComponentDecorator");
const RequireUtils_1 = require("../helpers/RequireUtils");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
const LoggerFactory_1 = require("../helpers/logging/LoggerFactory");
let logger = LoggerFactory_1.LoggerFactory.getInstance();
/**
 *A decorator for setting up project files to be component-scanned.
 * May only be put on @Configuration() classes.
 * @param path for the root directory. (For relative paths use __dirname)
 */
function ComponentScan(path) {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(ComponentScan, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.throwWhenNotOnConfigurationClass(ComponentScan, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.addComponentScanPath(target, path);
    };
}
exports.ComponentScan = ComponentScan;
class ComponentScanUtil {
    static getComponentsFromPaths(paths, environment) {
        let result = new Set();
        for (let path of paths) {
            if (path.profiles.length === 0 || environment.acceptsProfiles(...path.profiles)) {
                for (let module of this.getModulesStartingFrom(path.path)) {
                    for (let component of this.getComponentsFromModule(module)) {
                        result.add(component);
                    }
                }
            }
        }
        return result;
    }
    ;
    static *getModulesStartingFrom(path) {
        if (!fileSystem.lstatSync(path).isDirectory()) {
            throw new Error(`Given path must be a valid directory. Path: ${path}`);
        }
        let files = fileSystem.readdirSync(path);
        for (let fileName of files) {
            let filePath = path_module.join(path, fileName);
            let lstat = fileSystem.lstatSync(filePath);
            // if it's JavaScript file load it
            if (lstat.isFile() && path_module.extname(fileName) === '.js') {
                logger.debug(`Loading dynamically by @ComponentScan: ${fileName} (${filePath})`);
                yield RequireUtils_1.RequireUtils.require(filePath);
            }
            if (lstat.isDirectory()) {
                yield* this.getModulesStartingFrom(filePath);
            }
        }
    }
    ;
    static getComponentsFromModule(module) {
        return _.filter(module, (exportable) => ComponentDecorator_1.ComponentUtil.isComponent(exportable));
    }
    ;
}
exports.ComponentScanUtil = ComponentScanUtil;
//# sourceMappingURL=ComponentScanDecorator.js.map