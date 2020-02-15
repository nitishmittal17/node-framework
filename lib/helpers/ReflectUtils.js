"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class ReflectUtils {
    static getAllMethodsNames(clazz) {
        let methodsNames = [];
        for (let currentClazz of this.getClassHierarchy(clazz)) {
            Object.getOwnPropertyNames(currentClazz.prototype).forEach((methodName) => methodsNames.push(methodName));
        }
        return _.uniq(methodsNames);
    }
    static getClassHierarchy(clazz) {
        let prototypeChain = [];
        let currentType = clazz;
        while (currentType.name !== '') {
            prototypeChain.push(currentType);
            currentType = Reflect.getPrototypeOf(currentType);
        }
        return prototypeChain;
    }
}
exports.ReflectUtils = ReflectUtils;
//# sourceMappingURL=ReflectUtils.js.map