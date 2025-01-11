"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csessdata = exports.codeforcesdata = exports.codechefdata = exports.leetcodedata = void 0;
const leetcode_scrapper_1 = __importDefault(require("../utils/scrapper/leetcode.scrapper"));
const codechef_scrapper_1 = __importDefault(require("../utils/scrapper/codechef.scrapper"));
const codeforces_scrapper_1 = __importDefault(require("../utils/scrapper/codeforces.scrapper"));
const cses_scrapper_1 = __importDefault(require("../utils/scrapper/cses.scrapper"));
const custom_error_1 = __importDefault(require("../utils/error/custom.error"));
const leetcodedata = async (req, res, next) => {
    const username = req.params?.username;
    const result = await (0, leetcode_scrapper_1.default)(username);
    if (result.success)
        return next(new custom_error_1.default('No User found with that username', 404));
    res.json(result);
};
exports.leetcodedata = leetcodedata;
const codechefdata = async (req, res, next) => {
    const username = req.params?.username;
    const result = await (0, codechef_scrapper_1.default)(username);
    if (result.success)
        return next(new custom_error_1.default('No User found with that username', 404));
    res.json(result);
};
exports.codechefdata = codechefdata;
const codeforcesdata = async (req, res, next) => {
    const username = req.params?.username;
    const result = await (0, codeforces_scrapper_1.default)(username);
    if (result.success)
        return next(new custom_error_1.default('No User found with that username', 404));
    res.json(result);
};
exports.codeforcesdata = codeforcesdata;
const csessdata = async (req, res, next) => {
    const username = req.params?.username;
    const result = await (0, cses_scrapper_1.default)(username);
    if (result.success)
        return next(new custom_error_1.default('No User found with that username', 404));
    res.json(result);
};
exports.csessdata = csessdata;
