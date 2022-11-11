const express = require("express");
const router = express.Router();

const countries_controller = require("../controller/countriesController");
const comparative_information_controller = require("../controller/comparativeInformationController");
const governance_controller = require("../controller/governanceController");
const overview_controller = require("../controller/overviewController");
const comparative_controller = require("../controller/comparativeController");
const state_graph_controller = require("../controller/stateGraphController");
const table_chart_controller = require("../controller/tableChartController");
const top_countries_controller = require("../controller/topCountriesController");

router.get("/ndhs-master/country-list", countries_controller.getCountries);
router.get("/ndhs-master/governance-state/:governance_id/:country_id/:year", governance_controller.getGovernace);
router.post("/ndhs-master/comparative-information", comparative_information_controller.getComparativeInfo);
router.post("/ndhs-master/overview", overview_controller.getOverview);
router.post("/ndhs-master/comparative", comparative_controller.getComparative);
router.post("/ndhs-master/state-graph", state_graph_controller.getStateGraph);
router.post("/ndhs-master/table-chart", table_chart_controller.getTableChart);
router.post("/ndhs-master/top-countries", top_countries_controller.getTopCountries);

module.exports = router;