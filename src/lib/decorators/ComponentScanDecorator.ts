import * as _ from "lodash";
import * as fileSystem from "fs";
import * as path_module from "path";
import { ConfigurationUtil, ProfiledPath } from "./ConfigurationDecorator";
import { ComponentUtil } from "./ComponentDecorator";
import { RequireUtils } from "../helpers/RequireUtils";
import { Environment } from "../di/Environment";
import { DecoratorType, DecoratorUtil } from "../helpers/DecoratorUtils";
import { LoggerFactory } from "../helpers/logging/LoggerFactory";

let logger = LoggerFactory.getInstance();

/**
 *A decorator for setting up project files to be component-scanned.
 * May only be put on @Configuration() classes.
 * @param path for the root directory. (For relative paths use __dirname)
 */
export function ComponentScan(path) {
    return function (target) {
        DecoratorUtil.throwOnWrongType(ComponentScan, DecoratorType.CLASS, [...arguments]);
        ConfigurationUtil.throwWhenNotOnConfigurationClass(ComponentScan, [...arguments]);
        ConfigurationUtil.addComponentScanPath(target, path);
    };
}

export class ComponentScanUtil {

    static getComponentsFromPaths(paths: Array<ProfiledPath>, environment: Environment): Set<any> {
        let result = new Set<any>();
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
    };

    private static * getModulesStartingFrom(path: string) {
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
                yield RequireUtils.require(filePath);
            }

            if (lstat.isDirectory()) {
                yield * this.getModulesStartingFrom(filePath);
            }
        }
    };

    private static getComponentsFromModule(module): Array<any> {
        return _.filter(module, (exportable) => ComponentUtil.isComponent(exportable));
    };
}