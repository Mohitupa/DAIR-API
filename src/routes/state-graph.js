const express = require("express");
const router = new express.Router();
const { pool } = require("./../db/postgres");

router.post("/ndhs-master/state-graph", async (req, res) => {
  let {governanceId,developmentId,ultimateId,taxonomyId,countries} = req.body;
  try {
    const sql = `SELECT
    governance_types.id as governance_id,
    governance_types.name as governance_name,
    development_types.id as development_types_id,
    development_types.name as development_type,
    ultimate_fields.id as ultimate_id,
    ultimate_fields.name as ultimate_field,
    taxonomies.name as taxonomy_name,
    countries.id as country_id,
    countries.name as country_name,
    countries.iso_code,
    sum(ndhs_master.score) as actual_score,
    ROUND(sum(ndhs_master.score),10) as percentage,
    taxonomies.taxonomy_score as Total
    FROM countries
    JOIN governance_types ON governance_types.id = `+ governanceId + `
    JOIN development_types ON development_types.id = `+ developmentId + `
    JOIN ultimate_fields ON ultimate_fields.id = `+ ultimateId + `
    JOIN taxonomies ON taxonomies.id = `+ taxonomyId + `
    JOIN questions ON questions.taxonomy_id = taxonomies.id AND ultimate_fields_id = ultimate_fields.id
    JOIN ndhs_master ON ndhs_master.country_id = countries.id AND ndhs_master.question_id = questions.question_id
    where countries.id in (` + countries + `)
    GROUP BY countries.name,governance_types.id,development_types.id,ultimate_fields.id,taxonomies.name,countries.id,taxonomies.taxonomy_score`;
   
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