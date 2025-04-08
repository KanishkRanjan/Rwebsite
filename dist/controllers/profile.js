"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const custom_error_1 = __importDefault(require("../utils/error/custom.error"));
const responder_1 = __importDefault(require("../utils/responder"));
const userProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userData = await user_model_1.default.findById(id);
        if (!userData) {
            return next(new custom_error_1.default("User id was not found in Database", 400));
        }
        return next(new responder_1.default("Problem deleted successfully", 200));
    }
    catch (error) {
        console.error("Error during finding user by Id:", error);
        return next(new custom_error_1.default("Error during finding user by Id", 500));
    }
};
exports.userProfile = userProfile;
