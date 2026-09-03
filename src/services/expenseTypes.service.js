import api from "@/lib/axios";

export const getExpenseTypes = async () => {
  const response = await api.get("/expense-types");
  return response.data;
};

export const getExpenseType = async (id) => {
  const response = await api.get(`/expense-types/${id}`);
  return response.data;
};