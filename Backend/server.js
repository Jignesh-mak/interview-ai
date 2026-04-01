if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

const app = require("./src/app")  
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("PORT:", PORT)
console.log("MONGO_URI exists:", !!process.env.MONGO_URI)

connectToDB()

app.listen(PORT, '0.0.0.0', () => {  // ✅ Bind to 0.0.0.0 for Render
    console.log(`Server running on port ${PORT}`)
})