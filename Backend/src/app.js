const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? false                        // same origin in production, no need for CORS
        : "http://localhost:5173",
    credentials: true
}))

/* routes */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* serve frontend in production */
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../Frontend/dist')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../Frontend/dist', 'index.html'))
    })
}

module.exports = app