const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

const app = express()

app.use(express.json())
app.use(cookieParser())

// CORS: Allow same origin in prod (no CORS needed), localhost in dev
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? undefined  // Same origin, no CORS headers needed
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
    // Try multiple path strategies for Render
    let frontendPath = path.join(process.cwd(), '..', 'Frontend', 'dist')
    
    // Fallback: try same level (if both in root)
    if (!require('fs').existsSync(frontendPath)) {
        frontendPath = path.join(process.cwd(), 'Frontend', 'dist')
    }
    // Another fallback: if backend is in subdirectory
    if (!require('fs').existsSync(frontendPath)) {
        frontendPath = path.join(process.cwd(), 'dist')
    }
    
    console.log("Frontend path:", frontendPath)
    console.log("Exists:", require('fs').existsSync(frontendPath))

    app.use(express.static(frontendPath))

    // Express 4 compatible wildcard (works on Render)
    app.get('*', (req, res) => {
        // Don't serve index.html for API 404s
        if (req.url.startsWith('/api')) {
            return res.status(404).json({ error: 'API route not found' })
        }
        res.sendFile(path.join(frontendPath, 'index.html'))
    })
}

module.exports = app  // ✅ Fixed: separate line