export const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://newton-theta-bice.vercel.app/api";

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

export async function loginRequest(userName: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("მომხმარებლის სახელი ან პაროლი არასწორია");
    }
    throw new Error("შესვლა ვერ მოხერხდა, სცადეთ თავიდან");
  }

  return response.json();
}

export async function logoutRequest(refreshToken: string): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });
  } catch {
    // best-effort — local logout still proceeds even if this fails
  }
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const response = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error("სესია ამოიწურა, გთხოვთ თავიდან შეხვიდეთ სისტემაში");
  }

  const data: RefreshResponse = await response.json();
  return data.accessToken;
}

// Sends a resource with an access token using the given HTTP method. If the
// token has expired (401/403), it transparently refreshes once and retries.
async function sendWithAuth<T>(
  method: "POST" | "PATCH" | "DELETE",
  endpoint: string,
  accessToken: string,
  body: unknown,
  refreshToken?: string,
  onTokenRefreshed?: (newAccessToken: string) => void
): Promise<T> {
  const send = (token: string) =>
    fetch(`${API_BASE}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

  let response = await send(accessToken);

  if ((response.status === 401 || response.status === 403) && refreshToken) {
    try {
      const newAccessToken = await refreshAccessToken(refreshToken);
      onTokenRefreshed?.(newAccessToken);
      response = await send(newAccessToken);
    } catch {
      throw new Error("სესია ამოიწურა, გთხოვთ თავიდან შეხვიდეთ სისტემაში");
    }
  }

  if (response.status === 401 || response.status === 403) {
    throw new Error("სესია ამოიწურა, გთხოვთ თავიდან შეხვიდეთ სისტემაში");
  }

  if (!response.ok) {
    throw new Error("მოქმედება ვერ შესრულდა");
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export function postWithAuth<T>(
  endpoint: string,
  accessToken: string,
  body: unknown,
  refreshToken?: string,
  onTokenRefreshed?: (newAccessToken: string) => void
): Promise<T> {
  return sendWithAuth<T>("POST", endpoint, accessToken, body, refreshToken, onTokenRefreshed);
}

export function patchWithAuth<T>(
  endpoint: string,
  accessToken: string,
  body: unknown,
  refreshToken?: string,
  onTokenRefreshed?: (newAccessToken: string) => void
): Promise<T> {
  return sendWithAuth<T>("PATCH", endpoint, accessToken, body, refreshToken, onTokenRefreshed);
}

export function deleteWithAuth<T>(
  endpoint: string,
  accessToken: string,
  refreshToken?: string,
  onTokenRefreshed?: (newAccessToken: string) => void
): Promise<T> {
  return sendWithAuth<T>("DELETE", endpoint, accessToken, undefined, refreshToken, onTokenRefreshed);
}