"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const calcuation = (aggregatedSolveCounts) => {
    if (aggregatedSolveCounts?.total == undefined) {
        const safeGet = (key) => aggregatedSolveCounts?.key || 0;
        console.log("went here");
        const easyCount = safeGet('easy');
        const mediumCount = safeGet('medium');
        const hardCount = safeGet('hard');
        const total = easyCount + mediumCount + hardCount;
        return total || 0;
    }
    return parseInt(aggregatedSolveCounts?.total);
};
exports.default = calcuation;
