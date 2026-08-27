import api from "@/lib/axios";

export const createExpenseRecord = async (data) => {
  const response = await api.post("/expense-records", data);
  return response.data;
};