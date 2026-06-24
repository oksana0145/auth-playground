import "assert";
import express from 'express';
import authRoutes from './routes/auth.routes.js';
import { connectDB } from './config/db.js';

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
    });
});

app.use("/auth", authRoutes);

app.listen (PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
