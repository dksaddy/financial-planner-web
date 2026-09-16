// Mirrors `financial-planner-api/src/constants/status.js` — the words the API
// uses for a resource's state. Compare against these, never a typed string, so
// a rename on the API side is one edit here too. Change both files together.

// active → completed → withdrawn. Which moves are legal is
// `canChangeStatus` in `lib/savingPlan.js`.
export const SAVING_PLAN_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  WITHDRAWN: "withdrawn",
};

export const SAVING_PLAN_STATUSES = Object.values(SAVING_PLAN_STATUS);

// Stored as the boolean `is_active`; `GET /expense-types?status=` takes these.
export const EXPENSE_TYPE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const TARGET_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
};

// The "everything" choice of a filter. The API reads it on
// `GET /expense-types?status=`; the saving-plan tabs and the expense month tabs
// use the same word locally.
export const FILTER_ALL = "all";
