import { InjectUtil, InjectionData } from "./InjectionDecorators";
import { CONTROLLER_DECORATOR_TOKEN } from "./ControllerDecorator";
import { INTERCEPTOR_DECORATOR_TOKEN } from "./InterceptorDecorator";
import { COMPONENT_DEFINITION_POST_PROCESSOR_DECORATOR_TOKEN } from "../processors/ComponentDefinitionPostProcessor";
import { COMPONENT_POST_PROCESSOR_DECORATOR_TOKEN } from "../processors/ComponentPostProcessor";
import {ASPECT_DECORATOR_TOKEN} from "./AspectDecorator";
import { DecoratorUsageTypeError } from "../errors/DecoratorUsageErrors";
import { DecoratorUtil, DecoratorType } from "../helpers/DecoratorUtils";

export class ComponentData {
    componentName: string;
    classToken: Symbol;
    aliasTokens: Array<Symbol>;
    injectionData: InjectionData;
    profiles: Array<string>;

    constructor(componentName: string) {
        this.componentName = componentName;
        this.classToken = Symbol('classToken');
        this.aliasTokens = [];
        this.profiles = [];
        this.injectionData = new InjectionData();
    }
}

const COMPONENT_DECORATOR_TOKEN = Symbol('component_decorator_token');

export function Component() {
    return function (target) {
        DecoratorUtil.throwOnWrongType(Component, DecoratorType.CLASS, [...arguments]);
        // TODO: Make Duplicate @Component error which distinguishes from extended classes #52
        let componentData = new ComponentData(target.name);
        componentData.injectionData = InjectUtil.initIfDoesntExist(target.prototype);
        target[COMPONENT_DECORATOR_TOKEN] = componentData;
    };
}

export class ComponentUtil {

    static getComponentData(target): ComponentData {
        if (target) {
            return target[COMPONENT_DECORATOR_TOKEN];
        }
    }

    static isComponent(target): boolean {
        return !!this.getComponentData(target);
    }

    static getClassToken(target): Symbol {
        return this.getComponentData(target).classToken;
    }

    static getAliasTokens(target): Array<Symbol> {
        return this.getComponentData(target).aliasTokens;
    }

    static getInjectionData(target): InjectionData {
        return this.getComponentData(target).injectionData;
    }

    static isController(target): boolean {
        return !!target[CONTROLLER_DECORATOR_TOKEN];
    }

    static isInterceptor(target): boolean {
        return !!target[INTERCEPTOR_DECORATOR_TOKEN];
    }

    static isComponentDefinitionPostProcessor(target): boolean {
        return !!target[COMPONENT_DEFINITION_POST_PROCESSOR_DECORATOR_TOKEN];
    }

    static isComponentPostProcessor(target): boolean {
        return !!target[COMPONENT_POST_PROCESSOR_DECORATOR_TOKEN];
    }

    static isAspect(target): boolean {
        return !!target[ASPECT_DECORATOR_TOKEN];
    }

    static throwWhenNotOnComponentClass (decorator: Function, decoratorArgs: Array<any>, rootCause?: Error) {
        if (!this.isComponent(decoratorArgs[0])) {
            let subjectName = DecoratorUtil.getSubjectName(decoratorArgs);
            throw new DecoratorUsageTypeError(decorator, `@${Component.name} classes`, subjectName, rootCause);
        }
    }
}