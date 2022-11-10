const express = require("express");
const router = new express.Router();
const { pool } = require("./../db/postgres");

router.post("/ndhs-master/comparative", async (req, res) => {
    let {countries,developmentId} = req.body;
    try {
        const sql = `SELECT 
        governance_types.id as governance_id,
        governance_types.name as governance_name,
        development_types.id as development_id,
        development_types.name as development_name,
        ultimate_fields.id as ultimate_id,
        ultimate_fields.name as ultimate_name,
        countries.name as country,
        CASE WHEN governance_types.id = 1 THEN 500 ELSE 700 END as total,
        Sum(ndhs_master.score) as score,
        round((Sum(ndhs_master.score)*100)/(CASE WHEN governance_types.id = 1 THEN 500 ELSE 700 END),10) as percentage
        FROM ultimate_fields 
        JOIN countries ON countries.id IN  (` + countries + `)
        JOIN governance_types ON governance_types.id IN  (` + developmentId + `)
        JOIN taxonomies ON taxonomies.governance_id = governance_types.id
        JOIN development_types ON development_types.id = ultimate_fields.development_types_id
        JOIN questions ON questions.taxonomy_id = taxonomies.id AND questions.ultimate_fields_id = ultimate_fields.id AND questions.development_types_id = development_types.id
        JOIN ndhs_master ON ndhs_master.country_id = countries.id AND questions.id = ndhs_master.question_id
        GROUP BY ultimate_fields.id,governance_types.id,development_types.id,countries.id`;

        pool.query(sql, async (error, results) => {
            if (error || results.rows.length == 0) {
                return res.status(400).send();
            }
            res.status(200).send(results.rows);
        })
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
