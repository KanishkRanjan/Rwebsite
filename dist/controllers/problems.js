"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSolveCount = exports.getProblems = exports.addProblem = exports.deleteProblem = void 0;
const custom_error_1 = __importDefault(require("../utils/error/custom.error"));
const responder_1 = __importDefault(require("../utils/responder"));
const problems_model_1 = __importDefault(require("../models/problems.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const delay_1 = __importDefault(require("../utils/delay"));
const getFormatedDate = (date) => date.toISOString().split('T')[0];
const deleteProblem = async (req, res, next) => {
    try {
        const { problemId } = req.params;
        const deletedUser = await problems_model_1.default.findByIdAndDelete(problemId);
        if (!deletedUser) {
            return next(new custom_error_1.default("Problem was not found in Database", 400));
        }
        return next(new responder_1.default("Problem deleted successfully", 200));
    }
    catch (error) {
        console.error("Error during problem deletion:", error);
        return next(new custom_error_1.default("Problem was not found in Database", 500));
    }
};
exports.deleteProblem = deleteProblem;
const addProblem = async (req, res, next) => {
    try {
        let { name, problemIndex, contestId, tags, questionLink, difficulty, date } = req.body;
        if (date)
            date = getFormatedDate(new Date());
        if (!name || !problemIndex || !contestId || !tags || !date || !questionLink) {
            return next(new custom_error_1.default("Missing required fields", 400));
        }
        const newProblem = new problems_model_1.default({ name, contestId, problemIndex, tags, link: questionLink, difficulty, date });
        await newProblem.save();
        return next(new responder_1.default("Problem created successfully", 201));
    }
    catch (error) {
        if (error.code === 11000) {
            return next(new custom_error_1.default("Problem with the same name already exists", 409));
        }
        return next(new custom_error_1.default("Internal server error", 500));
    }
};
exports.addProblem = addProblem;
const getProblems = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 11000;
        const problems = await problems_model_1.default.find()
            .sort({ date: 1 })
            .limit(limit);
        if (!problems.length) {
            return next(new responder_1.default('No problems found', 200));
        }
        res.json(problems);
        next();
    }
    catch (error) {
        return next(new custom_error_1.default('Internal server error', 500));
    }
};
exports.getProblems = getProblems;
const getSolveCount = async (req, res, next) => {
    let totalSolve = 0;
    let participantSolve = 0;
    let { contestId, problemIndex } = req.query;
    try {
        const userData = await user_model_1.default.find().select('ProgressMatrixes.codeforces post');
        for (let i = 0; i < userData.length; i++) {
            const extracted = userData[i].ProgressMatrixes.get('codeforces');
            const apiUrl = `https://codeforces.com/api/user.status?handle=${extracted.username}`;
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                if (data.status !== "OK") {
                    throw new Error(data.comment || "Error fetching submissions");
                }
                const result = data.result;
                if (!data.result)
                    continue;
                for (let j = 0; j < result.length; j++) {
                    if (result[j].contestId === parseInt(contestId) && result[j].problem.index === problemIndex && result[j].verdict == "OK") {
                        if (userData[i].post == 'participant')
                            participantSolve++;
                        totalSolve++;
                    }
                }
            }
            catch (error) {
                throw error;
            }
            (0, delay_1.default)(1000);
        }
    }
    catch (error) {
        return next(new custom_error_1.default('Internal server error', 500));
    }
    res.status(200).send({ totalSolve, participantSolve });
};
exports.getSolveCount = getSolveCount;
