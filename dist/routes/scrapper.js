"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scrapper_1 = require("../controllers/scrapper");
const router = express_1.default.Router();
router.get('/leetcode/:username', scrapper_1.leetcodedata);
router.get('/codechef/:username', scrapper_1.codechefdata);
router.get('/codeforces/:username', scrapper_1.codeforcesdata);
router.get('/cses/:username', scrapper_1.csessdata);
exports.default = router;
