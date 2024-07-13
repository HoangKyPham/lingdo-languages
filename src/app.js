import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import morgan from "morgan"

import userRouter from "./routers/user.js"
import courseRouter from "./routers/course.js"
import unitRouter from "./routers/unit.js"
import lessonRouter from "./routers/lesson.js"
import challengeRouter from "./routers/challenge.js"
import challengeProgressRouter from "./routers/challengeProgress.js"
import challengeOptionRouter from "./routers/challengeOption.js"
import paymentRouter from "./routers/userSubscription.js"

import { connectDB } from "./config/db"

const app = express()
dotenv.config()

// middleware
app.use(express.json())
app.use(cors())
app.use(morgan("tiny"))

// connect DB
connectDB(process.env.DB_URI);

// routes
app.use("/api/v1", userRouter)
app.use("/api/v1", courseRouter)
app.use("/api/v1", unitRouter)
app.use("/api/v1", lessonRouter)
app.use("/api/v1", challengeRouter)
app.use("/api/v1", challengeProgressRouter)
app.use("/api/v1", challengeOptionRouter)
app.use("/api/v1", paymentRouter)



export const viteNodeApp = app;
