const { pool } = require("./../db/postgres");
const transform = require('./../shared/tranform-object');
const env = require("./../env");

let getOverview = async (req, res) => {
    try { 
        let {countries,governanceId} = req.body;
        if(env.g.includes(governanceId) == false) {
            return res.status(400).send('Please Provide valid Data.')
        }
        const sql = `SELECT
        development_types.name as development_name,
        ultimate_fields.name as ultimate_name,
        taxonomies.name as taxonomy_name,
        indicators.name as indicator_name,
        question_master.name as question,
        countries.id as c_id,
        countries.name as c_name,
        development_types.id as developement_id, 
        ultimate_fields.id as ultimate_field_id,
        countries.id as country_id,
        taxonomies.id as taxonomy_id,
        indicators.id as indicator_id,
        questions.indicator_score as indicator_score,
        questions.id as question_id,
        question_master.name as question_name,
        questions.question_score as question_score,
        ndhs_master.status as status,
        ndhs_master.status as ststus,
        questions.question_score as actual_score
        FROM questions
        JOIN countries ON countries.id in (` + countries + `)
        JOIN development_types ON development_types.id = questions.development_types_id
        JOIN ultimate_fields ON ultimate_fields.id = questions.ultimate_fields_id
        JOIN taxonomies ON taxonomies.id = questions.taxonomy_id
        JOIN indicators ON indicators.id = questions.indicator_id
        JOIN question_master ON question_master.id = questions.question_id
        JOIN ndhs_master ON ndhs_master.id = questions.id
        WHERE taxonomies.governance_id = `+governanceId+``;
        
        pool.query(sql, async (error, results) => {
            if (error || results.rows.length == 0) {
                return res.status(400).send();
            }
            let transformBy = ['development_name', 'ultimate_name', 'taxonomy_name', 'indicator_name', 'question'];
            let c = await transform(results.rows,transformBy);
            res.status(200).send(c);
        })
    } catch (err) {
        res.status(400).send(err);
    }
};

module.exports = {getOverview};