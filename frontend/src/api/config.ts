/**
 * Backend API base URL. Set VITE_API_URL in .env for production.
 */
export const API_BASE =
  (import.meta.env?.VITE_API_URL as string)?.replace(/\/$/, "") ||
  "http://localhost:8000";

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}
