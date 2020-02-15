"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DecoratorUsageErrors_1 = require("../errors/DecoratorUsageErrors");
const DecoratorUtils_1 = require("../helpers/DecoratorUtils");
const LIFE_CYCLE_HOOKS_TOKEN = Symbol('life_cycle_hooks_token');
class LifeCycleHooksConfig {
}
exports.LifeCycleHooksConfig = LifeCycleHooksConfig;
/**
 * Method decorator for post processing of components. The method is called after wiring the components.
 */
function PostConstruct() {
    return function (target, methodName, descriptor) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(PostConstruct, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        let conf = LifeCycleHooksUtil.initIfDoesntExist(target);
        if (conf.postConstructMethod) {
            let errorParams = [conf.postConstructMethod, methodName].join(', ');
            let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName([...arguments]);
            throw new DecoratorUsageErrors_1.DecoratorUsageError(`@${PostConstruct.name} used on multiple methods (${errorParams}) ` +
                `within a @Component (${subjectName})`);
        }
        conf.postConstructMethod = methodName;
    };
}
exports.PostConstruct = PostConstruct;
/**
 * Method decorator for pre destruction of components. The method is called upon exiting the process.
 * Must do applicationContext.registerExitHook() for this to work.
 */
function PreDestroy() {
    return function (target, methodName, descriptor) {
        DecoratorUtils_1.DecoratorUtil.throwOnWrongType(PreDestroy, DecoratorUtils_1.DecoratorType.METHOD, [...arguments]);
        let conf = LifeCycleHooksUtil.initIfDoesntExist(target);
        if (conf.preDestroyMethod) {
            let errorParams = [conf.preDestroyMethod, methodName].join(', ');
            let subjectName = DecoratorUtils_1.DecoratorUtil.getSubjectName([...arguments]);
            throw new DecoratorUsageErrors_1.DecoratorUsageError(`@${PreDestroy.name} used on multiple methods (${errorParams}) ` +
                `within a @Component (${subjectName})`);
        }
        conf.preDestroyMethod = methodName;
    };
}
exports.PreDestroy = PreDestroy;
class LifeCycleHooksUtil {
    static getConfig(target) {
        return target.prototype[LIFE_CYCLE_HOOKS_TOKEN] || new LifeCycleHooksConfig();
    }
    static initIfDoesntExist(target) {
        if (!target[LIFE_CYCLE_HOOKS_TOKEN]) {
            target[LIFE_CYCLE_HOOKS_TOKEN] = new LifeCycleHooksConfig();
        }
        return target[LIFE_CYCLE_HOOKS_TOKEN];
    }
}
exports.LifeCycleHooksUtil = LifeCycleHooksUtil;
//# sourceMappingURL=LifeCycleHooksDecorators.js.map