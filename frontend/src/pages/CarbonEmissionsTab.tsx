import { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { getStoredUserEmail } from "../api/budget";
import { getCarbonFootprint, type CarbonFootprintResponse } from "../api/carbon";

const CATEGORY_COLORS = ["#059669", "#0d9488", "#0f766e", "#115e59", "#134e4a", "#14b8a6", "#2dd4bf", "#5eead4"];
const IMPACT_COLORS = { Low: "#22c55e", Medium: "#eab308", High: "#ef4444" };

type DateRangeKey = "all" | "week" | "month";

function getDateRangeBounds(range: DateRangeKey): { start_date?: string; end_date?: string } {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    const end_date = `${y}-${m}-${d}`;
    if (range === "all") return {};
    if (range === "week") {
        const start = new Date(today);
        start.setDate(start.getDate() - 6);
        const sy = start.getFullYear();
        const sm = String(start.getMonth() + 1).padStart(2, "0");
        const sd = String(start.getDate()).padStart(2, "0");
        return { start_date: `${sy}-${sm}-${sd}`, end_date };
    }
    if (range === "month") {
        const start = new Date(today);
        start.setDate(start.getDate() - 29);
        const sy = start.getFullYear();
        const sm = String(start.getMonth() + 1).padStart(2, "0");
        const sd = String(start.getDate()).padStart(2, "0");
        return { start_date: `${sy}-${sm}-${sd}`, end_date };
    }
    return {};
}

export default function CarbonEmissionsTab() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<CarbonFootprintResponse | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [dateRange, setDateRange] = useState<DateRangeKey>("all");

    useEffect(() => {
        const email = getStoredUserEmail();
        setUserEmail(email);
        if (!email) {
            setError("Please log in to see your carbon emissions.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        const bounds = getDateRangeBounds(dateRange);
        getCarbonFootprint(email, bounds)
            .then(setData)
            .catch((err) => setError(err instanceof Error ? err.message : "Failed to load carbon footprint"))
            .finally(() => setLoading(false));
    }, [dateRange]);

    if (loading) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Carbon Emissions</h2>
                <div className="flex items-center justify-center py-12 text-slate-500">
                    Loading…
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Carbon Emissions</h2>
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Carbon Emissions</h2>
                <p className="text-slate-600">No data available.</p>
            </div>
        );
    }

    const categories = Object.entries(data.by_category).sort(
        (a, b) => b[1].kg_co2e - a[1].kg_co2e
    );

    // Chart data from API (real-time)
    const emissionsByCategoryChart = categories.map(([name, info], i) => ({
        name,
        value: Math.round(info.kg_co2e * 100) / 100,
        color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
    }));

    const totalLow = categories.reduce((s, [, info]) => s + info.impact_breakdown.low, 0);
    const totalMedium = categories.reduce((s, [, info]) => s + info.impact_breakdown.medium, 0);
    const totalHigh = categories.reduce((s, [, info]) => s + info.impact_breakdown.high, 0);
    const impactLevelChart = [
        { name: "Low", count: totalLow, fill: IMPACT_COLORS.Low },
        { name: "Medium", count: totalMedium, fill: IMPACT_COLORS.Medium },
        { name: "High", count: totalHigh, fill: IMPACT_COLORS.High },
    ];

    const dateRangeLabel = dateRange === "all" ? "All time" : dateRange === "week" ? "Previous week" : "Previous month";

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-4 justify-between">
                <h2 className="text-2xl font-bold">Carbon Emissions</h2>
                <label className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Date range:</span>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value as DateRangeKey)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium bg-white"
                    >
                        <option value="all">All time</option>
                        <option value="week">Previous week</option>
                        <option value="month">Previous month</option>
                    </select>
                </label>
            </div>
            {userEmail && (
                <p className="text-sm text-slate-500">
                    Based on spending for: {userEmail}
                    {dateRange !== "all" && ` · ${dateRangeLabel}`}
                </p>
            )}

            {/* Total footprint */}
            <section className="bg-slate-800 text-white rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Total carbon footprint</h3>
                <p className="text-4xl font-bold">{data.total_kg_co2e.toFixed(2)} kg CO₂e</p>
                <p className="text-slate-300 text-sm mt-2">
                    From {data.transaction_count_used} spending transaction(s). Based on category emission factors (kg CO₂e per $ spent).
                </p>
            </section>

            {/* Emissions by category - Pie chart */}
            <section className="bg-white rounded-xl border border-slate-200 shadow p-6">
                <h3 className="text-xl font-bold mb-4">Emissions by category</h3>
                {emissionsByCategoryChart.length === 0 ? (
                    <p className="text-slate-600">No spending data by category yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie
                                    data={emissionsByCategoryChart}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={2}
                                >
                                    {emissionsByCategoryChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [`${value} kg CO₂e`, "Emissions"]} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                        <ul className="space-y-2">
                            {emissionsByCategoryChart.map((entry) => (
                                <li key={entry.name} className="flex justify-between text-sm">
                                    <span>{entry.name}</span>
                                    <span className="font-medium">{entry.value} kg CO₂e</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Transactions by impact level - Bar chart */}
            <section className="bg-white rounded-xl border border-slate-200 shadow p-6">
                <h3 className="text-xl font-bold mb-4">Transactions by impact level</h3>
                <p className="text-sm text-slate-600 mb-4">
                    Number of transactions in each impact level (vs category baseline).
                </p>
                {data.transaction_count_used === 0 ? (
                    <p className="text-slate-600">No transactions to show.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={impactLevelChart} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip formatter={(value: number) => [value, "Transactions"]} />
                            <Bar dataKey="count" name="Transactions" radius={[6, 6, 0, 0]}>
                                {impactLevelChart.map((entry, index) => (
                                    <Cell key={`impact-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </section>

            {/* By category - table/cards (keep for detail) */}
            <section className="bg-white rounded-xl border border-slate-200 shadow p-6">
                <h3 className="text-xl font-bold mb-4">Category breakdown</h3>
                {categories.length === 0 ? (
                    <p className="text-slate-600">No spending data by category yet.</p>
                ) : (
                    <div className="space-y-4">
                        {categories.map(([category, info]) => (
                            <div
                                key={category}
                                className="rounded-lg border border-slate-200 p-4 space-y-2"
                            >
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-lg">{category}</h4>
                                    <span className="font-bold text-emerald-700">
                                        {info.kg_co2e.toFixed(2)} kg CO₂e
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Spent: ${info.amount_spent_usd.toFixed(2)} · Factor: {info.emission_factor_kg_co2e_per_usd.toFixed(4)} kg CO₂e/$
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs">
                                    <span className="px-2 py-1 rounded bg-green-100 text-green-800">
                                        Low impact: {info.impact_breakdown.low}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-amber-100 text-amber-800">
                                        Medium: {info.impact_breakdown.medium}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-red-100 text-red-800">
                                        High impact: {info.impact_breakdown.high}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Classification logic */}
            <section className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold mb-2">How impact is classified</h3>
                <p className="text-sm text-slate-600 mb-3">{data.classification_logic.baseline}</p>
                <ul className="text-sm space-y-1 text-slate-700">
                    <li><strong>Low:</strong> {data.classification_logic.low}</li>
                    <li><strong>Medium:</strong> {data.classification_logic.medium}</li>
                    <li><strong>High:</strong> {data.classification_logic.high}</li>
                </ul>
            </section>
        </div>
    );
}
