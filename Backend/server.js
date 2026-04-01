if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

console.log("Starting server...") 
console.log("PORT:", PORT)        

// Start server first
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`)
})

// Then connect to DB
connectToDB()
    .then(() => console.log("Connected to Database"))
    .catch(err => console.error("DB connection failed:", err))