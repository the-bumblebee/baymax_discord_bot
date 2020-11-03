const Event = require("../models/Event");

function dropTable(connection, errorHandler) {
    if (!isConnected(connection)) {
        let err = "Database ain't connected.";
        errorHandler(err);
        return;
    }
    // (err, result)
    connection.db.dropCollection("Events", errorHandler);
}

function isConnected(connection) {
    if (connection.readyState !== 1) return false;
    else return true;
}

function parse(argString) {
    let addExpr = /add "([^"]+)"/g;
    let onExpr = /on ([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2})/g;
    let addMatch = addExpr.exec(argString);
    let onMatch = onExpr.exec(argString);

    if (!addMatch || !onMatch) {
        return { err: "Incorrect format" };
    }
    let epoch = Date.parse(`${onMatch[2]}/${onMatch[1]}/${onMatch[3]}`);
    if (
        !epoch ||
        epoch < Date.parse(new Date().toLocaleDateString() - 600000)
    ) {
        return { err: "Incorrect date" };
    }

    return { event_name: addMatch[1], date: epoch };
}

function add(connection, eventObj, errorHandler) {
    if (!isConnected(connection)) {
        let err = "Database ain't connected.";
        errorHandler(err);
        return;
    }

    let event = new Event(eventObj);
    event.save().finally(errorHandler);
}

function getAll(connection, callback) {
    if (!isConnected(connection)) {
        let err = "Database ain't connected.";
        callback(err, null);
        return;
    }
    Event.aggregate([
        {
            $match: {
                date: {
                    $gte: Date.parse(new Date().toLocaleDateString()) - 600000,
                },
            },
        },
        {
            $group: {
                _id: {
                    event_name: "$event_name",
                    date: "$date",
                },
            },
        },
        {
            $project: {
                _id: 0,
                event_name: "$_id.event_name",
                date: "$_id.date",
            },
        },
        { $sort: { date: 1, event_name: 1 } },
    ]).then((docs) => callback(null, docs));
}

function deleteEntry(connection, event, errorHandler) {
    if (!isConnected(connection)) {
        errorHandler("Database ain't connected.");
        return;
    }
    Event.deleteMany(event, (err) => {
        console.log(err);
    });
}

function cleanUp(connection, errorHandler) {
    if (!isConnected(connection)) {
        let err = "Database ain't connected.";
        errorHandler(err);
        return;
    }
    Event.deleteMany(
        { date: { $lt: Date.parse(new Date().toLocaleDateString()) - 600000 } },
        (err) => {
            if (err) errorHandler(err);
        }
    );
}

module.exports = {
    dropTable,
    isConnected,
    parse,
    add,
    getAll,
    deleteEntry,
    cleanUp,
};
