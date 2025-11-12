import express from "express";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import curuserrouter from "./routes/currentuser.routes.js";
import { geminiresponse } from "./geminiapi.js";
dotenv.config();

const app=express();
app.use(cors({
    origin:"https://virtualaifrontend.onrender.com",
    credentials:true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/user",router)
app.use("/api/cur",curuserrouter)

const port=process.env.PORT||5000;


app.get("/",async(req,res)=>{
    let prompt=req.query.prompt
    let data=await geminiresponse(prompt)

    res.json(data)
})


app.listen(port,()=>{
    connectdb();
    console.log(`server contected at ${port}`)
    

})
