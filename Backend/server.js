if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

const app = require("./src/app")  // or "./app" depending on your structure
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

console.log("NODE_ENV:", process.env.NODE_ENV)
console.log("PORT:", PORT)

connectToDB()

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
})