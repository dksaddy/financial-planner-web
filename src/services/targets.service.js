import api from "@/lib/axios";

export const getTargets = async () => {
  const response = await api.get("/target");
  return response.data;
};

export const getTargetImages = async () => {
  const response = await api.get("/target/images");
  return response.data;
};

export const createTarget = async ({
  name,
  target_amount,
  image,
  existingImageUrl,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("target_amount", target_amount);

  if (image) {
    // A brand new file was chosen — upload it.
    formData.append("image", image);
  } else if (existingImageUrl) {
    // An existing target picture was picked from the gallery — reuse it,
    // no file upload needed.
    formData.append("image_url", existingImageUrl);
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

export const updateTargetStatus = async (id, status) => {
  const response = await api.put(`/target/${id}`, { status });

  return response.data;
};

export const deleteTarget = async (id) => {
  const response = await api.delete(`/target/${id}`);

  return response.data;
};