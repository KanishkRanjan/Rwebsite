"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const router = express.Router();
const leaderboard_1 = __importDefault(require("../routes/leaderboard"));
const scrapper_1 = __importDefault(require("../routes/scrapper"));
const problems_1 = __importDefault(require("../routes/problems"));
// Use specific routes
router.use('/leaderboard', leaderboard_1.default);
router.use('/scrapper', scrapper_1.default);
router.use('/problems', problems_1.default);
module.exports = router;
