import api from "@/lib/axios";

// Every mutation here is password-confirmed by the API, so each takes the
// password the confirmation modal collected and sends it in the body.
//
// `delete` is the odd one: axios puts a DELETE body under `data`, not as the
// second argument the way post/put/patch do.

export const getSavingPlans = async () => {
  const response = await api.get("/saving-plans");
  return response.data;
};

export const createSavingPlan = async (payload, password) => {
  const response = await api.post("/saving-plans", {
    ...payload,
    password,
  });
  return response.data;
};

export const updateSavingPlan = async (id, payload, password) => {
  const response = await api.put(`/saving-plans/${id}`, {
    ...payload,
    password,
  });
  return response.data;
};

export const setSavingPlanStatus = async (id, status, password) => {
  const response = await api.patch(`/saving-plans/${id}/status`, {
    status,
    password,
  });
  return response.data;
};

export const deleteSavingPlan = async (id, password) => {
  const response = await api.delete(`/saving-plans/${id}`, {
    data: { password },
  });
  return response.data;
};

export const depositToSavingPlan = async (id, amount, password) => {
  const response = await api.patch(`/saving-plans/${id}/deposit`, {
    amount,
    password,
  });
  return response.data;
};
