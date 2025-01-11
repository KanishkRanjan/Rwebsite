"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const problems_1 = require("../controllers/problems");
const router = express_1.default.Router();
router.post('/addproblem', problems_1.addProblem);
router.get('/getproblems/:limit', problems_1.getProblems);
router.get('/getsolvecount', problems_1.getSolveCount);
router.delete('/delete/:problemId', problems_1.deleteProblem);
exports.default = router;
