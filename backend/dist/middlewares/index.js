"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: "Unauthorized: Missing or invalid authorization header." });
    }
    const token = authHeader.split(' ')[1];
    try {
        // @ts-ignore
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
        else {
            return res.status(403).json({ message: "Unauthorized: Invalid token." });
        }
    }
    catch (err) {
        console.error("Authentication error:", err);
        return res.status(403).json({ message: "Unauthorized: Token verification failed." });
    }
};
exports.authMiddleware = authMiddleware;
