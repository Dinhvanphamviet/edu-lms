import { isAxiosError } from "axios";

export function apiErrorMessage(error: unknown, defaultMessage: string): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.error || error.response?.data?.message;
    return typeof message === "string" ? message : defaultMessage;
  }
  return error instanceof Error ? error.message : defaultMessage;
}
