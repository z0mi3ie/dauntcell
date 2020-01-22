const express = require('express');

const {Pool} = require('pg')

const {buildWhereClause} = require('./sqlhelpers');

const app = express();
const port = 3000;

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

const getCell = (req, res) => {
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

const { validateQueryParametersMiddleware } = require('./middleware')

app.use(validateQueryParametersMiddleware);

app.get('/cell', getCell);

app.listen(port, () => {
    console.log(`** dauntcell API listening on ${port}! **`);
});