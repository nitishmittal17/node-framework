"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ORDER_DECORATOR_TOKEN = Symbol('order_decorator_token');
function Order(orderValue) {
    return function (target) {
        target[ORDER_DECORATOR_TOKEN] = orderValue;
    };
}
exports.Order = Order;
class OrderUtil {
    static getOrder(target) {
        return target[ORDER_DECORATOR_TOKEN];
    }
    static orderList(list) {
        return _.sortBy(list, (element) => { return OrderUtil.getOrder(element) || Number.MAX_VALUE; });
    }
}
exports.OrderUtil = OrderUtil;
//# sourceMappingURL=OrderDecorator.js.map