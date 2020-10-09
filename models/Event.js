const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema ({
    event_name: { type: String, required: true, index: true },
    date: { type: Number, required: true, index: true },
    description: {type: String, default: null }
});

module.exports = mongoose.model('Event', eventSchema, 'Events');