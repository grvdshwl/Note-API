const mongoose = require("./index")

const validator = require("validator");

const authSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLength:2
    },
    email: {
        type: String,
        trim: true,
        validate(value) {
          if (!validator.isEmail(value)) {
            throw new Error("Invalid email format.");
          }
        },
      },
      password: {
        type: String,
        trim: true,
        min: 8,
        max: 50,
      },
})

const Auth = mongoose.model("Auth",authSchema)

module.exports = Auth;