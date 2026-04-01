if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()  
}
const app = require("./src/app")
const connectToDB = require("./src/config/database")

const PORT = process.env.PORT || 3000

console.log("Starting server...") 
console.log("PORT:", PORT)        
console.log("MONGO_URI exists:", !!process.env.MONGO_URI) 

connectToDB()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})