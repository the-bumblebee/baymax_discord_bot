const TimeTable = require("../services/TimeTable");
const Courses = require("../services/Courses");
const Discord = require("discord.js");

module.exports = {
    name: "tt",
    async execute(message, args) {
        if (!message.guild || message.guild.id !== "698456806787383327") {
            message.reply(
                "Sorry! This command is not open to other servers and private chats as of now."
            );
            return;
        }
        const subcmd = args.shift();
        if (subcmd === "add") {
            await addCourse(message, args);
        } else if (subcmd === "delete") {
            await deleteCourse(message, args);
        } else if (subcmd === "get") {
            await getCourseTimings(message, args);
        } else if (subcmd === "dropSchema") {
            await dropSchema(message, args);
        } else if (!subcmd) {
            await getTimeTable(message, args);
        } else {
            const errorMessage = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Incorrect Usage!")
                .setDescription(
                    "Use `;help tt` to see usage of `;tt` command."
                );
            message.send(errorMessage);
        }
    },
};

async function addCourse(message, args) {
    const courseInQuotes = args.shift();
    const on = args.shift();
    const courseExpr = /"([^"]+)"/g;
    const courseMatch = courseExpr.exec(courseInQuotes);
    if (on !== "on" || !courseMatch) {
        const errorMessage = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Incorrect format!")
            .setDescription("Use `;help tt` to see usage of `;tt` command.");
        message.reply(errorMessage);
        return;
    }
    const course = courseMatch[1];
    const timings = await TimeTable.parseTimings(args.join(" "));
    let descr = "The lecture timings for this course are as follows:\n\n";
    descr += await TimeTable.timingsToMessage(timings);
    await TimeTable.saveCourseTimings(course, timings);
    const infoMessage = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(course)
        .setDescription(descr);
    message.reply(infoMessage);
    try {
        await Courses.addCourse(course);
        await Courses.addRole(message, course);
    } catch (error) {
        message.reply("Error! Check logs.");
        console.log(error);
        return;
    }
    message.reply("Course and role added successfully.");
}

async function deleteCourse(message, args) {
    // List courses and wait
    // Validate the serial number and check if the user has course role / admin role / moderator
    // Confirm the course to make sure
    // Delete course from Courses and lecture hours from TimeTable
    // Delete the role associated with it

    const courses = await Courses.getAll();
    let descr =
        "Reply with the serial number of the course listed below to delete the course.\n\n";
    descr += await Courses.coursesToMessage(courses);
    const infoMessage = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("List of Courses")
        .setDescription(descr);
    message.reply(infoMessage);

    let serialNumber = -1;
    const filter = (m) => m.author.id === message.author.id;

    try {
        const collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 12000,
            errors: ["time"],
        });
        serialNumber = parseInt(collected.first().content);
    } catch (error) {
        message.channel.send("Command timed out! Run command again.");
        return;
    }
    serialNumber -= 1;

    if (!courses[serialNumber]) {
        message.channel.send("Serial number is incorrect! Exiting!");
        return;
    }

    message.channel.send(
        `Reply with the name of the course to confirm deletion.`
    );
    try {
        const collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 12000,
            errors: ["time"],
        });
        if (collected.first().content !== courses[serialNumber].course_name) {
            message.channel.send("Could not confirm! Exiting!");
            return;
        }
    } catch (error) {
        message.channel.send("Command timed out! Run command again.");
        return;
    }

    try {
        await Courses.removeCourse(courses[serialNumber].course_name);
        await Courses.removeRole(message, courses[serialNumber].course_name);
        await TimeTable.removeCourseTimings(courses[serialNumber].course_name);
    } catch (error) {
        console.log(error);
        message.channel.send("Error! Check logs.");
        return;
    }

    message.channel.send(
        `Course "${courses[serialNumber].course_name}" and its role deleted successfully.`
    );
}

async function getCourseTimings(message, args) {
    const courses = await Courses.getAll();
    let descr =
        "Reply with the serial number of the course listed below to get the lecture timings.\n\n";
    descr += await Courses.coursesToMessage(courses);
    let infoMessage = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("List of Courses")
        .setDescription(descr);
    message.reply(infoMessage);

    let serialNumber = -1;
    const filter = (m) => m.author.id === message.author.id;

    try {
        const collected = await message.channel.awaitMessages(filter, {
            max: 1,
            time: 12000,
            errors: ["time"],
        });
        serialNumber = parseInt(collected.first().content);
    } catch (error) {
        message.channel.send("Command timed out! Run command again.");
        return;
    }
    serialNumber -= 1;

    if (!courses[serialNumber]) {
        console.log(serialNumber);
        message.channel.send("Serial number is incorrect! Exiting!");
        return;
    }

    const timings = await TimeTable.getCourseTimings(
        courses[serialNumber].course_name
    );

    descr = "The lecture timings for this course are as follows:\n\n";
    descr += await TimeTable.timingsToMessage(timings);

    infoMessage = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(courses[serialNumber].course_name)
        .setDescription(descr);

    message.reply(infoMessage);
}

async function getTimeTable(message, args) {
    const days = ["mon", "tue", "wed", "thu", "fri"];
    const today = new Date();
    let dayNumber = today.getDay() - 1;
    let day = today.toLocaleString("default", { weekday: "long" });
    if (dayNumber > 4 || dayNumber < 0) {
        dayNumber = 0;
        day = "Monday";
    }
    const schedule = await TimeTable.get(days[dayNumber]);
    let descr = await TimeTable.dailyHrsToMessage(schedule);
    descr +=
        "\n**Note:** To add or delete courses and for other commands type `;help tt`.";
    let infoMessage = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle(`Timetable - ${day}`)
        .setDescription(descr);
    message.channel.send(infoMessage);
}

async function dropSchema(message, args) {
    // drop Courses collection
    // drop TimeTable collection
    // remove all roles

    if (message.author.id !== "490390568623669251") {
        message.reply("nope!");
        return;
    }

    try {
        await Courses.removeAllRoles(message);
        await Courses.dropTable();
        message.reply("done!");
    } catch (error) {
        message.reply("error!");
        console.log(error);
    }
}
