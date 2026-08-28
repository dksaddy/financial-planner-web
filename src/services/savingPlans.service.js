import api from "@/lib/axios";

export const getSavingPlans = async () => {
  const response = await api.get("/saving-plans");
  return response.data;
};

export const createSavingPlan = async (payload) => {
  const response = await api.post("/saving-plans", payload);
  return response.data;
};

export const depositToSavingPlan = async (id, amount) => {
  const response = await api.patch(`/saving-plans/${id}/deposit`, {
    amount,
  });
  return response.data;
};