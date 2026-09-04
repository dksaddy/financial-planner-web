import api from "@/lib/axios";

export const createExpenseRecord = async (data) => {
  const response = await api.post("/expense-records", data);
  return response.data;
};

export const getExpenseRecords = async () => {
  const response = await api.get("/expense-records");
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