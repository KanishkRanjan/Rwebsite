"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calculation = (aggregatedSolveCounts) => {
    console.log("leetcode: ", aggregatedSolveCounts);
    const safeGet = (key) => aggregatedSolveCounts?.[key] || 0;
    const easyCount = safeGet('easy');
    const mediumCount = safeGet('medium');
    const hardCount = safeGet('hard');
    console.log("Leetcode calculation: ", easyCount, mediumCount, hardCount);
    return easyCount + mediumCount * 2 + hardCount * 3;
};
exports.default = calculation;
