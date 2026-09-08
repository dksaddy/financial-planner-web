import api from "@/lib/axios";

export const getExpenseTypes = async () => {
  const response = await api.get("/expense-types");
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