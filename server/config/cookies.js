export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
