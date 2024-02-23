import express from "express";
import accountRoutes from "./routes/account";
import userRoutes from "./routes/user"
const app = express();

const PORT = 4000;

app.use(express.json());

app.use('/api/v1/account', accountRoutes);
app.use('/api/v1/user', userRoutes);

app.get('/', (req, res) => {
    return res.json({
        message: "Hello from the other side of the world."
    });
});

app.listen(PORT, () => {
    console.log(`Hello from ${PORT}`);
});