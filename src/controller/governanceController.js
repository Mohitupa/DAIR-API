const {pool} = require("./../db/postgres");
const transform = require('./../shared/tranform-object');

let getGovernace = async (req, res) => {
    try {
        let { governance_id, country_id, year } = req.params;
        const sqlndhs = `SELECT 
        Sum(ndhs_master.score) as score,
        taxonomies.id as taxonomy_id,
        taxonomies.name as taxonomy_name,
        development_types.id as development_id,
        development_types.name as development_name,
        ultimate_fields.id as ultimate_id,
        ultimate_fields.name as ultimate_name
        FROM ultimate_fields
        JOIN development_types ON development_types.id = ultimate_fields.development_types_id
        JOIN taxonomies ON taxonomies.governance_id = `+ governance_id + `
        JOIN questions ON questions.taxonomy_id = taxonomies.id AND questions.ultimate_fields_id = ultimate_fields.id AND questions.development_types_id = development_types.id
        JOIN ndhs_master ON ndhs_master.country_id = `+ country_id + ` AND questions.id = ndhs_master.question_id AND ndhs_master.year = ` + year + `
        GROUP BY taxonomies.id,development_types.id,ultimate_fields.id`

        pool.query(sqlndhs, async (error, results) => {
            if (error || results.rows.length == 0) {
                return res.status(400).send();
            }
            let transformBy = ['development_name', 'taxonomy_name']
            let c = await transform(results.rows, transformBy);
            res.status(200).send(c);
        })
    } catch (err) {
        res.status(400).send(err);
    }
};


module.exports = {getGovernace};
