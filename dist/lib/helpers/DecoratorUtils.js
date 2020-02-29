"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DecoratorUsageErrors_1 = require("../errors/DecoratorUsageErrors");
const GeneralUtils_1 = require("./GeneralUtils");
require("reflect-metadata");
class DecoratorType {
    static getAllTypes() {
        return [this.CLASS, this.METHOD, this.PROPERTY, this.PARAMETER];
    }
}
exports.DecoratorType = DecoratorType;
DecoratorType.CLASS = 'class';
DecoratorType.METHOD = 'method';
DecoratorType.PROPERTY = 'property';
DecoratorType.PARAMETER = 'parameter';
class DecoratorUtil {
    static getType(decoratorArgs) {
        if (decoratorArgs.length === 1) {
            return DecoratorType.CLASS;
        }
        else if (decoratorArgs.length === 2) {
            // NOTE: assumption valid for ES6+, if target is ES5 then the method decorators will also have 2 arguments
            return DecoratorType.PROPERTY;
        }
        else if (decoratorArgs.length === 3) {
            if (typeof decoratorArgs[2] === 'number') {
                return DecoratorType.PARAMETER;
            }
            else if (typeof decoratorArgs[2] === "undefined") {
                return DecoratorType.PROPERTY;
            }
            else {
                return DecoratorType.METHOD;
            }
        }
    }
    static isType(decoratorType, decoratorArgs) {
        return this.getType(decoratorArgs) === decoratorType;
    }
    /**
     * Returns the name of the thing where the decorator is put. "ClassName" for classes,
     * "ClassName.propertyName" for properties, "ClassName.methodName(Environment, String)" for methods
     * and "0th param of ClassName.methodName(Environment, String)" for parameters
     * @param decoratorArgs: The arguments to the decorator function (decoratorArgs[0] is the target)
     * @returns string
     */
    static getSubjectName(decoratorArgs) {
        if (this.isType(DecoratorType.CLASS, decoratorArgs)) {
            return decoratorArgs[0].name;
        }
        if (this.isType(DecoratorType.PROPERTY, decoratorArgs)) {
            return [decoratorArgs[0].constructor.name, decoratorArgs[1]].join('.');
        }
        let parameterTypes = Reflect.getMetadata('design:paramtypes', decoratorArgs[0], decoratorArgs[1])
            .map((param) => param.name).join(", ");
        if (this.isType(DecoratorType.METHOD, decoratorArgs)) {
            return `${decoratorArgs[0].constructor.name}.${decoratorArgs[1]}(${parameterTypes})`;
        }
        return `${GeneralUtils_1.GeneralUtils.getOrdinalNumber(decoratorArgs[2])} param of ${decoratorArgs[0]
            .constructor.name}.${decoratorArgs[1]}(${parameterTypes})`;
    }
    static throwOnWrongType(decorator, decoratorType, decoratorArgs, rootCause) {
        if (!this.isType(decoratorType, decoratorArgs)) {
            let subjectName = this.getSubjectName(decoratorArgs);
            if (decoratorType === DecoratorType.CLASS) {
                throw new DecoratorUsageErrors_1.DecoratorUsageTypeError(decorator, "classes", subjectName, rootCause);
            }
            if (decoratorType === DecoratorType.METHOD) {
                throw new DecoratorUsageErrors_1.DecoratorUsageTypeError(decorator, "methods", subjectName, rootCause);
            }
            if (decoratorType === DecoratorType.PROPERTY) {
                throw new DecoratorUsageErrors_1.DecoratorUsageTypeError(decorator, "properties", subjectName, rootCause);
            }
            if (decoratorType === DecoratorType.PARAMETER) {
                throw new DecoratorUsageErrors_1.DecoratorUsageTypeError(decorator, "parameters", subjectName, rootCause);
            }
        }
    }
}
exports.DecoratorUtil = DecoratorUtil;
//# sourceMappingURL=DecoratorUtils.js.map