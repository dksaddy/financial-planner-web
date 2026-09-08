import api from "@/lib/axios";

export const createExpenseRecord = async (data) => {
  const response = await api.post("/expense-records", data);
  return response.data;
};

// Paginated. The envelope's `meta` carries `pagination`, `summary`
// (totals over the whole filtered set) and `months` (every month the user
// has records in) — none of which can be derived from one page.
export const getExpenseRecords = async ({ page, limit, month } = {}) => {
  const response = await api.get("/expense-records", {
    params: {
      ...(page ? { page } : {}),
      ...(limit ? { limit } : {}),
      ...(month && month !== "all" ? { month } : {}),
    },
  });

  return response.data;
};

export const getExpenseRecord = async (id) => {
  const response = await api.get(`/expense-records/${id}`);
  return response.data;
};

export const updateExpenseRecord = async (id, data) => {
  const response = await api.put(`/expense-records/${id}`, data);
  return response.data;
};

export const deleteExpenseRecord = async (id) => {
  const response = await api.delete(`/expense-records/${id}`);
  return response.data;
};