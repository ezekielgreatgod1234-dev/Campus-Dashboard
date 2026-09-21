// Base URL of your Express backend. Set VITE_API_BASE_URL in a .env
// file at the frontend project root to point this somewhere else
// (e.g. your deployed backend URL) — this falls back to the local
// dev server on port 5000, matching backend/index.js's default PORT.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

async function request(path, { method = "GET", body, headers = {} } = {}) {
  const finalHeaders = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (authToken) {
    finalHeaders.Authorization = `Bearer ${authToken}`;
  }

  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (networkError) {
    const error = new Error(
      "Could not reach the server. Please check your connection and try again."
    );
    error.cause = networkError;
    throw error;
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return { data, status: response.status };
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) => request(path, { method: "POST", body }),
  patch: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
};