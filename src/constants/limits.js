// Mirrors `financial-planner-api/src/constants/limits.js`, so a form refuses
// exactly what the API would. Change both files together.

// One rule for every name: a person, a saving plan, an expense type, a target.
export const NAME_MIN = 2;
export const NAME_MAX = 100;

// A password being chosen. A password being re-typed is checked for presence
// only.
export const PASSWORD_MIN = 8;

// Days a user spreads their spending over. A week cannot hold more working
// days than the month it sits in.
export const WORKING_DAYS_PER_MONTH_MIN = 1;
export const WORKING_DAYS_PER_MONTH_MAX = 31;
export const WORKING_DAYS_PER_WEEK_MIN = 1;
export const WORKING_DAYS_PER_WEEK_MAX = 7;

// A saving plan's tax on profit, as a percent. A new plan's form starts at the
// default, which is also the API's.
export const TAX_RATE_MIN = 0;
export const TAX_RATE_MAX = 100;
export const DEFAULT_TAX_RATE = 15;
