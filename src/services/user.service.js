import api from "@/lib/axios";

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const updateProfile = async ({
  name,
  email,
  salary,
  working_days_per_month,
  working_days_per_week,
}) => {
  const response = await api.put("/users/profile", {
    name,
    email,
    // The API validates these with a strict z.number(), so the coerced form
    // values must go out as numbers, not the inputs' strings.
    salary: Number(salary),
    working_days_per_month: Number(working_days_per_month),
    working_days_per_week: Number(working_days_per_week),
  });

  return response.data;
};

export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await api.put("/users/avatar", formData, {
    headers: { "Content-Type": undefined },
  });

  return response.data;
};

export const getAvatarAlbum = async () => {
  const response = await api.get("/users/avatars");
  return response.data;
};

export const selectAvatarImage = async (name) => {
  const response = await api.put("/users/avatar/select", { name });
  return response.data;
};

export const deleteAvatarImage = async (name) => {
  // The API rebuilds the path as `<userId>/<name>`, so only the bare file
  // name travels — encoded, since it ends up as a URL segment.
  const response = await api.delete(
    `/users/avatars/${encodeURIComponent(name)}`
  );

  return response.data;
};

export const changePassword = async ({
  oldPassword,
  newPassword,
  confirmPassword,
}) => {
  const response = await api.put("/users/change-password", {
    oldPassword,
    newPassword,
    confirmPassword,
  });

  return response.data;
};
