const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(express.json())
app.use(cookieParser())

// ✅ Fixed CORS: Allow same-origin in production (no origin header needed)
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? true  // Reflects the request origin, needed for credentials
        : "http://localhost:5173",
    credentials: true
}))

const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

if (process.env.NODE_ENV === 'production') {
    let frontendPath = path.join(process.cwd(), '..', 'Frontend', 'dist')
    
    if (!fs.existsSync(frontendPath)) {
        frontendPath = path.join(process.cwd(), 'Frontend', 'dist')
    }
    
    console.log("Frontend path:", frontendPath)

    app.use(express.static(frontendPath))

    // ✅ Fixed: Use regex instead of Express 5 syntax
    app.get(/.*/, (req, res) => {
        if (req.url.startsWith('/api')) {
            return res.status(404).json({ error: 'Not found' })
        }
        res.sendFile(path.join(frontendPath, 'index.html'))
    })
}

module.exports = app  // ✅ Fixed: proper export