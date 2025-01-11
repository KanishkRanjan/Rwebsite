"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboard_1 = require("../controllers/leaderboard");
const router = express_1.default.Router();
router.put('/adduser', leaderboard_1.addUser);
router.patch('/addflaguser', leaderboard_1.increaseflaguser);
router.patch('/updateActivity', leaderboard_1.updateActivity);
router.get('/getuserlist', leaderboard_1.getuserlist);
router.get('/insertDummy', leaderboard_1.insertDemoData);
router.delete('/deleteUser/:userId', leaderboard_1.deleteUser);
exports.default = router;
