// Mirrors `financial-planner-api/src/constants/limits.js`, so a form refuses
// exactly what the API would. Change both files together.

// One rule for every name: a person, a saving plan, an expense type, a target.
export const NAME_MIN = 2;
export const NAME_MAX = 100;

// A password being chosen. A password being re-typed is checked for presence
// only.
export const PASSWORD_MIN = 8;
