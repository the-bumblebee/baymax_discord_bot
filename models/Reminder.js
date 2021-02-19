const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reminderSchema = new Schema({
    jobID: { type: String, required: true },
    message: { type: String, required: true },
    date: { type: Number, required: true, index: true },
    channel: { type: String, required: true, index: true },
    guild: { type: String, required: true, index: true },
});

module.exports = mongoose.model("Reminder", reminderSchema, "Reminders");
