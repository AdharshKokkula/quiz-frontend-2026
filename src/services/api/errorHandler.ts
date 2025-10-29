import type { AxiosError } from "axios";

export function handleApiError(error: unknown) {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const message =
      axiosError.response?.data?.message ||
      axiosError.message ||
      "An unexpected error occurred";

    console.error("API Error:", message);
  } else {
    console.error("Unknown error:", error);
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined;
}
