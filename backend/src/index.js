import express from "express"
// provide us lot of different features to make api quickly and efficiently, it will give us routes, middleware, etc.

import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import friendRoutes from "./routes/friend.route.js"
import { connectDB } from "./lib/db.js"
import cors from "cors";
import { app, io, server } from "./lib/socket.js"
import path from "path";

dotenv.config()

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))
//allow you to extract the json data out of body
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.options('*', cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/friends", friendRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get('*', (req,res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html" ));
    })
}

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDB()
});