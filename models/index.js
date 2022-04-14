const dotenv = require("dotenv")
const mongoose = require("mongoose")

dotenv.config();

const dbUrl = process.env.DATABASE_URL

mongoose.connect(`${dbUrl}`)

const db = mongoose.connection

db.on('error',(error)=>console.error("error message",error))

db.once("open",()=>console.log("connected to db."))


module.exports = mongoose;