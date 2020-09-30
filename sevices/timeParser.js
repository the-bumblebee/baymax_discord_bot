
function timeParser (hr, min, ampm) {
    if (ampm !== 'AM' && ampm !== 'PM')  return {error: 'AM/PM not correct'};

    if (hr > 12 || hr < 1) return {error: 'Hour not between 1-12'};

    if (min > 59 || min < 0) return {error: 'Minutes not between 0-59'};

    if (ampm === 'AM' && hr === 12) hr = 0;
    if (ampm === 'PM') hr += 12;

    // min = min - 15;

    // if (min < 0) {

    //     if (hr === 0) hr = 23;
    //     else hr -= 1;
    //     min = 60 + min;
    // }

    return {hr, min, error: null};
}

module.exports = timeParser;