"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const codeforces_calcuation_1 = __importDefault(require("./calculationFormula/codeforces.calcuation"));
const codechef_calcuation_1 = __importDefault(require("./calculationFormula/codechef.calcuation"));
const leetcode_calcuation_1 = __importDefault(require("./calculationFormula/leetcode.calcuation"));
exports.default = (platform, data) => {
    if (platform == "codeforces") {
        return (0, codeforces_calcuation_1.default)(data);
    }
    else if (platform == "codechef") {
        return (0, codechef_calcuation_1.default)(data);
    }
    else if (platform == "leetcode") {
        return (0, leetcode_calcuation_1.default)(data);
    }
    else {
        return data?.total || 0;
    }
};
