// Load the current cell information into memory
const yaml = require('js-yaml');
const fs = require('fs');

const CellPg = require('../models/CellPg');

let cellsFilePath = './createdb/cells.yml';
let cells = [];
try {
    var doc = yaml.safeLoad(fs.readFileSync(cellsFilePath), 'utf8');
    doc.forEach(element => {
        cells.push(new CellPg(
            element.name,
            element.description,
            element.type,
            element.levels,
        ));
    });
} catch (e) {
    console.log(e);
}

console.log(`Loaded ${cells.length} cells`);

const pg = require("pg");

const client = new pg.Client({
    user: 'docker',
    host: '0.0.0.0',
    database: 'dauntcell',
    password: 'docker',
    port: 5432,
});
client.connect();

/*
console.log(">>> Test Query")
let rows = client.query('SELECT NOW()', (err, res) => {
console.log(err, res)
client.end()
})
console.log(rows);
console.log("<<<")
*/

const sqlCreateTable = `
CREATE TABLE cells(
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    levels_id TEXT NOT NULL
);`

const sqlDropTableIfExists = `
DROP TABLE IF EXISTS dauntcell;
`

const codeAlreadyExists = '42P07'

client.query(sqlDropTableIfExists, (err, res) => {
    if (err) {
        console.log(err);
    }
    console.log(res);
});

client.query(sqlCreateTable, (err, res) => {
    if (err) {
        console.log(err);
    }
    console.log(res);
});

