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
    const frontendPath = path.join(__dirname, '..', '..', 'Frontend', 'dist')
    console.log("Frontend path:", frontendPath)  // ← debug log
    
    app.use(express.static(frontendPath))

    app.get('*', (req, res, next) => {       // ← add next parameter
        const indexPath = path.join(frontendPath, 'index.html')
        console.log("Serving index from:", indexPath)  // ← debug log
        res.sendFile(indexPath, (err) => {
            if (err) next(err)               // ← handle error properly
        })
    })
}

module.exports = app