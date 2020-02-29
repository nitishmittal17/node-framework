"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class GeneralUtils {
    static flattenObject(ob) {
        let flatMap = new Map();
        _.forEach(ob, (value, prop) => {
            if (_.isPlainObject(value)) {
                this.flattenObject(value)
                    .forEach((value, key) => flatMap.set(`${prop}.${key}`, value));
            }
            else if (_.isArray(value)) {
                // TODO: add warning/error when object is toString()-ed for array joining
                flatMap.set(prop, value.join(','));
            }
            else {
                flatMap.set(prop, value);
            }
        });
        return flatMap;
    }
    ;
    static getOrdinalNumber(n) {
        let s = ["th", "st", "nd", "rd"], v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
}
exports.GeneralUtils = GeneralUtils;
//# sourceMappingURL=GeneralUtils.js.map