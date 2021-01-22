**Syntax:** `;tt add "course" on X, day{hh.mm}`

The above command adds the course "course" to the timetable. Also creates a role named "course" which will be used in the future for reminding purposes.

`X` is the slot. This can be anything from **A, B, C, D, E, F, G, H, A+, B+, C+, D+, E+, F+, G+, H+, E@, G@**. Do note that laboratory slots are not added as they would need more work, when in fact they are not needed. You can also add more slots to add the course at those slots. Slots should be separated using `,`(comma).
**Example usage:**
`;tt add "COA" on A, A@, B` - This adds the course "COA" at the slots A, A@ and B.

In addition to the slots, you can provide custom timings on any day. `day{hh.mm}` part sets this custom timing. Here `day` should be either of these: **mon, tue, wed, thu, fri**. `hh.mm` is the time in 24-hour format. So providing `mon{13.15}` adds the course to the time "1.15pm" on Monday. You can specify one or more timings within the curly brackets. The timings should be separated by either using `,`(comma) or ` `(space). For example, `mon{8.15, 13.00, 15.00}` - this adds the course to the timings "8.15", "13.00" and "15.00" on Monday.
**Example usages:**

1. `;tt add "COA" on mon{8.00, 10.15}, tue{11.15}` - This adds the course "COA" at "8.00" and "10.15" on Monday and also at "11.15" on Tuesday.
2. `;tt add "COA" on mon{8.00 10.15}, tue{11.15}` - The same example but with a space instead of a comma between the timings. Do note that commas are necessary to separate `mon{}` from `tue{}`, spaces wouldn't suffice here. So `mon{8.00, 10.15} tue{11.15}` wouldn't work as there is no comma between `mon{}` and `tue{}`

You can also combine slots and custom timings.
**Example usage:**
`;tt add "COA" on A, A+, wed{13.00, 15,00}, fri{14.00}` - Adds the course "COA" at slots A and A+ and also at "13.00", "15.00" on Wednesday and at "14.00" at Friday.

The bot replies with the timings of the course and whether the operation was successful or not.
