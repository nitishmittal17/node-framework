"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BadArgumentErrors_1 = require("../../errors/BadArgumentErrors");
class Preconditions {
    /**
     * Validates that the passed argument is defined.
     *
     * @param argument given argument
     * @throws Error if the given argument is not defined
     * */
    static assertDefined(argument) {
        // replace with _.isUndefined(argument)
        if (argument === undefined) {
            throw new BadArgumentErrors_1.BadArgumentError('Given argument is not defined');
        }
    }
}
exports.Preconditions = Preconditions;
//# sourceMappingURL=Preconditions.js.map