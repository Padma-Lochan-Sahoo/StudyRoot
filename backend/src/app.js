import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Initialize express
const app = express();

// Middlewares
app.use(cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    }
));
app.get('/',(req,res)=>{
    res.send('Server is running')
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/',(req,res)=>{
    res.send('Server is running')
})


// Import routes
import authRoute from "./routes/auth.route.js";

// routes declaration
app.use("/api/auth", authRoute);

export { app }
