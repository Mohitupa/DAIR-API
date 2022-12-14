const { pool } = require("./../db/postgres");
const env = require("./../env");

let getTableChart = async (req, res) => {
    try {
        let { countries, developmentId, ultimateId, taxonomyId } = req.body;
        if (env.t.includes(taxonomyId) == false || env.d.includes(developmentId) == false || env.u.includes(ultimateId) == false) {
            return res.status(400).send('Please Provide valid Data.')
        }
        const sql = `SELECT 
        countries.id as country_id,
        countries.name as country_name,
        development_types.id as development_id,
        development_types.name as development_name,
        ultimate_fields.id as ultimate_id,
        ultimate_fields.name as ultimate_name,
        taxonomies.id as texonomy_id,
        taxonomies.name as texonomy_name,
        indicators.id as indicator_id,
        indicators.name as indicator_name,
        questions.indicator_score as indicator_score,
        question_master.name as question,
        questions.question_score as question_score,
        questions.question_score as actual_score,
        ndhs_master.status as status
        from questions
        JOIN countries ON countries.id IN (` + countries + `)
        JOIN development_types ON development_types.id = `+ developmentId + `
        JOIN ultimate_fields ON ultimate_fields.id = `+ ultimateId + `
        JOIN taxonomies ON taxonomies.id = `+ taxonomyId + `
        JOIN ndhs_master ON ndhs_master.question_id = questions.question_id
        JOIN indicators ON indicators.id = questions.indicator_id
        JOIN question_master ON question_master.id = questions.question_id  
        where questions.development_types_id = development_types.id AND questions.ultimate_fields_id = ultimate_fields.id AND questions.taxonomy_id = taxonomies.id
        GROUP BY countries.id,development_types.id,ultimate_fields.id,taxonomies.id,indicators.id,question_master.name,questions.indicator_score,questions.question_score,ndhs_master.status`;

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

module.exports = { getTableChart };