import express from "express"


const app= express();


app.get("/", (req, res)=>{
    res.send("Hello from app")
})

app.get("/home", (req,res)=>{
    res.send("Hello from home")
});


export default app;