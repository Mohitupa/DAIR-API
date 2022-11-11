const { pool } = require("./../db/postgres");
const env = require("./../env");

let getStateGraph = async (req, res) => {
    try {
        let { governanceId, developmentId, ultimateId, taxonomyId, countries } = req.body;

        if (env.t.includes(taxonomyId) == false || env.d.includes(developmentId) == false || env.u.includes(ultimateId) == false || env.g.includes(governanceId) == false) {
            return res.status(400).send('Please Provide valid Data.')
        }
        const sql = ` SELECT 
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
        FROM ultimate_fields 
        JOIN countries ON countries.id IN (` + countries + `)
        JOIN governance_types ON governance_types.id IN  ( `+ governanceId + `)
        JOIN taxonomies ON taxonomies.id = `+ taxonomyId + `
        JOIN development_types ON development_types.id = `+ developmentId + `
        JOIN questions ON questions.taxonomy_id = taxonomies.id
        AND questions.ultimate_fields_id = `+ ultimateId + `
        AND questions.development_types_id = development_types.id
        JOIN ndhs_master ON ndhs_master.country_id = countries.id
        AND questions.id = ndhs_master.question_id
        WHERE ultimate_fields.id = `+ ultimateId + `
        GROUP BY ultimate_fields.id,development_types.id,countries.id,taxonomies.id, governance_types.id`;

        pool.query(sql, async (error, results) => {
            if (error || results.rows.length == 0) {
                return res.status(400).send();
            }
            res.status(200).send(results.rows);
        })
    } catch (err) {
        res.status(500).send();
    }
};

module.exports = { getStateGraph };