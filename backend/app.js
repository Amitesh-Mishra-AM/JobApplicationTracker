import express from "express"
import authRoutes from "./src/routes/authRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js"
import cors from "cors"

const app= express();

app.use(express.json());
app.use(cors({
    origin:[
        "http://localhost:5173",
        "https://your-frontend-name.vercel.app"
    ],
    credentials:true
}));
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res)=>{
    res.send("Hello from backend")
})

export default app;