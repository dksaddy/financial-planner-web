import api from "@/lib/axios";

// `status` is one of "active" | "inactive" | "all" (the API defaults to
// "all"). Anything that feeds a picker of usable types must pass "active",
// because records cannot be created against a deactivated type.
export const getExpenseTypes = async (status) => {
  const response = await api.get("/expense-types", {
    params: status ? { status } : undefined,
  });

  return response.data;
};

export const getExpenseType = async (id) => {
  const response = await api.get(`/expense-types/${id}`);
  return response.data;
};

export const createExpenseType = async ({ name, categories }) => {
  const response = await api.post("/expense-types", {
    name,
    categories,
  });

  return response.data;
};

// The API rejects any edit that changes the total — categories may be
// renamed or redistributed, but the sum must stay the same.
export const updateExpenseType = async (id, { name, categories }) => {
  const response = await api.put(`/expense-types/${id}`, {
    name,
    categories,
  });

  return response.data;
};

export const setExpenseTypeStatus = async (id, isActive) => {
  const response = await api.patch(`/expense-types/${id}/status`, {
    is_active: isActive,
  });

  return response.data;
};
