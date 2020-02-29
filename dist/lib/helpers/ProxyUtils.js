"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProxyUtils {
    static createMethodProxy(method, callback) {
        return new Proxy(method, { apply: callback });
    }
}
exports.ProxyUtils = ProxyUtils;
//# sourceMappingURL=ProxyUtils.js.map