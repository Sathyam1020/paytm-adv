import express from "express";
const router = express.Router();

import {getBalance, transfer, getTransactionHistory} from "../controllers/account";
import {authMiddleware} from "../middlewares";
// @ts-ignore
router.get('/balance',authMiddleware, getBalance);
// @ts-ignore
router.post('/transfer',authMiddleware, transfer);
// @ts-ignore
router.get('/history', authMiddleware, getTransactionHistory)

export default router;