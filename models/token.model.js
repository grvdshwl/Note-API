const mongoose = require("./index.js");

const tokenSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  refreshToken: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

const Token = new mongoose.model("token", tokenSchema);

module.exports = Token;
