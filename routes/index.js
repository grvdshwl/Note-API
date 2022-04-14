const express = require("express");
const authRoute = require("../routes/auth");
const noteRoute = require("../routes/note");
const mainRouter = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/note",
    route: noteRoute,
  },
];

defaultRoutes.forEach((route) => {
  mainRouter.use(route.path, route.route);
});

module.exports = {
  mainRouter,
};
