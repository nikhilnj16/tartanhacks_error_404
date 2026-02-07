import { apiUrl } from "./config";

export type CarbonFootprintResponse = {
  total_kg_co2e: number;
  by_category: Record<
    string,
    {
      amount_spent_usd: number;
      kg_co2e: number;
      emission_factor_kg_co2e_per_usd: number;
      baseline_avg_usd_per_txn: number;
      impact_breakdown: { low: number; medium: number; high: number };
    }
  >;
  transaction_count_used: number;
  classification_logic: {
    baseline: string;
    low: string;
    medium: string;
    high: string;
  };
  transactions_with_impact?: Array<{
    transaction_id: string;
    place: string;
    amount_usd: number;
    category: string;
    kg_co2e: number;
    ratio_to_baseline: number;
    impact_level: string;
  }>;
};

export async function getCarbonFootprint(
  userEmail: string,
  options?: {
    include_transactions?: boolean;
    last_n?: number;
  }
): Promise<CarbonFootprintResponse> {
  const email = userEmail.trim().toLowerCase();
  const params = new URLSearchParams({ user_email: email });
  if (options?.include_transactions) params.set("include_transactions", "true");
  if (options?.last_n != null && options.last_n > 0) params.set("last_n", String(options.last_n));
  const res = await fetch(apiUrl(`/carbon/footprint?${params}`));
  if (!res.ok) {
    const text = await res.text();
    let msg = "Failed to load carbon footprint";
    try {
      if (text) {
        const j = JSON.parse(text);
        msg = typeof j.detail === "string" ? j.detail : msg;
      }
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return res.json() as Promise<CarbonFootprintResponse>;
}
