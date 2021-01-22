const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    course_name: { type: String, required: true, index: true, unique: true },
    // coure_id: { type: String, required: true, index: true }, // Maybe introduce in a future update
});

module.exports = mongoose.model("Course", courseSchema, "Courses");
