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
const allowedOrigins: (string | RegExp)[] = [
    "http://localhost:5173",
];

app.use(cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true 
}));
app.use(express.json());

// routes
app.use("/api/buses", busRoutes);
app.use("/api/bookings", bookingRoutes);

// Compatibility: if the frontend accidentally prefixes `/api` twice
// (e.g. `/api/api/buses`), still serve the same endpoints.
app.use("/api/api/buses", busRoutes);
app.use("/api/api/bookings", bookingRoutes);

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