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

  if (image) formData.append("image", image);

  const response = await api.post("/target", formData, {
    headers: { "Content-Type": undefined },
  });

  return response.data;
};

// A new picture has to travel as multipart; everything else stays JSON.
// `removeImage` drops the current picture — the API refuses it alongside a new
// one, so a caller sends one or the other.
export const updateTarget = async (
  id,
  { name, target_amount, image = null, removeImage = false }
) => {
  if (image) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("target_amount", target_amount);
    formData.append("image", image);

    const response = await api.put(`/target/${id}`, formData, {
      headers: { "Content-Type": undefined },
    });

    return response.data;
  }

  const response = await api.put(`/target/${id}`, {
    name,
    target_amount,
    ...(removeImage && { remove_image: true }),
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