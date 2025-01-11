"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
async function getSolvedProblemsByCategory(username) {
    const url = `https://codeforces.com/api/user.status?handle=${username}`;
    try {
        const response = await (0, node_fetch_1.default)(url);
        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error(`Codeforces API Error: ${data.comment}`);
        }
        const categories = {
            Easy: new Set([800, 900, 1000, 1100, 1200]),
            Medium: new Set([1300, 1400, 1500, 1600, 1700, 1800]),
            Hard: new Set([1900, 2000, 2100, 2200, 2300, 2400]),
        };
        const categoryCount = {
            easy: 0,
            medium: 0,
            hard: 0,
        };
        const solvedProblemsSet = new Set();
        data.result.forEach((submission) => {
            if (submission.verdict === 'OK' && submission.problem) {
                const { problem } = submission;
                const rating = problem.rating;
                const problemId = `${problem.contestId}-${problem.index}`;
                if (!rating || solvedProblemsSet.has(problemId))
                    return;
                if (categories.Easy.has(rating)) {
                    categoryCount.easy++;
                }
                else if (categories.Medium.has(rating)) {
                    categoryCount.medium++;
                }
                else if (categories.Hard.has(rating)) {
                    categoryCount.hard++;
                }
                solvedProblemsSet.add(problemId);
            }
        });
        const total = solvedProblemsSet.size;
        return {
            total,
            easy: categoryCount.easy,
            medium: categoryCount.medium,
            hard: categoryCount.hard,
        };
    }
    catch (error) {
        console.error(`Error fetching data for user "${username}":`, error.message);
        return { success: false };
    }
}
exports.default = getSolvedProblemsByCategory;
