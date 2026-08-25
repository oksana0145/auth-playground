const API_URL = `http://localhost:5000/auth`;

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const register = async (formValues) => {
  const response = await fetch(`${API_URL}/register`, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });

  return handleResponse(response);
};

export const verifyEmail = async (token) => {
  const response = await fetch(`${API_URL}/verify-email?token=${token}`);

  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(response);
};

export const getMe = async (accessToken) => {
  const response = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });

  return handleResponse(response);
};

export const refresh = async () => {
  const response = await fetch(`${API_URL}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(response);
};
