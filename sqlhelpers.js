
/*
req.query example

{
    name: ["Rage", "Aetherhunter"],
    type: "Power",
} 

final query will look like: SELECT * FROM cells WHERE (name = 'Aetherhunter' OR name = 'Rage') AND type = 'Power';

ii = index of current placed sql param (0)
loop through key and value
    if value is string


*/

function buildMultiValueParam(key, values, currentValuesLength) {
    currentValuesLength++;
    let orString = '';
    values.forEach( (elem, ii) => {
        orString += ` ${key} = \$${currentValuesLength} OR`;
        currentValuesLength++;
    });
    //return [` (${orString.slice(0, ' OR'.length)}) `]
    return [` (${orString.slice(0, -2)}) `]
}

function buildWhereClause(search) {
    let whereStatements = [];
    let valueList = [];

    let ii = 0;
    for (const [key, value] of Object.entries(search)) {
        var sqlEquals;

        // It is a single parameter, just push it on
        if (!Array.isArray(value)) {
            valueList.push(value);
            sqlEquals = `${key} = \$${valueList.length}`
        } else {
            sqlEquals = buildMultiValueParam(key, value, valueList.length);
            console.log('value after call ' + value)
            //valueList.push(value);
            value.forEach( elem => {
               valueList.push(elem);
            });
            console.log('valueList after call ' + valueList)
        }

        // Start the query
        if (ii === 0) {
            whereStatements.push(`WHERE ${sqlEquals}`);
        } else {
            whereStatements.push(`AND ${sqlEquals}`);
        }
        ii += 1;
    }

    let whereString = '';
    whereStatements.forEach( (elem, ii) => {
        whereString += elem
    });

    let builtSql = {
        whereStatement: whereString,
        whereValues: valueList,
    }

    console.log('FINAL SQL STRING: ' + builtSql.whereStatement + 'values: ' + builtSql.whereValues);

    return builtSql
}

/*
let testSearchParams = {
    name: "thisisname",
    type: "typeyeah",
    notAllowed: "shouldnt be there",
    description: "yes",
}

//console.log(buildWhereClause(testSearchParams));

console.log(buildMultiValueParam('name', ['Rage', 'Aetherhunter'], 0));
*/

module.exports = {
    buildWhereClause,
}