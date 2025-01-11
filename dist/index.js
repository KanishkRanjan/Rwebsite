"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./connection");
const generateObject_1 = __importDefault(require("./utils/generateObject"));
const updateall_1 = __importDefault(require("./utils/updateall"));
const backfetcher_1 = __importDefault(require("./utils/backfetcher"));
const errorhandler_middleware_1 = __importDefault(require("./utils/middlewares/errorhandler.middleware"));
const responder_middleware_1 = __importDefault(require("./utils/middlewares/responder.middleware"));
const apiRoutes = require("./routes/api"); // API routes
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT || 3000);
const USERNAME = process.env.USERNAME || "kanishk";
const PASSWORD = process.env.PASSWORD || "letmein";
// Middleware setup
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
}));
// View engine setup
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "../views"));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isLoggedIn) {
        return next();
    }
    res.redirect("/login");
}
// Routes
app.use("/api", apiRoutes); // Include API routes
app.get("/login", (req, res) => {
    res.render("login", { title: "Algonauts" });
});
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === USERNAME && password === PASSWORD) {
        req.session.isLoggedIn = true;
        res.redirect("/dashboard");
    }
    else {
        res
            .status(401)
            .send('Invalid credentials. <a href="/login">Try again</a>.');
    }
});
app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("An error occurred while logging out.");
        }
        res.redirect("/login");
    });
});
app.get("/dashboard", isAuthenticated, async (req, res) => {
    const data = await (0, backfetcher_1.default)("/leaderboard/getuserlist");
    res.render("admin/dashboard", {
        message: undefined,
        data: Array.from(data.values()),
    });
});
app.post("/dashboard", isAuthenticated, async (req, res) => {
    const { name, role, leetcode_username, codeforces_username, codechef_username, cses_username } = req.body;
    const generateObject = await (0, generateObject_1.default)(name, role, [
        { platform: "leetcode", username: leetcode_username },
        { platform: "codeforces", username: codeforces_username },
        { platform: "codechef", username: codechef_username },
        { platform: "cses", username: cses_username },
    ]);
    const result = await (0, backfetcher_1.default)("/leaderboard/adduser", "PUT", generateObject);
    if (result.success) {
        console.log("Update Successful:", result);
    }
    else {
        console.error("Error during update:", result.error);
    }
    res.redirect("/dashboard");
});
app.get("/problems", isAuthenticated, async (req, res) => {
    const data = await (0, backfetcher_1.default)("/problems/getproblems/455");
    res.render("admin/problems", { title: "Problem of Day", data });
});
app.post("/problems", isAuthenticated, async (req, res) => {
    const { name, problemIndex, questionLink, contestId, tags, difficulty, date } = req.body;
    await (0, backfetcher_1.default)("/problems/addproblem", "POST", {
        name,
        problemIndex,
        contestId,
        questionLink,
        tags: tags.split(","),
        difficulty,
        date,
    });
    res.redirect("/problems");
});
app.get("/members", async (req, res) => {
    const data = await (0, backfetcher_1.default)("/leaderboard/getuserlist");
    res.render("members", { title: "Algonauts", data });
});
app.get("/", async (req, res) => {
    const data = await (0, backfetcher_1.default)("/problems/getproblems/450005");
    res.render("index", { title: "Algonauts", data });
});
app.get("/rulebook", (req, res) => {
    res.render("rulebook", { title: "Algonauts" });
});
app.get("/leaderboard", async (req, res) => {
    const obj = await (0, backfetcher_1.default)("/leaderboard/getuserlist");
    // console.log(obj);
    res.render("leaderboard", { title: "Algonauts", obj });
});
app.get("/calendar", (req, res) => {
    res.render("calendar", { title: "Algonauts" });
});
app.get("/updateall", isAuthenticated, async (req, res) => {
    await (0, updateall_1.default)();
    res.status(200).send("Update was successful");
});
// Global middlewares
app.use(responder_middleware_1.default);
app.use(errorhandler_middleware_1.default);
// Start the server
app.listen(PORT, "0.0.0.0", async () => {
    await (0, connection_1.connect)();
    console.log(`Server is running on http://localhost:${PORT}`);
});
