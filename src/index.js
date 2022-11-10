const express = require("express");

const countriesRouter = require("./routes/countries");
const stateRouter = require("./routes/governance-state");
const overviewRouter = require("./routes/overview");
const infoRouter = require("./routes/comparative-information");
const comparativeRouter = require("./routes/comparative");
const tableRouter = require("./routes/table-chart");
const topRouter = require("./routes/top-countries");
const graphRouter = require("./routes/state-graph");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(countriesRouter);
app.use(stateRouter);
app.use(overviewRouter);
app.use(infoRouter);
app.use(comparativeRouter);
app.use(tableRouter);
app.use(topRouter);
app.use(graphRouter);

app.listen(port, () => {
  console.log("server is listening at " + port);
});
