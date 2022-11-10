const express = require("express");
const router = new express.Router();
const {pool} = require("./../db/postgres");

router.get("/ndhs-master/country-list", async (req, res) => {
    try {
        const sql = "SELECT * FROM countries";
        pool.query(sql, async (error, results) => {
            if (error || results.rows.length == 0) {
                return res.status(400).send();
            }
            res.status(200).send(results.rows);
        })
    } catch (err) {
        res.status(500).send();
    }
});

module.exports = router;
