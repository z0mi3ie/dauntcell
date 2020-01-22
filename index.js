const express = require('express');

const {Cell} = require('./models/CellPg')
const {Pool} = require('pg')

const {buildWhereClause} = require('./sqlhelpers');

const app = express();
const port = 3000;

// SQL Queries (TODO: move these)
sqlGetAllCells = `
SELECT * FROM cells;
`
sqlGetCellsByType = `
SELECT * FROM cells WHERE type = $1;
`

function sqlByType() {
    return `WHERE type = `
}

function sqlByName(name) {
    return `WHERE `
}

// DB Connection Info (TODO: move these)
const PG_USER = 'docker'
const PG_PASSWORD = 'docker'
const PG_HOST = '127.0.0.1'
const PG_PORT = '5432'
const PG_DATABASE = 'dauntcell'

const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT,
})

class DauntcellError {
    constructor(responseCode, message) {
        this.responseCode = responseCode;
        this.message = message;
    }
}

function getInvalidParams(req) {
    const validParams = ['name', 'type', 'description']
    let invalidFound = []
    console.log(req.query)
    console.log(Object.keys(req.query))
    Object.keys(req.query).forEach( elem => {
        //console.log(elem)
        if (!validParams.includes(elem)) {
            invalidFound.push(elem)
        }
    });
    return invalidFound;
}

function validateParams(req) {
    let invalidParams = getInvalidParams(req);
    if (invalidParams.length > 0) {
        return new DauntcellError(400, `Invalid query parameter(s) sent: [${invalidParams}]`);
    }
    return null;
}

const getCell = (req, res) => {
    let invalidParams = validateParams(req);
    if (invalidParams != null) {
        res.status(invalidParams.responseCode).json(
            invalidParams.message
        );
        return;
    }

    const {whereStatement, whereValues} = buildWhereClause(req.query)
    const completeQuery = 'SELECT * FROM cells ' + whereStatement + ';'
    pool.query(completeQuery, whereValues, (err, results) => {
        if (err) {
            res.status(400).json(err);
            return;
        }
        res.status(200).json(results.rows);
    });
}

app.get('/cell', getCell);

app.listen(port, () => {
    console.log(`** dauntcell API listening on ${port}! **`);
});