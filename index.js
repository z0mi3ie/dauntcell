const express = require('express');
require('dotenv').config()

const { Pool } = require('pg')

const { validateQueryParametersMiddleware } = require('./middleware')
const { buildWhereClause } = require('./sqlhelpers');

const app = express();
const APP_PORT = process.env.APP_PORT;

const PG_USER = process.env.PG_USER;
const PG_PASSWORD = process.env.PG_PASSWORD;
const PG_HOST = process.env.PG_HOST;
const PG_PORT = process.env.PG_PORT;
const PG_DATABASE = process.env.PG_DATABASE;

const pool = new Pool({
    user: PG_USER,
    host: PG_HOST,
    database: PG_DATABASE,
    password: PG_PASSWORD,
    port: PG_PORT,
})

const getCell = (req, res) => {
    const {whereStatement, whereValues} = buildWhereClause(req.query)
    pool.query(whereStatement, whereValues, (err, results) => {
        if (err) {
            res.status(400).json(err); 
            return;
        }
        res.status(200).json(results.rows);
    });
}


app.use(validateQueryParametersMiddleware);

app.get('/cell', getCell);

app.listen(APP_PORT, () => {
    console.log(`** dauntcell API listening on ${APP_PORT}! **`);
});