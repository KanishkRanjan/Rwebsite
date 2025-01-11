"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGO_URI = process.env.DB_URI || '';
const connect = async () => {
    try {
        if (!MONGO_URI) {
            throw { errmsg: "Problem when getting MONGO URL. Check .env file" };
        }
        await mongoose_1.default.connect(MONGO_URI);
        console.log("connected successfully");
    }
    catch (err) {
        console.error(err.errmsg);
        process.exit(0);
    }
};
exports.connect = connect;
