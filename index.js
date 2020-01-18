const express = require('express');

const {Cell} = require('./models/CellPg')
const {Pool} = require('pg')

const app = express();
const port = 3000;

// SQL Queries (TODO: move these)
sqlGetCell = `
SELECT * from cells;
`

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

const getCell = (req, res) => {
    console.log(req.query);
    pool.query(sqlGetCell, (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).json(results.rows);
    });
}

app.get('/cell', getCell);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});