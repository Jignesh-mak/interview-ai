console.log("=== SERVER STARTING ===")
console.log("PORT env:", process.env.PORT)
console.log("NODE_ENV:", process.env.NODE_ENV)

if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

// Start server IMMEDIATELY (don't wait for DB)
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`)
})

server.on('error', (err) => {
    console.error("Server error:", err)
    process.exit(1)
})

// Connect to DB in background
connectToDB()
    .then(() => console.log("✅ DB connected"))
    .catch(err => {
        console.error("❌ DB connection failed:", err.message)
        // Don't exit — let server keep running so we can see errors
    })