const express = require("express");
const router = new express.Router();
const {pool} = require("./../db/postgres");
const env = require("./../env");

router.post("/ndhs-master/comparative-information", async (req, res) => {
    try {
        let {countries,developmentId,ultimateId,governanceId} = req.body;
        if(env.d.includes(developmentId) == false || env.u.includes(ultimateId) == false || env.g.includes(governanceId) == false) {
            return res.status(400).send('Please Provide valid Data.')
        }
        const sql = `SElECT 
        countries.id AS country_id,
        countries.name AS country_name,
        taxonomies.id AS texonomy_id,
        taxonomies.name AS texonomy_name,
        development_types.name AS development_name,
        ultimate_fields.name AS ultimate_field,
        SUM(ndhs_master.score) AS score,
        ROUND(SUM(ndhs_master.score),10) AS percentage
        from taxonomies 
        JOIN countries ON countries.id IN (` + countries + `)
        JOIN development_types ON development_types.id = `+developmentId+`
        JOIN ultimate_fields ON ultimate_fields.id = `+ultimateId+`
        JOIN questions ON questions.taxonomy_id = taxonomies.id AND questions.ultimate_fields_id = ultimate_fields.id
        JOIN ndhs_master ON questions.question_id = ndhs_master.question_id AND country_id = countries.id 
        WHERE taxonomies.governance_id = `+governanceId+`
        GROUP BY taxonomies.id,countries.id,development_types.name,ultimate_fields.name`;

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
