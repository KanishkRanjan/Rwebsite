"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const calculate_1 = __importDefault(require("./calculate"));
const backfetcher_1 = __importDefault(require("./backfetcher"));
const getStoreAbleObject = async (name, post, datas) => {
    let totalScore = 0;
    const ProgressMatrixes = {};
    for (const { platform, username } of datas) {
        let aggregatedSolveCounts = {};
        let DailyUserActivity = {};
        let platformScore = 0;
        DailyUserActivity[new Date().toISOString().split("T")[0]] =
            aggregatedSolveCounts = await (0, backfetcher_1.default)(`/scrapper/${platform}/${username}`);
        platformScore = (0, calculate_1.default)(platform, aggregatedSolveCounts || {});
        ProgressMatrixes[platform] = {
            name: platform,
            username,
            aggregatedSolveCounts,
            DailyUserActivity,
            score: platformScore,
        };
        totalScore += platformScore;
    }
    return {
        name,
        post,
        flag: 0,
        ProgressMatrixes,
        score: totalScore,
    };
};
exports.default = getStoreAbleObject;
