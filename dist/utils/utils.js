"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformNames = exports.getFormattedDate = exports.sendFetchRequest = void 0;
const api_url = `${process.env.HOST_LINK}/api`;
const sendFetchRequest = async (endpoint, method = "GET", body) => {
    if (!endpoint) {
        console.error("URL was not provided!");
        return { error: "URL must be passed" };
    }
    try {
        const url = api_url + endpoint;
        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error during fetch request:", error);
        return { error: error.message, url: endpoint };
    }
};
exports.sendFetchRequest = sendFetchRequest;
const getFormattedDate = (date) => date.toISOString().split("T")[0];
exports.getFormattedDate = getFormattedDate;
const platformNames = ["codeforces", "leetcode", "codechef", "cses"];
exports.platformNames = platformNames;
