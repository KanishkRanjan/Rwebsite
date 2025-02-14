"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendFetchRequest = async (url, type, payload) => {
    const api_url = `${process.env.HOST_LINK}/api`;
    if (!url) {
        console.error("URL was not provided!");
        return { error: "URL must be passed" };
    }
    try {
        url = api_url + url;
        console.log(url);
        const response = await fetch(url, {
            method: type || "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: payload ? JSON.stringify(payload) : undefined,
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error during fetch request:", error);
        return { error: error.message, url };
    }
};
exports.default = sendFetchRequest;
