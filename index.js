// Load the current cell information into memory
const yaml = require('js-yaml');
const fs = require('fs');

const Cell = require('./models/cell')

let cellsFilePath = './cells.yml';
let cells = []
try {
    var doc = yaml.safeLoad(fs.readFileSync(cellsFilePath), 'utf8');
    doc.forEach(element => {
        cells.push(new Cell(
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

// Load the cells into a sqlite database (in memory dev)
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory sqlite3 database');
});

// cells table (https://ozh.github.io/ascii-tables/)
// +-------------------+-----------------------------------------------+---------+-----------+
// |       name        |                  description                  |  type   | levels_id |
// +-------------------+-----------------------------------------------+---------+-----------+
// | Assassin's Vigour | Grants Health after breaking a Behemoth part. | Defence |         2 |
// +-------------------+-----------------------------------------------+---------+-----------+
//
// levels table (https://ozh.github.io/ascii-tables/)
// +-----------+-------+---------------------------------+
// | levels_id | level |           description           |
// +-----------+-------+---------------------------------+
// |         2 |     1 | Heal 50 when you break a part.  |
// |         2 |     2 | Heal 100 when you break a part. |
// |         2 |     3 | Heal 150 when you break a part. |
// +-----------+-------+---------------------------------+

db.run(`
CREATE TABLE cells(
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL,
    levels_id INTEGER NOT NULL
);

CREATE TABLE levels(
    levels_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    description TEXT NOT NULL
);
`, (err) => {
    if (err) {
        console.log(err);
    }
});

db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
});