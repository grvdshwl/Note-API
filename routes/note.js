const express = require("express");
const {
  authenticateAccessToken,
  isAuthorised,
} = require("../middleware/auth.middleware");
const Note = require("../models/note.model");

const router = express.Router();

router.post("/create", authenticateAccessToken, async (req, res) => {
  try {
    const { userId } = req.userId;
    const { body } = req;
    const { description, title } = body;

    const modifiedDescription = {
      value: description,
    };

    const saveNote = await Note.create({
      title,
      description: modifiedDescription,
      userId,
    });

    res.status(201).json(saveNote);
  } catch (error) {
    console.log(error.message);
    res.status(400).send("error in creating note.");
  }
});

router.delete(
  "/delete",
  authenticateAccessToken,
  isAuthorised,
  async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        res.status(400).send("please provide a valid note id.");
      }

      await Note.deleteOne({ _id: id });

      res.status(202).send("Note deleted successfully");
    } catch (error) {
      res.status(400).send("Unable to delete note");
    }
  }
);

router.post(
  "/update",
  authenticateAccessToken,
  isAuthorised,
  async (req, res) => {
    try {
      const { id } = req.query;

      const { title, description } = req.body;

      if (!id) {
        res.status(400).send("please provide a valid note id.");
      }

      const updatedTitle = title && title;
      const updatedDescription = description && description;
      const FindNote = await Note.findOne({ _id: id }).exec();

      if (updatedTitle) {
        FindNote.title = updatedTitle;
      }
      if (updatedDescription) {
        FindNote["description"].value = updatedDescription;
        FindNote["description"].isDone = false;
      }

      const updatedNote = await FindNote.save();

      res.status(202).json(updatedNote);
    } catch (error) {
      console.log(error);
      res.status(400).send("Unable to update note.");
    }
  }
);

router.get(
  "/markDone",
  authenticateAccessToken,
  isAuthorised,
  async (req, res) => {
    try {
      const { id } = req.query;

      if (!id) {
        res.status(400).send("please provide a valid note id.");
      }

      const FindNote = await Note.findOne({ _id: id }).exec();
      const isNotMarkedDone = !FindNote["description"].isDone;

      if (isNotMarkedDone) {
        FindNote["description"].isDone = true;

        const updatedNote = await FindNote.save();

        res.status(202).json(updatedNote);
      } else {
        res.status(202).send("Note is already marked as done.");
      }
    } catch (error) {
      console.log(error);
      res.status(400).send("Unable to mark note as done.");
    }
  }
);

module.exports = router;
