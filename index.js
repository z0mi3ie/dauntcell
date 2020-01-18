const sqlite3 = require('sqlite3');
const DB_SOURCE = './db/dauntcell.db';

let db = new sqlite3.Database(DB_SOURCE, err => {
    if (err) {
        console.log(err);
        throw err;
    }
    console.log(`Created new db from [${DB_SOURCE}]`);
});

const express = require('express');

const app = express();
const port = 3000;

sqlGetAllCellsAndLevels = `
SELECT name, cells.description, type, level, levels.description
FROM cells
INNER JOIN levels
ON cells.levels_id = levels.levels_id;
`

sqlGetAllCellsWithLevelId = `
SELECT name, description, type, levels_id 
`

class Cell {
    constructor(name, description, type, levels) {
        this.name = name;
        this.description = description;
        this.type = type;
        this.levels = levels;
    }
}

app.get('/cell', (req, res) => {
    console.log(req.query);

    let sql = sqlGetAllCellsAndLevels;
    let params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            //res.status(400).json({"error":err.message});
            return;
        }

        let cellData = {};
        rows.forEach(row => {
            console.log(row);
        });
        /*
        res.json({
            "message":"success",
            "data":rows
        })
        */
    });

    res.send({
            hello: "World",
            iam: "json"
        });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});