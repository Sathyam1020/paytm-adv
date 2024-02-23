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
exports.getTransactionHistory = exports.transfer = exports.getBalance = void 0;
const db_config_1 = __importDefault(require("../db.config"));
const getBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const account = yield db_config_1.default.account.findFirst({
            where: {
                userId: userId
            }
        });
        return res.json({
            balance: account.balance
        });
    }
    catch (e) {
        console.log(e);
        return res.json({
            success: false,
            message: "Couldn't fetch user balance."
        });
    }
});
exports.getBalance = getBalance;
const getTransactionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const transactions = yield db_config_1.default.transaction.findMany({
            where: {
                userId: userId
            }
        });
        return res.json({
            transactions
        });
    }
    catch (e) {
        console.log(e);
        return res.json({
            success: false,
            message: "Couldn't find any transactions"
        });
    }
});
exports.getTransactionHistory = getTransactionHistory;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const amount = req.body.amount;
    const to = req.body.to;
    if (to === req.userId) {
        throw new Error("Not valid");
    }
    try {
        yield db_config_1.default.$transaction(() => __awaiter(void 0, void 0, void 0, function* () {
            // Fetch sender's account
            const senderAccount = yield db_config_1.default.account.findFirst({
                where: {
                    userId: req.userId
                }
            });
            if (!senderAccount || senderAccount.balance < amount) {
                throw new Error("Insufficient balance");
            }
            // Fetch recipient's account
            const recipientAccount = yield db_config_1.default.account.findFirst({
                where: {
                    userId: to
                }
            });
            if (!recipientAccount) {
                throw new Error("Invalid recipient account");
            }
            // Deduct amount from sender's account
            yield db_config_1.default.account.update({
                where: {
                    id: senderAccount.id
                },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });
            // Add amount to recipient's account
            yield db_config_1.default.account.update({
                where: {
                    id: recipientAccount.id
                },
                data: {
                    balance: {
                        increment: amount
                    }
                }
            });
            // Log transaction
            yield db_config_1.default.transaction.createMany({
                data: [
                    {
                        userId: req.userId,
                        accountId: senderAccount.id,
                        amount: -amount,
                        description: `Transferred ${amount} to ${to}`
                    },
                    {
                        userId: to,
                        accountId: recipientAccount.id,
                        amount: amount,
                        description: `Received ${amount} from ${req.userId}`
                    }
                ]
            });
        }));
        res.json({
            message: "Transfer successful"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Transfer failed",
        });
    }
});
exports.transfer = transfer;
