"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.bulkSearch = exports.signin = exports.signup = void 0;
const db_config_1 = __importDefault(require("../db.config"));
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    username: zod_1.default.string(),
    password: zod_1.default.string()
});
const signinBody = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string()
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signupBody.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }
        const existingUser = yield db_config_1.default.user.findFirst({
            where: {
                email: req.body.email
            }
        });
        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken"
            });
        }
        // Create user
        const user = yield db_config_1.default.user.create({
            data: {
                email: req.body.email,
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            },
        });
        const userId = user.id;
        // Create account
        yield db_config_1.default.account.create({
            data: {
                userId,
                balance: 10000
            }
        });
        const token = jsonwebtoken_1.default.sign({
            userId
        }, process.env.JWT_SECRET);
        res.json({
            message: "User created successfully",
            token: token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signinBody.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            });
        }
        const user = yield db_config_1.default.user.findUnique({
            where: {
                email: req.body.email,
                password: req.body.password
            }
        });
        if (user) {
            const token = jsonwebtoken_1.default.sign({
                userId: user.id
            }, process.env.JWT_SECRET);
            res.json({
                token: token
            });
            return;
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
});
exports.signin = signin;
const bulkSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = String(req.query.filter || "");
        const users = yield db_config_1.default.user.findMany({
            where: {
                OR: [
                    { firstName: { contains: filter, mode: 'insensitive' } },
                    { lastName: { contains: filter, mode: 'insensitive' } }
                ]
            },
            select: {
                username: true,
                firstName: true,
                lastName: true,
                id: true
            }
        });
        res.json({
            user: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id
            }))
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: `No users found`,
        });
    }
});
exports.bulkSearch = bulkSearch;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_config_1.default.user.findMany({
            select: {
                id: true,
                username: true,
                email: true
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getAllUsers = getAllUsers;
