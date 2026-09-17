import {
  AVATAR_MAX_MB,
  IMAGE_TYPES,
  TARGET_IMAGE_MAX_MB,
} from "@/constants/limits";

// One place every picture picker reads its rules from, so the target picker
// and the avatar picker accept the same files, say the same thing about them,
// and refuse a bad one before it is sent — with the API's own wording. The two
// differ only in size, and each route enforces its own, so every rule here
// takes the limit it is checking against rather than assuming one.

export const IMAGE_ACCEPT = IMAGE_TYPES.join(",");

const imageRules = (maxMb) => `JPG, PNG, WEBP or GIF · up to ${maxMb}MB`;

export const TARGET_IMAGE_RULES = imageRules(TARGET_IMAGE_MAX_MB);

export const AVATAR_RULES = imageRules(AVATAR_MAX_MB);

// The reason a file cannot be used, or null when it can.
export const imageError = (file, maxMb) => {
  if (!IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, PNG, WEBP and GIF images are allowed";
  }

  if (file.size > maxMb * 1024 * 1024) {
    return `Image must be ${maxMb}MB or smaller`;
  }

  return null;
};
