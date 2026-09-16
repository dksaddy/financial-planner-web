import { IMAGE_MAX_MB, IMAGE_TYPES } from "@/constants/limits";

// One place every picture picker reads its rules from, so the target picker
// and the avatar picker accept the same files, say the same thing about them,
// and refuse a bad one before it is sent — with the API's own wording.

export const IMAGE_ACCEPT = IMAGE_TYPES.join(",");

export const IMAGE_RULES = `JPG, PNG, WEBP or GIF · up to ${IMAGE_MAX_MB}MB`;

// The reason a file cannot be used, or null when it can.
export const imageError = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, WEBP and GIF images are allowed";
  }

  if (file.size > IMAGE_MAX_MB * 1024 * 1024) {
    return `Image must be ${IMAGE_MAX_MB}MB or smaller`;
  }

  return null;
};
