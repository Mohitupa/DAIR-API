const express = require("express");

const mainRouter = require("./routes/mainRoute");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(mainRouter);

app.listen(port, () => {
  console.log("server is listening at " + port);
});
