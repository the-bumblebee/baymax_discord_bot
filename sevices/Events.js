const sqlite3 = require('sqlite3').verbose();

function initTable(dbPath) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
    db.serialize(function() {
        db.run("CREATE TABLE IF NOT EXISTS events ( id INTEGER PRIMARY KEY AUTOINCREMENT, event_name TEXT NOT NULL, date INTEGER NOT NULL, event_description TEXT );");
    });
    db.close();
}

function dropTable(dbPath) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_CREATE | sqlite3.OPEN_READWRITE);
    db.serialize(function() {
        db.run("DROP TABLE IF EXISTS events;");
    });
    db.close();
}

function checkDBConnection(dbPath, errorHandler) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, err => {
        if (err) {
            console.log("Error connecting to database");
        } else {
            console.log("Connection successful");
        }
    });
    db.close();
}

function parse(argString) {
    let addExpr = /add "([^"]+)"/g;
    let onExpr = /on ([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2})/g;
    let addMatch = addExpr.exec(argString);
    let onMatch = onExpr.exec(argString);

    if (!addMatch || !onMatch) {
        return {err: "Incorrect format"};
    }
    let epoch = Date.parse(`${onMatch[2]}/${onMatch[1]}/${onMatch[3]}`);
    if (!epoch || epoch < Date.now()) {
        return {err: "Incorrect date"};
    }

    return { eventName: addMatch[1], date: epoch };
}

function add(dbPath, event, errorHandler) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    db.serialize(function() {
        db.run("INSERT INTO events (event_name, date, event_description) VALUES (?, ?, ?)", [event.eventName, event.date], errorHandler);
    });
    db.close();
}

function getAll(dbPath, rowHandler) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    db.serialize(function() {
        db.all("SELECT * FROM events WHERE date >= ? GROUP BY date, event_name ORDER BY date", [Date.now()], rowHandler);
    });

    db.close();
}

function deleteEntry(dbPath, event, errorHandler) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    db.serialize(function() {
        db.get("DELETE FROM events WHERE event_name = ? and date = ?", [event.event_name, event.date], errorHandler);
    })
    db.close();
}

function cleanUp(dbPath) {
    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE);
    db.serialize(function() {
        db.run("DELETE FROM events WHERE date < ?", [Date.now()], err => {
            if (err) {
                console.log("Error occured when cleaning up.");
            }
        });
    });
    db.close();
}

module.exports = { initTable, dropTable, checkDBConnection, parse, add, deleteEntry, getAll, cleanUp };