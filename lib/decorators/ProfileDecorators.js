"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ComponentDecorator_1 = require("./ComponentDecorator");
const ConfigurationDecorator_1 = require("./ConfigurationDecorator");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
function Profile(...profiles) {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(Profile, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ComponentDecorator_1.ComponentUtil.throwWhenNotOnComponentClass(Profile, [...arguments]);
        profiles.forEach((profile) => ComponentDecorator_1.ComponentUtil.getComponentData(target).profiles.push(profile));
    };
}
exports.Profile = Profile;
function ActiveProfiles(...profiles) {
    return function (target) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(ActiveProfiles, DecoratorUtils_1.DecoratorType.CLASS, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.throwWhenNotOnConfigurationClass(ActiveProfiles, [...arguments]);
        ConfigurationDecorator_1.ConfigurationUtil.getConfigurationData(target).activeProfiles.push(...profiles);
    };
}
exports.ActiveProfiles = ActiveProfiles;
//# sourceMappingURL=ProfileDecorators.js.map