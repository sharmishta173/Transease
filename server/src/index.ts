import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import busRoutes from "./routes/buses";
import bookingRoutes from "./routes/bookings";
import errorHandler from "./middleware/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
const allowedOrigins = [
    "http://localhost:5173",
    "https://trans-ease.vercel.app",
    "https://www.trans-ease.vercel.app",
    /https:\/\/trans-ease.*\.vercel\.app$/,
    /https:\/\/.*\.vercel\.app$/,
    "https://transitly-api.onrender.com",
];

import { CorsOptions, CorsRequestCallback } from "cors";

const corsOptions: CorsOptions = {
    origin: ((origin, callback) => {
        if (!origin) return callback(null, true); // allow server-to-server / sandboxed requests
        const allowed = allowedOrigins.some((o) =>
            typeof o === "string" ? o === origin : o.test(origin)
        );
        if (allowed) return callback(null, true);
        return callback(new Error(`CORS: origin ${origin} not allowed`));
    }) as CorsRequestCallback,
    credentials: true,
};

if (process.env.NODE_ENV === "production") {
    app.use(cors(corsOptions));
} else {
    app.use(cors({ origin: true, credentials: true }));
}
app.use(express.json());

// routes
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

// health check route — useful for Render deployment later
app.get("/", (_req, res) => {
    res.json({ message: "TransEase API is running 🚌" });
});

// global error handler — always last 
app.use(errorHandler);

// start server after DB connects
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});

export default app;