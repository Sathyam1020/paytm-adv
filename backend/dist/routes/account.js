"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const account_1 = require("../controllers/account");
const middlewares_1 = require("../middlewares");
// @ts-ignore
router.get('/balance', middlewares_1.authMiddleware, account_1.getBalance);
// @ts-ignore
router.post('/transfer', middlewares_1.authMiddleware, account_1.transfer);
// @ts-ignore
router.get('/history', middlewares_1.authMiddleware, account_1.getTransactionHistory);
exports.default = router;
