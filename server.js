const express = require("express");
const dotenv = require("dotenv");
const app = express();
const { mainRouter } = require("./routes/index.js");

dotenv.config();
const port = process.env.PORT;

app.use(express.json());
app.use(mainRouter);

app.listen(port, () => {
  console.log(`Server is running at port ${port}.`);
});
