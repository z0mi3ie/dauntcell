// Load the current cell information into memory
const yaml = require('js-yaml');
const fs = require('fs');

const Cell = require('../models/Cell');
const Level = require('../models/Level');
const uuidv4 = require('uuid/v4');

let cellsFilePath = './createdb/cells.yml';
let cells = [];
let levels = [];
try {
    var doc = yaml.safeLoad(fs.readFileSync(cellsFilePath), 'utf8');
    doc.forEach(element => {
        let levels_id = uuidv4();
        cells.push(new Cell(
            element.name,
            element.description,
            element.type,
            levels_id,
        ));
        element.levels.forEach( (level, ii) => {
            levels.push(new Level(
                levels_id,
                // Note:
                // Levels are not 0 indexed in game :)
                // Going to save them in db as [1-6]
                ii+1,
                level
            ));
        });
    });
} catch (e) {
    console.log(e);
}

console.log(`Loaded ${cells.length} cells`);
console.log(`Loaded ${levels.length} levels`);

// Load the cells into a sqlite database (in memory dev)
//const sqlite3 = require('sqlite3');
const sqlite3 = require('sqlite-async');

const initializeDatabase = async () => {
    let db = null;
    try {
        db = await sqlite3.open('./db/dauntcell.db');
    } catch (error) {
        console.log(error)
    }

    try {
        await db.run(`
        CREATE TABLE cells(
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            type TEXT NOT NULL,
            levels_id TEXT NOT NULL
        );
        `); 
    } catch (error) {
        console.log(error)
    }
    cells.forEach( async (element) => {
        try {
            await db.run(`
                INSERT INTO cells (name, description, type, levels_id)
                VALUES (?, ?, ?, ?);
            `, element.name, element.description, element.type, element.levels_id);
        } catch (error) {
            console.log(error);
        }
    });

    try {
        await db.run(`
            CREATE TABLE levels(
                levels_id TEXT NOT NULL,
                level INTEGER NOT NULL,
                description TEXT NOT NULL
            );
        `);
    } catch (error) {
        console.log(error);
    }

    levels.forEach( async (element) => {
        try {
            await db.run(`
                INSERT INTO levels (levels_id, level, description)
                VALUES (?, ?, ?);
            `, element.levels_id, element.level, element.description);
        } catch (error) {
            console.log(error);
        }
    });

    try {
        await db.close();
    } catch (error) {
        console.log(error);
    }
    console.log('database closed')
}

initializeDatabase();