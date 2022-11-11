const { pool } = require("./../db/postgres");
const env = require("./../env");

let getComparativeInfo = async (req, res) => {
    try {
        let { countries, developmentId, ultimateId, governanceId } = req.body;
        if (env.d.includes(developmentId) == false || env.u.includes(ultimateId) == false || env.g.includes(governanceId) == false) {
            return res.status(400).send('Please Provide valid Data.')
        }
        const sql = `SELECT 
        countries.id AS country_id,
        countries.name AS country_name,
        taxonomies.id AS texonomy_id,
        taxonomies.name AS texonomy_name,
        development_types.name AS development_name,
        ultimate_fields.name AS ultimate_field,
        SUM(ndhs_master.score) AS score,
        ROUND(SUM(ndhs_master.score),10) AS percentage
        FROM ultimate_fields 
        JOIN countries ON countries.id IN (` + countries + `)
        JOIN governance_types ON governance_types.id IN  (`+ governanceId + `)
        JOIN taxonomies ON taxonomies.governance_id = governance_types.id
        JOIN development_types ON development_types.id =  `+ developmentId + `
        JOIN questions ON questions.taxonomy_id = taxonomies.id
        AND questions.ultimate_fields_id = `+ ultimateId + `
        AND questions.development_types_id = development_types.id
        JOIN ndhs_master ON ndhs_master.country_id = countries.id
        AND questions.id = ndhs_master.question_id
        WHERE ultimate_fields.id = `+ ultimateId + `
        GROUP BY ultimate_fields.id,development_types.id,countries.id,taxonomies.id`;

        pool.query(sql, async (error, results) => {
            if (error || results.rows.length == 0) {
                return res.status(400).send();
            }
            res.status(200).send(results.rows);
        })
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {getComparativeInfo};