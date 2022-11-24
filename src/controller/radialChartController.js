const { pool } = require("./../db/postgres");
const env = require("./../env");

let getRedial = async (req, res) => {
    try {
        const sql = `select 
        taxonomies.id as t_id,
        governance_types.id as g_id,
        development_types.id as d_id,
        ultimate_fields.id as u_id,
        taxonomies.name as taxonomy_name,
        governance_types.name as governance_name,
        development_types.name as development_name,
        ultimate_fields.name as ultimate_name
        from development_types 
        JOIN taxonomies ON taxonomies.governance_id = `+ req.params.governanceId + `
        JOIN governance_types ON governance_types.id = taxonomies.governance_id
        JOIN ultimate_fields ON ultimate_fields.development_types_id = development_types.id`;

        pool.query(sql, async (error, results) => {
            if (error || results.rows.length == 0) {
                return res.status(400).send();
            }
            let transformBy = ['governance_name', 'development_name', 'ultimate_name'];
            let c = await transform(results.rows, transformBy);
            let p = await transformRedial(c);
            res.status(200).send(p);
        })
    } catch (err) {
        res.status(400).send(err);
    }
};

let transform = async (data, transformBy) => {
    function nestGroupsBy(arr, properties) {
        properties = Array.from(properties);
        if (properties.length === 1) {
            return groupBy(arr, properties[0]);
        }
        const property = properties.shift();
        var grouped = groupBy(arr, property);
        for (let key in grouped) {
            grouped[key] = nestGroupsBy(grouped[key], Array.from(properties));
        }
        return grouped;
    }

    function groupBy(conversions, property) {
        return conversions.reduce((acc, obj) => {
            let key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    }

    const groups = nestGroupsBy(data, transformBy);
    return groups;
}

let transformRedial = async (data) => {
    let obj = {};
    let obj1 = {};
    let obj2 = {};
    for (const [key, value] of Object.entries(data)) {
        obj = {
            id:  Math.floor((Math.random() * 1000) + 1),
            name: key,
            data: {},
            children: []
        }
        for (const [key1, value1] of Object.entries(value)) {
            obj1 = {
                id:  Math.floor((Math.random() * 1000) + 1),
                name: key1,
                data: {},
                children: []
            }
            for (const [key2, value2] of Object.entries(value1)) {
                let l = value2.length
                obj2 = {
                    id:  Math.floor((Math.random() * 1000) + 1),
                    name: key2,
                    data: {
                        t_id: value2[l - 1].t_id,
                        d_id: value2[l - 1].d_id,
                        g_id: value2[l - 1].g_id,
                        u_id: value2[l - 1].u_id,
                    },
                    children: []
                }
                for (const [key3, value3] of Object.entries(value2)) {

                    obj2.children.push({
                        id:  Math.floor((Math.random() * 1000) + 1),
                        name: value3.taxonomy_name,
                        data: {
                            t_id: value3.t_id,
                            d_id: value3.d_id,
                            g_id: value3.g_id,
                            u_id: value3.u_id,
                        }
                    })
                }
                obj1.data = obj2.data;
                obj1.children.push(obj2)
            }
            obj.data = obj1.data;
            obj.children.push(obj1)
        }
    }
    return obj;
}

module.exports = { getRedial };