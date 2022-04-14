const { throwError } = require("./helper.utils");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const Note = require("../models/note.model");

dotenv.config();

const generateTokens = async (user) => {
  try {
    if (!user) {
      throwError("user does not exist.");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

    const accessToken = jwt.sign({ userId: user }, accessTokenSecret, {
      expiresIn: accessTokenExpiry,
    });

    const refreshToken = jwt.sign({ userId: user }, refreshTokenSecret, {
      expiresIn: refreshTokenExpiry,
    });

    const tokenData = {
      accessToken,
      refreshToken,
    };

    return tokenData;
  } catch (error) {
    throwError(error.message, error.code);
  }
};

const generateAccessToken = async (user) => {
  try {
    if (!user) {
      throwError("user does not exist.");
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;

    const accessToken = await jwt.sign({ userId: user }, accessTokenSecret, {
      expiresIn: accessTokenExpiry,
    });

    const tokenData = {
      accessToken,
    };

    return tokenData;
  } catch (error) {
    throwError(error.message, error.code);
  }
};

module.exports = {
  generateTokens,
  generateAccessToken,
};
