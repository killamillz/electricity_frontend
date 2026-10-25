import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";
import { API_URL } from "@/lib/config";
import { clearToken, getToken, SESSION_EXPIRED_EVENT } from "@/auth/token";

/** Typed API client. Paths, bodies and responses come from the backend's OpenAPI spec. */
export const api = createClient<paths>({ baseUrl: API_URL });

const auth: Middleware = {
  onRequest({ request }) {
    const token = getToken();
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
    return request;
  },
  onResponse({ request, response }) {
    // A 401 on a normal request means the saved token has expired or is invalid.
    // Login returns 401 for a wrong password, which is not a session problem.
    if (response.status === 401 && getToken() && !request.url.endsWith("/auth/login")) {
      clearToken();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    return response;
  },
};

api.use(auth);
