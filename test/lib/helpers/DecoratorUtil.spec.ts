import { expect } from "chai";
import {stub} from "sinon";
import { DecoratorUtil, DecoratorType } from "../../../src/lib/helpers/DecoratorUtils";
import * as _ from "lodash";

describe('DecoratorUtil', function () {

    let getAssertingDecoratorFromType = function (decoratorType) {
        return function ClassDecorator(...args) {
            expect(DecoratorUtil.getType(args)).to.be.eq(decoratorType);
            expect(DecoratorUtil.isType(decoratorType, args)).to.be.true;
            for (let type of _.filter(DecoratorType.getAllTypes(), (type) => type !== decoratorType)) {
                expect(DecoratorUtil.isType(type, args)).to.be.false;
            }
        };
    };

    it('should the decorator type correctly (CLASS)', function () {
        // given / when / then
        @getAssertingDecoratorFromType(DecoratorType.CLASS)
        class A {}
    });

    it('should the decorator type correctly (METHOD)', function () {
        // given / when / then
        class A {
            @getAssertingDecoratorFromType(DecoratorType.METHOD)
            method () {} // tslint:disable-line
        }
    });

    it('should the decorator type correctly (PROPERTY)', function () {
        // given / when / then
        class A {
            @getAssertingDecoratorFromType(DecoratorType.PROPERTY)
            private property; // tslint:disable-line
        }
    });

    it('should the decorator type correctly (PARAMETER)', function () {
        // given / when / then
        class A {
            method (@getAssertingDecoratorFromType(DecoratorType.PARAMETER) methodParam) {} // tslint:disable-line
        }
    });

    it('should get subject name', function() {
        // given
        function SomeDecorator(...args) {} // tslint:disable-line

        class MyClass {
            myProperty: string;
            @SomeDecorator
            myFunction(str: string) {} // tslint:disable-line
        }
        let classArgs = [MyClass];
        let propertyArgs = [MyClass.prototype, 'myProperty'];
        let methodArgs = [MyClass.prototype, 'myFunction', MyClass.prototype.myFunction];
        let stubOnIsType = stub(DecoratorUtil, 'isType').returns(false);
        stubOnIsType.withArgs(DecoratorType.CLASS, classArgs).returns(true);
        stubOnIsType.withArgs(DecoratorType.METHOD, methodArgs).returns(true);
        stubOnIsType.withArgs(DecoratorType.PROPERTY, propertyArgs).returns(true);

        // when / then
        expect(DecoratorUtil.getSubjectName(classArgs)).to.be.eql('MyClass');
        expect(DecoratorUtil.getSubjectName(propertyArgs)).to.be.eql('MyClass.myProperty');
        expect(DecoratorUtil.getSubjectName(methodArgs)).to.be.eql('MyClass.myFunction(String)');
        expect(DecoratorUtil.getSubjectName([MyClass.prototype, 'myFunction', 3]))
            .to.be.eql('3rd param of MyClass.myFunction(String)');

        stubOnIsType.restore();
    });
});