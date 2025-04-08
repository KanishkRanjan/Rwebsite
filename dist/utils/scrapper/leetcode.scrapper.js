"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';
// Function to fetch user data from LeetCode
async function getLeetCodeData(username) {
    const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }
    }`;
    try {
        const response = await axios_1.default.post(LEETCODE_GRAPHQL_URL, {
            query,
            variables: { username }
        });
        const stats = response.data?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
        if (!stats) {
            return { error: 'User not found or data unavailable' };
        }
        return {
            easy: stats[1]?.count || 0,
            medium: stats[2]?.count || 0,
            hard: stats[3]?.count || 0,
            total: stats[0]?.count || 0
        };
    }
    catch (error) {
        console.error('Error fetching data:', error.message);
        return { success: false };
    }
}
exports.default = getLeetCodeData;
