import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const USER_KEY = "user";

// The cookie is `secure` on any HTTPS page and always in a production build,
// so the token is never sent over plain HTTP where it could be read in
// transit. Development over http://localhost keeps working because a
// development build on plain HTTP is the one case left out.
//
// The token is still readable by JavaScript: the app has no server-side
// session to set an httpOnly cookie from. `proxy.js` reads this same cookie to
// guard routes on the server.
const cookieOptions = () => ({
  expires: 7, // days
  sameSite: "strict",
  secure:
    process.env.NODE_ENV === "production" ||
    (typeof window !== "undefined" && window.location.protocol === "https:"),
});

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, cookieOptions());
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const setUser = (user) => {
  Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions());
};

// The cookie is only a cache of the profile. One that no longer parses —
// hand-edited, truncated, written by an older build — is dropped and treated as
// absent rather than throwing out of every page that reads it; the pages
// refetch the profile anyway.
export const getUser = () => {
  const user = Cookies.get(USER_KEY);

  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch {
    removeUser();

    return null;
  }
};

export const removeUser = () => {
  Cookies.remove(USER_KEY);
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

export const logout = () => {
  removeToken();
  removeUser();
};
