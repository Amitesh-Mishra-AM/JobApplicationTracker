import express from "express"
import authRoutes from "./src/routes/authRoutes.js";
import applicationRoutes from "./src/routes/applicationRoutes.js"

const app= express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res)=>{
    res.send("Hello from backend")
})

export default app;