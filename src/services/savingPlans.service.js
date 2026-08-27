import api from "@/lib/axios";

export const getSavingPlans = async () => {
  const response = await api.get("/saving-plans");
  return response.data;
};