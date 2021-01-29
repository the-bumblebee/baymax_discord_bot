const Event = require("../models/Event");

function isConnected(connection) {
    if (connection.readyState !== 1) return false;
    else return true;
}

async function dropTable() {
    if (!isConnected(connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await mongoose.connection.db.dropCollection("Events");
}

async function parse(argString) {
    const addExpr = /add "([^"]+)"/g;
    const onExpr = /on ([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{2})/g;
    const addMatch = addExpr.exec(argString);
    const onMatch = onExpr.exec(argString);

    if (!addMatch || !onMatch) {
        throw new Error("[ERROR] Incorrect format.");
    }
    const epoch = Date.parse(`${onMatch[2]}/${onMatch[1]}/${onMatch[3]}`);
    if (
        !epoch ||
        epoch < Date.parse(new Date().toLocaleDateString() - 600000)
    ) {
        throw new Error("[ERROR] Incorrect date.");
    }

    return { event_name: addMatch[1], date: epoch };
}

async function add(eventObj) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }

    const event = new Event(eventObj);
    await event.save();
}

async function getAll() {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    const docs = await Event.aggregate([
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
    ]);
    return docs;
}

async function deleteEntry(event) {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await Event.deleteMany(event).exec();
}

async function cleanUp() {
    if (!isConnected(mongoose.connection)) {
        throw new Error("[ERROR] Database is not connected.");
    }
    await Event.deleteMany({
        date: { $lt: Date.parse(new Date().toLocaleDateString()) - 600000 },
    }).exec();
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
