const mongoose = require("./index");

const descriptionSchema = mongoose.Schema({
  value: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  isDone: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
});

const noteSchema = mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
    minLength: 5,
  },
  description: {
    type: descriptionSchema,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Note = new mongoose.model("Note", noteSchema);

module.exports = Note;
