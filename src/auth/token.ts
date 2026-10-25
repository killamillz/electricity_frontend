const TOKEN_KEY = "auth_token";

/** Fired when the API rejects a stored token, so the app can log the user out */
export const SESSION_EXPIRED_EVENT = "auth:session-expired";

// Storage can throw (private mode, blocked site data), so every access is guarded

export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Not persisted: the user stays logged in until the tab is closed
  }
};

export const clearToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Nothing to clear
  }
};
