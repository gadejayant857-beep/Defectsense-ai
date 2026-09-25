const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

async function apiFetch(endpoint) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.status !== "success") {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export async function getDashboard() {
  return apiFetch("/dashboard");
}

export async function getClaims() {
  const data = await apiFetch("/claims");
  return data.claims;
}

export async function getDefects() {
  const data = await apiFetch("/defects");
  return data.defects;
}

export async function getIntelligence() {
  const data = await apiFetch("/intelligence");
  return data.intelligence;
}

export async function getAnalytics() {
  const data = await apiFetch("/analytics");
  return data.analytics;
}
