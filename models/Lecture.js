const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// day- Monday, Tuesday, ...
// slot- 0 to 9
const lectureSchema = new Schema({
    day: { type: String, required: true, index: true },
    course_name: { type: String, required: true, index: true },
    // slot: { type: Number, required: true },
    time: {
        type: {
            hr: Number,
            min: Number,
        },
        required: true,
    },
});

module.exports = mongoose.model("Lecture", lectureSchema, "TimeTable");
