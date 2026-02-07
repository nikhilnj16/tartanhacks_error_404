import { apiUrl } from "./config";

export type BudgetResponse = {
  income: number;
  expenses: number;
  savings: number;
  categories: Record<string, number>;
};

export type BudgetPlanResponse = Record<string, number>;

export type BudgetPlanWithSavings = {
  plan: BudgetPlanResponse;
  savings_goal: string;
  savings_reason: string;
};

export function getStoredUserEmail(): string | null {
  try {
    const raw = localStorage.getItem("auth_user");
    if (!raw) return null;
    const user = JSON.parse(raw) as { email?: string };
    return user?.email ?? null;
  } catch {
    return null;
  }
}

export async function getBudget(userEmail: string): Promise<BudgetResponse> {
  const email = userEmail.trim().toLowerCase();
  const params = new URLSearchParams({ user_email: email });
  const res = await fetch(apiUrl(`/generate_budget?${params}`));
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to load budget";
    try {
      if (text) {
        const j = JSON.parse(text);
        msg = typeof j.detail === "string" ? j.detail : msg;
      }
    } catch {
      /* use default msg */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<BudgetResponse>;
}

export async function getBudgetPlan(userEmail: string): Promise<BudgetPlanWithSavings> {
  const email = userEmail.trim().toLowerCase();
  const params = new URLSearchParams({ user_email: email });
  const res = await fetch(apiUrl(`/budget_plan?${params}`));
  if (!res.ok) throw new Error("Failed to load budget plan");
  const data = (await res.json()) as {
    plan?: Record<string, number>;
    savings_goal?: string;
    savings_reason?: string;
  };
  if (typeof data !== "object" || data === null) {
    return { plan: {}, savings_goal: "", savings_reason: "" };
  }
  return {
    plan: data.plan ?? {},
    savings_goal: data.savings_goal ?? "",
    savings_reason: data.savings_reason ?? "",
  };
}

export type UpdateBudgetPayload = BudgetPlanResponse & {
  savings_goal?: string;
  savings_reason?: string;
};

export async function updateBudgetPlan(
  userEmail: string,
  payload: UpdateBudgetPayload
): Promise<{ message: string; ok: boolean }> {
  const email = userEmail.trim().toLowerCase();
  const params = new URLSearchParams({ user_email: email });
  const res = await fetch(apiUrl(`/update_budget?${params}`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { message?: string; ok?: boolean };
  if (!res.ok) throw new Error(data?.message ?? "Failed to update budget");
  return data;
}

