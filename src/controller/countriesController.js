const {pool} = require("./../db/postgres");

let getCountries = async (req, res) => {
    try {
        const sql = "SELECT * FROM countries";
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

module.exports = {getCountries};
