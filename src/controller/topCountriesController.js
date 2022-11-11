const { pool } = require("./../db/postgres");
const env = require("./../env");

let getTopCountries = async (req, res) => {
    try {
        let { governanceId, developmentId, ultimateId, taxonomyId, year } = req.body;
        if (env.t.includes(taxonomyId) == false || env.d.includes(developmentId) == false || env.u.includes(ultimateId) == false || env.g.includes(governanceId) == false || env.y.includes(year)) {
            return res.status(400).send('Please Provide valid Data.')
        }
        const sql = `SELECT 
        development_types.name as dt_name,
        countries.id as country_id,
        countries.name as country_name,
        governance_types.id as governance_id,
        governance_types.name as governance_name,
        taxonomies.name as taxonomy_name,
        ultimate_fields.name as ultimate_name,
        Sum(ndhs_master.score) as score
        FROM ultimate_fields 
        JOIN taxonomies ON taxonomies.id = `+ taxonomyId + `
        JOIN governance_types ON governance_types.id = `+ governanceId + `
        JOIN development_types ON development_types.id =  `+ developmentId + `
        JOIN questions ON questions.taxonomy_id = taxonomies.id
        AND questions.ultimate_fields_id = `+ ultimateId + `
        AND questions.development_types_id = development_types.id
        JOIN ndhs_master ON ndhs_master.year IN (`+ year + `)
        AND questions.id = ndhs_master.question_id
        JOIN countries ON countries.id = ndhs_master.country_id
        WHERE ultimate_fields.id = `+ ultimateId + `
        GROUP BY ultimate_fields.id,development_types.id,countries.id,taxonomies.id,
        governance_types.id
        ORDER BY score DESC LIMIT 5`;

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

module.exports = { getTopCountries };