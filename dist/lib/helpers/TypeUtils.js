"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("./validation/Preconditions");
class TypeUtils {
    /**
     * Checks if the given type is the same or extends the given comparison type.
     *
     * @param givenType the given type
     * @param comparisonType the comparison type
     * @returns Boolean
     * @throws Error if any of the arguments is undefined
     * */
    static isA(givenType, comparisonType) {
        Preconditions_1.Preconditions.assertDefined(givenType);
        Preconditions_1.Preconditions.assertDefined(comparisonType);
        if (givenType === comparisonType) {
            return true;
        }
        return givenType.prototype instanceof comparisonType;
    }
}
exports.TypeUtils = TypeUtils;
//# sourceMappingURL=TypeUtils.js.map