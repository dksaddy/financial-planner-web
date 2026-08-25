import Cookies from "js-cookie";

const TOKEN_KEY = "token";
const USER_KEY = "user";

const COOKIE_OPTIONS = {
  expires: 7, // days
  sameSite: "strict",
};

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};

export const setUser = (user) => {
  Cookies.set(USER_KEY, JSON.stringify(user), COOKIE_OPTIONS);
};

export const getUser = () => {
  const user = Cookies.get(USER_KEY);
  return user ? JSON.parse(user) : null;
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