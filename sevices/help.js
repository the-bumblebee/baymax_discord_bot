let helpString = "Available commands:";
helpString += "\n\n1. `;help` - Displays this message.";
helpString +=
    "\n\n2. `;ping` - Used to check the status of the bot also the latency.";
helpString += "\n\n3. `;remind` - Reserved for admins.";
helpString +=
    "\n\n4. `;tt` - Displays the days's timetable and if used after 5pm, displays next day's timetable.";
helpString +=
    "\n\n5. `;events` - Used for configuring events. Type `;help events` for more info.";
helpString +=
    "\n\n6. `;mute` - Used to mute and deafen everyone in a voice channel. Note: You should join a voice channel first.";
helpString +=
    "\n\n7. `;unmute` - Used to unmute and undeafen everyone in a voice channel. Note: You should join a voice channel first.";
helpString +=
    "\n\n**Note:** The day's timetable and upcoming events are displayed everyday at 6.30 AM except";
helpString +=
    " on weekends. In addition, the next day's timetable is displayed everyday at 9.30 PM except on";
helpString += " fridays and saturdays.";

let helpEvents = "Avalaible options:";
helpEvents += "\n\n1. `;events show` to list all the added events.";
helpEvents +=
    "\n\n2. `;events delete <N>` to delete Nth event. Note: run `;events show` before this.";
helpEvents +=
    '\n\n3. `;events add "event" on DD/MM/YY` to add an event. eg: `;events add "Exam" on 23/12/20`.';

module.exports = { helpString, helpEvents };
