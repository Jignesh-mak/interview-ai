require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

console.log("Starting server...") // ← add this
console.log("PORT:", PORT)         // ← add this
console.log("MONGO_URI exists:", !!process.env.MONGO_URI) // ← add this

connectToDB()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})