const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? false
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
    // __dirname is Backend/src, so go up twice to reach root, then Frontend/dist
    const frontendPath = path.join(__dirname, '..', '..', 'Frontend', 'dist')
    
    app.use(express.static(frontendPath))

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'))
    })
}

module.exports = app