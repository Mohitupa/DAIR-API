
let transform = async (data,transformBy) => {
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

    const groups = nestGroupsBy(data,transformBy);
    return groups;
}

module.exports = transform;