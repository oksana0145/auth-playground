import { refresh } from "./authApi";

export const apiFetch = async ({
  url,
  options = {},
  accessToken,
  updateAccessToken,
  logoutUser,
}) => {
  const sendRequest = async (token) => {
    const headers = new Headers(options.headers);

    headers.set("Authorization", `Bearer ${token}`);

    return fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  let response = await sendRequest(accessToken);

  if (response.status !== 401) {
    return response;
  }

  try {
    const refreshData = await refresh();

    const newAccessToken = refreshData.accessToken;

    updateAccessToken(newAccessToken);

    response = await sendRequest(newAccessToken);

   if (response.status === 401) {
     const error = new Error("Authentication failed after token refresh");
     error.status = 401;
     throw error;
   }

    return response;
  } catch (error) {
    if (error.status === 401) {
      logoutUser();
    }

    throw error;
  }
};
