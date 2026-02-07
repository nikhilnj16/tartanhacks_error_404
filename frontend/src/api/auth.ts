import { apiUrl } from "./config";

export type UserResponse = {
  id: string;
  email: string;
  full_name: string | null;
  name: string | null;
  phone_number: string | null;
  created_at: string | null;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
  user: UserResponse;
};

export type SignupPayload = {
  email: string;
  password: string;
  name: string;
  phone_number: string;
  full_name?: string;
};

/** FastAPI 422 validation error detail item */
export type ValidationErrorItem = {
  loc: (string | number)[];
  msg: string;
  type?: string;
};

export type ApiErrorDetail = string | { detail: string | ValidationErrorItem[] };

async function parseErrorResponse(res: Response): Promise<{ status: number; message: string; details?: ValidationErrorItem[] }> {
  const text = await res.text();
  let body: { detail?: ApiErrorDetail } | null = null;
  try {
    body = JSON.parse(text);
  } catch {
    return { status: res.status, message: res.statusText || "Something went wrong." };
  }
  const d = body?.detail;
  if (typeof d === "string") {
    return { status: res.status, message: d };
  }
  if (Array.isArray(d)) {
    const messages = d.map((x) => (x.msg ? `${x.loc?.join(".") || "Field"}: ${x.msg}` : "")).filter(Boolean);
    return {
      status: res.status,
      message: messages[0] || "Validation failed.",
      details: d,
    };
  }
  if (d && typeof d === "object" && "detail" in d) {
    const inner = (d as { detail: string }).detail;
    return { status: res.status, message: typeof inner === "string" ? inner : "Error" };
  }
  return { status: res.status, message: "Something went wrong." };
}

export async function signup(payload: SignupPayload): Promise<SignupSuccess> {
  const res = await fetch(apiUrl("/auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
      name: payload.name.trim(),
      phone_number: payload.phone_number,
      ...(payload.full_name !== undefined && payload.full_name !== "" && { full_name: payload.full_name.trim() }),
    }),
  });
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throw new Error(err.message);
  }
  return res.json() as Promise<TokenResponse>;
}

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const res = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email.trim().toLowerCase(),
      password: payload.password,
    }),
  });
  if (!res.ok) {
    const err = await parseErrorResponse(res);
    throw new Error(err.message);
  }
  return res.json() as Promise<TokenResponse>;
}
