**Usage:** `;tt add "COA" on A, mon{12.15}, A+, A@, tue{13.00, 14.00}`

Adds the course **COA** to the slots **A**, **A+**, **A@** and also at custom times **12.15pm** on **Monday**, **1.00pm** and **2.00pm** on **Tuesday**. Also creates a role, **COA**, for future use. The bot replies with the timings and a message if the addition was successful.

Adding to slots are straightforward. Available Slots: **A, B, C, D, E, F, G, H, A+, B+, C+, D+, E+, F+, G+, H+, E@, G@**. Lab slots are avoided as they have no purpose atleast for us. You can add the course to any number of slots.

**Example 1:** To add a course, **COA** to slots **B**, **B+** and **C**, type,
`;tt add "COA" on B, B+, C`

Adding to custom times are a little tricky. The day provided should only be any of these and should match it exactly: **mon**, **tue**, **wed**, **thu**, **fri**. The timings provided should be in 24hr format. You can add multiple times on the same day by separating the times using commas,

**Example 2:** To add a course, **COA**, at **11.15am** and **1.00pm** on Monday, type,
`;tt add "COA" on mon{11.15, 13.00}`

You can add both slots as well as custom timings as shown at the very top.
