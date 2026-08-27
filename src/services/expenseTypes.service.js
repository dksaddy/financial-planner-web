import api from "@/lib/axios";

export const getExpenseTypes = async () => {
  const response = await api.get("/expense-types");
  return response.data;
};