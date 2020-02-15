"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestContextHolder_1 = require("../web/context/RequestContextHolder");
const _ = require("lodash");
/**
 * Dynamic dependency resolver that will resolve the dependencies on run-time
 * from the RequestContext's injector or the given main injector as fallback.
 * */
class DynamicDependencyResolver {
    constructor(injector, dependencyData) {
        this.injector = injector;
        this.dependencyData = dependencyData;
    }
    /**
     * Returns configured property descriptor that can be set on an instance for resolving it's dependency dynamically.
     * @returns {PropertyDescriptor} configured property descriptor
     * */
    getPropertyDescriptor() {
        return {
            enumerable: true,
            configurable: true,
            get: this.getFieldGetter(),
            set: this.getFieldSetter()
        };
    }
    getFieldGetter() {
        return () => {
            let dependency = this.getField(RequestContextHolder_1.RequestContextHolder.getInjector()) || this.getField(this.injector);
            if (this.dependencyData.isArray && _.isUndefined(dependency)) {
                return [];
            }
            return dependency;
        };
    }
    getFieldSetter() {
        return (value) => {
            RequestContextHolder_1.RequestContextHolder.getInjector().register(this.dependencyData.token, value);
        };
    }
    getField(injector) {
        try {
            return injector.getComponent(this.dependencyData.token);
        }
        catch (e) {
            // NOTE: component not registered error
        }
    }
}
exports.DynamicDependencyResolver = DynamicDependencyResolver;
//# sourceMappingURL=DynamicDependencyResolver.js.map