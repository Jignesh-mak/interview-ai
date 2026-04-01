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

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

if (process.env.NODE_ENV === 'production') {
    // process.cwd() = /opt/render/project/src (the repo root on Render)
    const frontendPath = path.join(process.cwd(), 'Frontend', 'dist')
    console.log("Frontend path:", frontendPath)

    app.use(express.static(frontendPath))

    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendPath, 'index.html'))
    })
}

module.exports = app