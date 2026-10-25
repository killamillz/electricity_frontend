export type FieldError = { field: string; message: string };

/** An error from the API, with the backend's message and any per-field validation errors */
export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: FieldError[];

  constructor(status: number, message: string, fieldErrors: FieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

const GENERIC_MESSAGE = "Something went wrong. Please try again.";

const toApiError = (status: number, body: unknown): ApiError => {
  if (typeof body === "string" && body) return new ApiError(status, body);
  if (body && typeof body === "object") {
    const { message, errors } = body as { message?: unknown; errors?: unknown };
    return new ApiError(
      status,
      typeof message === "string" ? message : GENERIC_MESSAGE,
      Array.isArray(errors) ? (errors as FieldError[]) : [],
    );
  }
  return new ApiError(status, GENERIC_MESSAGE);
};

/**
 * Awaits an openapi-fetch call and returns its data, or throws an ApiError.
 *   const { user } = await unwrap(api.GET("/auth/me"));
 */
export async function unwrap<T>(
  request: Promise<{ data?: T; error?: unknown; response: Response }>,
): Promise<T> {
  let result: Awaited<typeof request>;
  try {
    result = await request;
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection and try again.");
  }
  if (!result.response.ok) throw toApiError(result.response.status, result.error);
  return result.data as T;
}

export const errorMessage = (error: unknown) =>
  error instanceof Error && error.message ? error.message : GENERIC_MESSAGE;
