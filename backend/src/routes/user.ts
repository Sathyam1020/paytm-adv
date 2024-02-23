import express from "express";
const router = express.Router();

import {signin, signup} from "../controllers/user";
import {authMiddleware} from "../middlewares";
// @ts-ignore
router.post('/signup', signup);
// @ts-ignore
router.post('/signin', signin);
export default router;