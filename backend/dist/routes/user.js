"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
// @ts-ignore
router.post('/signup', user_1.signup);
// @ts-ignore
router.post('/signin', user_1.signin);
exports.default = router;
