const express = require("express");
const router = new express.Router();
const {pool} = require("./../db/postgres");

router.post("/ndhs-master/top-countries", async (req, res) => {
    let {governanceId,developmentId,ultimateId,taxonomyId,year} = req.body;
    try {
        const sql = `SELECT 
        governance_types.id as governance_id,
        governance_types.name as governance_name,
        development_types.name as development_name,
        ultimate_fields.name as ultimate_name,
        taxonomies.name as texonomy_name,
        ndhs_master.country_id as country_id,
        countries.name as country_name,
        sum(ndhs_master.score) as score
        from questions
        JOIN governance_types ON governance_types.id = `+governanceId+`
        JOIN development_types ON development_types.id = `+developmentId+`
        JOIN ultimate_fields ON ultimate_fields.id = `+ultimateId+`
        JOIN taxonomies ON taxonomies.id = `+taxonomyId+`
        JOIN ndhs_master ON ndhs_master.question_id = questions.question_id AND ndhs_master.year = `+year+`
        JOIN countries ON countries.id = ndhs_master.country_id
        where questions.development_types_id = development_types.id AND questions.ultimate_fields_id = ultimate_fields.id AND questions.taxonomy_id = taxonomies.id
        GROUP BY governance_types.id,development_types.name,ultimate_fields.name,taxonomies.name,ndhs_master.country_id,countries.name
        ORDER BY score DESC LIMIT 5;`

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
