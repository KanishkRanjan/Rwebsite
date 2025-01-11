"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const DailyUserActivityValidator = joi_1.default.object({
    easy: joi_1.default.number().optional(),
    medium: joi_1.default.number().optional(),
    hard: joi_1.default.number().optional(),
    total: joi_1.default.number().required(),
});
const ProgressMatrixValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    username: joi_1.default.string().required(),
    score: joi_1.default.number().required(),
    aggregatedSolveCounts: joi_1.default.object()
        .pattern(joi_1.default.string(), joi_1.default.number().required())
        .required(),
    DailyUserActivity: joi_1.default.object()
        .pattern(joi_1.default.string(), DailyUserActivityValidator.required())
        .required(),
});
exports.UserValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    post: joi_1.default.string().default('Member'),
    flag: joi_1.default.number().default(0),
    score: joi_1.default.number().required(),
    ProgressMatrixes: joi_1.default.object()
        .pattern(joi_1.default.string(), ProgressMatrixValidator.required())
        .optional(),
});
// Export the validator
exports.default = exports.UserValidator;
