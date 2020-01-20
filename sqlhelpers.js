function buildWhereClause(search, allowed) {
    let whereStatements = [];
    let valueList = [];

    let ii = 0;
    for (const [key, value] of Object.entries(search)) {
        if (allowed.includes(key)) {
            valueList.push(value);
            sqlEquals = `${key} = \$${valueList.length}`
            if (ii === 0) {
                whereStatements.push(`WHERE ${sqlEquals}`);
            } else {
                whereStatements.push(`AND ${sqlEquals}`);
            }
            ii += 1;
        }
    }

    let whereString = '';
    whereStatements.forEach( (elem, ii) => {
        whereString += elem
    });

    let builtSql = {
        whereStatement: whereString,
        whereValues: valueList,
    }

    console.log(builtSql);
    return builtSql
}

/*
let testSearchParams = {
    name: "thisisname",
    type: "typeyeah",
    notAllowed: "shouldnt be there",
    description: "yes",
}

let allowedParams = [
    'name', 'type', 'description'
];


console.log(buildWhereClause(testSearchParams, allowedParams));
*/

module.exports = {
    buildWhereClause,
}