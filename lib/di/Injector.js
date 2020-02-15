"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const InjectionError_1 = require("../errors/InjectionError");
class Injector {
    constructor() {
        this.components = new Map();
    }
    register(token, component) {
        if (!this.components.has(token)) {
            this.components.set(token, []);
        }
        this.components.get(token).push(component);
    }
    getComponent(token) {
        let components = this.components.get(token);
        if (_.isUndefined(components)) {
            throw new InjectionError_1.InjectionError('No such component registered');
        }
        if (components.length > 1) {
            throw new InjectionError_1.InjectionError(`Ambiguous injection. ${components.length} components found in the injector.`);
        }
        return components[0];
    }
    getComponents(token) {
        return this.components.get(token) || [];
    }
}
exports.Injector = Injector;
//# sourceMappingURL=Injector.js.map