import api from "@/lib/axios";

export const getTargets = async () => {
  const response = await api.get("/target");
  return response.data;
};

export const createTarget = async ({
  name,
  target_amount,
  image,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("target_amount", target_amount);

  if (image) {
    formData.append("image", image);
  }

  const response = await api.post("/target", formData, {
    headers: { "Content-Type": undefined },
  });

  return response.data;
};

export const updateTarget = async (id, { name, target_amount }) => {
  const response = await api.put(`/target/${id}`, {
    name,
    target_amount,
  });

  return response.data;
};

export const deleteTarget = async (id) => {
  const response = await api.delete(`/target/${id}`);

  return response.data;
};