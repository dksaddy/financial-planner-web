import { updateTimeZone } from "@/services/user.service";

// The API reads "today" and "this week" in the user's stored zone. The browser
// is the one clock that knows it, so it is sent on register and kept in step
// whenever a page loads the profile.
export const browserTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    return null;
  }
};

// Fire-and-forget: a failed sync leaves the stored zone as it was, which only
// matters for the next request. Returns the profile as it now stands, so a
// caller can cache the updated copy.
export const syncTimeZone = async (profile) => {
  const zone = browserTimeZone();

  if (!profile || !zone || profile.time_zone === zone) return profile;

  try {
    const response = await updateTimeZone(zone);

    return response.data;
  } catch {
    return profile;
  }
};
