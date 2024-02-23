"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = __importDefault(require("./routes/account"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const PORT = 4000;
app.use(express_1.default.json());
app.use('/api/v1/account', account_1.default);
app.use('/api/v1/user', user_1.default);
app.get('/', (req, res) => {
    return res.json({
        message: "Hello from the other side of the world."
    });
});
app.listen(PORT, () => {
    console.log(`Hello from ${PORT}`);
});
