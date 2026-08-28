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