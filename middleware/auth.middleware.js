const { throwError } = require("../utils/helper.utils");
const jwt = require("jsonwebtoken");
const Note = require("../models/note.model");

const authenticateAccessToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      throwError("please provide a valid token.");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    const userId = jwt.verify(token, accessTokenSecret);

    req.userId = userId;
    next();
  } catch (error) {
    throwError(error.message, error.status);
    res.send("Access Token Expired");
  }
};

const authenticateRefreshToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      throwError("please provide a valid token.");
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    const userId = jwt.verify(token, refreshTokenSecret);

    req.userId = userId;
    next();
  } catch (error) {
    throwError(error.message, error.code);
    res.send("Refresh Token expired");
  }
};

const isAuthorised = async (req, res, next) => {
  try {
    const { userId } = req.userId;

    const findNote = await Note.find({ _id: req.query.id });

    if (!findNote.length) {
      res.status(400).send("Note not found with provided ID.");
    } else {
      const hasAuthority = findNote[0].userId.toString() === userId;

      if (!hasAuthority) {
        res.status(400).send("Unauthorised user cannot edit/delete note.");
      } else {
        next();
      }
    }
  } catch (error) {
    throwError(error.message, error.status);
  }
};

module.exports = {
  authenticateRefreshToken,
  authenticateAccessToken,
  isAuthorised,
};
