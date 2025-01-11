"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const backfetcher_1 = __importDefault(require("./backfetcher"));
const calculate_1 = __importDefault(require("./calculate"));
const getFormatedDate = (date) => date.toISOString().split('T')[0];
const updateAll = async () => {
    const allusers = await (0, backfetcher_1.default)("/leaderboard/getuserlist");
    if (!allusers)
        return;
    allusers.forEach(async (alluser) => {
        for (let key in alluser.ProgressMatrixes) {
            const info = await (0, backfetcher_1.default)(`/scrapper/${alluser.ProgressMatrixes?.[key]?.name}/${alluser.ProgressMatrixes?.[key]?.username}`);
            console.log("THis is info: ", info);
            for (let pKey in info) {
                const { error } = await (0, backfetcher_1.default)('/leaderboard/updateActivity', "PATCH", {
                    userid: alluser?._id,
                    platformname: alluser.ProgressMatrixes?.[key]?.name,
                    questionType: pKey,
                    solved: info[pKey],
                    date: getFormatedDate(new Date()),
                    score: (0, calculate_1.default)(alluser.ProgressMatrixes?.[key]?.name, info)
                });
                console.log(error);
                // if(error){
                //     return error ;
                // }
            }
        }
    });
};
exports.default = updateAll;
