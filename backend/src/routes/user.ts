import express from "express";
const router = express.Router();

import {bulkSearch, getAllUsers, signin, signup} from "../controllers/user";
import {authMiddleware} from "../middlewares";
// @ts-ignore
router.post('/signup', signup);
// @ts-ignore
router.post('/signin', signin);
// @ts-ignore
router.get('/bulk',authMiddleware, bulkSearch)
// @ts-ignore
router.get('users', authMiddleware, getAllUsers)
export default router;