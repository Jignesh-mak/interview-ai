const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(express.json())
app.use(cookieParser())

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? undefined
        : "http://localhost:5173",
    credentials: true
}))

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// API routes FIRST
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

// Production: serve frontend
if (process.env.NODE_ENV === 'production') {
    let frontendPath = path.join(process.cwd(), '..', 'Frontend', 'dist')
    
    if (!fs.existsSync(frontendPath)) {
        frontendPath = path.join(process.cwd(), 'Frontend', 'dist')
    }
    if (!fs.existsSync(frontendPath)) {
        frontendPath = path.join(process.cwd(), 'dist')
    }
    
    console.log("Frontend path:", frontendPath)
    console.log("Exists:", fs.existsSync(frontendPath))

    app.use(express.static(frontendPath))

    // ✅ Regex catch-all (compatible with all Express/path-to-regexp versions)
    app.get(/.*/, (req, res) => {
        if (req.url.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' })
        }
        res.sendFile(path.join(frontendPath, 'index.html'))
    })
}

module.exports = app