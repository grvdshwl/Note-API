const mongoose = require("./index");

const itemSchema = mongoose.Schema({
  value: { type: String, required: true },
  isChecked: {
    type: Boolean,
    default: false,
  },
});

const todoSchema = mongoose.Schema({
  todos: [
    {
      value: String,
      isChecked: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Todo = new mongoose.model("Todo", todoSchema);

module.exports = {
  Todo,
};
