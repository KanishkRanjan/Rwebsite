"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertDemoData = exports.getuserlist = exports.deleteUser = exports.updateActivity = exports.increaseflaguser = exports.addUser = void 0;
const custom_error_1 = __importDefault(require("../utils/error/custom.error"));
const user_validator_1 = __importDefault(require("../utils/validators/user.validator"));
const user_model_1 = __importDefault(require("../models/user.model"));
const responder_1 = __importDefault(require("../utils/responder"));
const platforms = ["codechef", "codeforces", "leetcode", "cses"];
const addUser = async (req, res, next) => {
    const body = req.body;
    if (!body.name) {
        const error = new custom_error_1.default("Name was not provided", 400);
        next(error);
        return;
    }
    if (!body.post) {
        const error = new custom_error_1.default("Post was not provided", 400);
        next(error);
        return;
    }
    const { error } = user_validator_1.default.validate(body);
    // console.log(error);
    for (const key in body.ProgressMatrixes) {
        if (body.ProgressMatrixes[key].aggregatedSolveCounts.total == undefined) {
            next(new custom_error_1.default(`Total aggregated count was not provide in ${key}`, 400));
            return;
        }
    }
    if (error) {
        const err = new custom_error_1.default("Validation failed", 400);
        next(err);
        return;
    }
    const newUser = new user_model_1.default(req.body);
    await newUser.save().then(() => {
        const msg = new responder_1.default("User created succesfuly!", 201);
        next(msg);
    });
};
exports.addUser = addUser;
const increaseflaguser = async (req, res, next) => {
    if (!req.body.userid) {
        const err = new custom_error_1.default("User ID was not provided", 400);
        next(err);
    }
    else {
        await user_model_1.default.findByIdAndUpdate(req.body.userid, { $inc: { flag: 1 } })
            .then(() => {
            const msg = new responder_1.default("User's flag value was increased by one", 201);
            next(msg);
        })
            .catch(() => {
            const err = new custom_error_1.default("Something went wrong while updating", 400);
            next(err);
        });
    }
};
exports.increaseflaguser = increaseflaguser;
const getFormatedDate = (date) => date.toISOString().split("T")[0];
const updateActivity = async (req, res, next) => {
    const { userid, platformname, score, date, questionType, solved, } = req.body;
    if (!userid ||
        !platformname ||
        !questionType ||
        solved === undefined ||
        !score) {
        next(new custom_error_1.default("All fields (userid, platformname, questionType, solved) are required.", 400));
        return;
    }
    const platformKey = platformname.toLowerCase();
    const updateDate = date || getFormatedDate(new Date());
    try {
        const user = await user_model_1.default.findById(userid);
        if (!user) {
            next(new custom_error_1.default("User not found.", 404));
            return;
        }
        if (!user.ProgressMatrixes || !user.ProgressMatrixes.has(platformKey)) {
            next(new custom_error_1.default(`Platform '${platformname}' does not exist for this user.`, 400));
            return;
        }
        const platform = user.ProgressMatrixes.get(platformKey);
        //Improve this
        if (!platform)
            throw "Didn't find that platform";
        platform.DailyUserActivity = platform.DailyUserActivity || new Map();
        if (!platform.DailyUserActivity.has(updateDate)) {
            platform.DailyUserActivity.set(updateDate, {
                easy: 0,
                medium: 0,
                hard: 0,
                total: 0,
            });
        }
        const activity = platform.DailyUserActivity.get(updateDate);
        console.log("This is activity: ", activity);
        if (activity) {
            if (!["easy", "medium", "hard", "total"].includes(questionType)) {
                next(new custom_error_1.default("Invalid question type. ", 400));
                return;
            }
            //verify this
            // const previousActivity = Array.from(platform.DailyUserActivity.entries())
            //   .filter(([activityDate]) => activityDate < updateDate)
            //   .sort(([a], [b]) => (a > b ? -1 : 1))[0]?.[1] || { easy: 0, medium: 0, hard: 0, total: 0 };
            // const previousSolved = previousActivity[questionType as keyof IDailyUserActivity] || 0;
            const currentSolveCount = platform.aggregatedSolveCounts.get(questionType) || 0;
            const difference = solved - currentSolveCount + (activity[questionType] || 0);
            if (difference < 0) {
                next(new custom_error_1.default("solved is negative", 400));
                return;
            }
            platform.aggregatedSolveCounts.set(questionType, solved);
            activity[questionType] = difference;
            platform.score = score;
            await user.save();
            next(new responder_1.default("Activity updated successfully.", 200));
        }
        else {
            next(new custom_error_1.default("Failed to initialize or update the DailyUserActivity.", 500));
        }
        return;
    }
    catch (error) {
        next(new custom_error_1.default("An error occurred while updating activity.", 500));
    }
};
exports.updateActivity = updateActivity;
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const deletedUser = await user_model_1.default.findByIdAndDelete(userId);
        if (!deletedUser) {
            return next(new custom_error_1.default("User was not found in Database", 400));
        }
        return next(new responder_1.default("User deleted successfully", 200));
    }
    catch (error) {
        console.error("Error during user deletion:", error);
        return next(new custom_error_1.default("User was not found in Database", 500));
    }
};
exports.deleteUser = deleteUser;
const getuserlist = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 1000;
        const skip = parseInt(req.query.skip) || 0;
        const sortBy = req.query.sortBy;
        let sortProperty;
        if (!sortBy) {
            sortProperty = `score`;
        }
        else if (platforms.includes(sortBy)) {
            sortProperty = `ProgressMatrixes.${sortBy}.score`;
        }
        else {
            next(new custom_error_1.default("Platform doesn't exist in db", 401));
            return;
        }
        const sortedUsers = await user_model_1.default.aggregate([
            {
                $sort: {
                    [sortProperty]: -1,
                },
            },
            // {
            //   $project: {
            //     name: 1,
            //     "ProgressMatrixes.codechef.aggregatedSolveCounts.total": 1,
            //   },
            // },
        ]);
        res.status(200).json(sortedUsers);
    }
    catch (error) {
        next(new custom_error_1.default("Error fetching users", 500));
    }
};
exports.getuserlist = getuserlist;
const insertDemoData = async (req, res, next) => {
    next(new responder_1.default("This Feature is shut due to safety", 401));
    return;
    function generateRandomObject() {
        const platforms = [
            "codechef",
            "codeforces",
            "leetcode",
            "hackerrank",
            "atcoder",
        ];
        const names = [
            "John",
            "Emma",
            "Oliver",
            "Ava",
            "William",
            "Sophia",
            "James",
            "Mia",
        ];
        const usernames = [
            "CodeMaster",
            "TechWizard",
            "ProgPro",
            "CodeQueen",
            "DevDude",
        ];
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
        const progressMatrixes = {};
        for (const platform of platforms) {
            const aggregatedSolveCounts = {};
            const dailyUserActivity = {};
            const randomDate = new Date(Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
            const year = randomDate.getFullYear();
            const month = String(randomDate.getMonth() + 1).padStart(2, "0");
            const day = String(randomDate.getDate()).padStart(2, "0");
            const formattedDate = `${year}-${month}-${day}`;
            aggregatedSolveCounts.total = Math.floor(Math.random() * 100);
            aggregatedSolveCounts.easy = Math.floor(Math.random() * 50);
            aggregatedSolveCounts.medium = Math.floor(Math.random() * 30);
            aggregatedSolveCounts.hard = Math.floor(Math.random() * 20);
            dailyUserActivity[formattedDate] = {
                total: Math.floor(Math.random() * 20),
                easy: Math.floor(Math.random() * 10),
                medium: Math.floor(Math.random() * 5),
                hard: Math.floor(Math.random() * 3),
            };
            progressMatrixes[platform] = {
                name: platform,
                username: `${randomUsername}_${platform}`,
                aggregatedSolveCounts,
                DailyUserActivity: dailyUserActivity,
                score: Math.floor(Math.random() * 200),
            };
        }
        return {
            name: randomName,
            post: "Moderator",
            flag: 1,
            ProgressMatrixes: progressMatrixes,
            score: Math.floor(Math.random() * 500),
        };
    }
    // Example usage:
    // await obje.forEach(async (sobj) => {
    for (let i = 0; i < 20; i++) {
        const randomData = generateRandomObject();
        const { error } = user_validator_1.default.validate(randomData);
        console.log(error);
        const newUser = new user_model_1.default(randomData);
        await newUser.save().then(() => {
            const msg = new responder_1.default("Demo data inserted", 201);
            next(msg);
        });
        console.log(randomData);
    }
    // })
};
exports.insertDemoData = insertDemoData;
// ProgressMatrixSchema.virtual('score').get(function (this: IProgressMatrix){
//     // console.log(this);
//     let score : number = 0 ;
//     if(this.name == 'codechef' ){
//       score += codechefCalculation(this.aggregatedSolveCounts);
//     }
//     else if(this.name == 'codeforces' ){
//       score += codeforcesCalculation(this.aggregatedSolveCounts);
//     }
//     else if(this.name == 'leetcode' ){
//       score += leetcodeCalculation(this.aggregatedSolveCounts);
//     }
//     else {
//       score += this.aggregatedSolveCounts.get('total')||0 ;
//     }
//     return score;
//   })
//   ProgressMatrixSchema.set('toJSON', { virtuals: true });
//   ProgressMatrixSchema.set('toObject', { virtuals: true });
//   UserSchema.virtual('score').get(function (this: IUser) {
//     let totalScore : number = 0;
//     if (this.ProgressMatrixes) {
//       this.ProgressMatrixes.forEach((progressMatrix) => totalScore += progressMatrix.score || 0 );
//     }
//     return totalScore;
//   });
//   UserSchema.set('toJSON', { virtuals: true });
//   UserSchema.set('toObject', { virtuals: true });
// https://github.com/nst-sdc/testBackEnd/tree/main
