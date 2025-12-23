import app from "./app.js"
import dotenv from "dotenv"
import connectDb from "./src/config/db.js";

dotenv.config();

connectDb();

const port= process.env.PORT ;

app.listen(port, ()=>{
    console.log(`backend is listening on: http://localhost:${port}`);
    console.log(port);
})