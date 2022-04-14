const express = require("express");
const Auth = require("../models/auth.model");
const Token = require("../models/token.model");
const bcrypt = require("bcrypt");
const { generateTokens, generateAccessToken } = require("../utils/token.utils");
const Note = require("../models/note.model");
const { authenticateRefreshToken } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", async (req, res) => {
  res.status(201).send("First auth response.");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const findUser = await Auth.find({ email: email });

  if (!findUser.length) {
    res.status(400).send("User not found");
  } else {
    const dbPassword = findUser[0].password;

    const isPasswordMatching = bcrypt.compareSync(password, dbPassword);

    if (!isPasswordMatching) {
      res.status(400).send("Incorrect Email or password");
    } else {
      const id = findUser[0]._id;
      const tokenData = await generateTokens(id);

      const { refreshToken } = tokenData;

      await Token.create({
        userId: id,
        refreshToken,
      });

      const userNotes = await Note.find({ userId: id });

      const data = {
        token: tokenData,
        data: userNotes,
      };

      res.status(200).json(data);
    }
  }
});

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const findUser = await Auth.find({ email: email });

  if (!!findUser.length) {
    res.status(400).send("User with email already exits");
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = await Auth.create({
      ...req.body,
      password: hashedPassword,
    });
    const id = userData._id;

    const tokenData = await generateTokens(id);

    const { refreshToken } = tokenData;

    await Token.create({
      userId: id,
      refreshToken,
    });

    const userNotes = await Note.find({ userId: id });

    const responseData = {
      token: tokenData,
      data: userNotes,
    };

    res.status(201).json(responseData);
  }
});

router.delete("/logout", authenticateRefreshToken, async (req, res) => {
  try {
    const { userId: id } = req.userId;

    await Token.find({ userId: id }).remove();

    res.status(202).send("User logged out successfully.");
  } catch (error) {
    console.log(error.message);
    res.status(400).send("User not found.");
  }
});

router.get("/generateToken", authenticateRefreshToken, async (req, res) => {
  try {
    const { userId: id } = req.userId;
    const refreshToken = req.headers["authorization"].split(" ")[1];

    const findRefreshToken = await Token.find({ refreshToken: refreshToken });
    console.log(findRefreshToken);

    if (findRefreshToken.length) {
      const token = await generateAccessToken(id);

      res.status(201).json(token);
    } else {
      res.status(400).send("User is not logged in.");
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send("Unable to generate access token.");
  }
});
module.exports = router;
