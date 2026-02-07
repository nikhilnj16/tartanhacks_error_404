import { useState, useEffect } from "react";
import {
    getBudget,
    getBudgetPlan,
    getStoredUserEmail,
    updateBudgetPlan,
    type BudgetResponse,
    type BudgetPlanResponse,
} from "../api/budget";

const CATEGORY_COLORS: Record<string, string> = {
    "Dining Out": "bg-red-500",
    "Food": "bg-red-500",
    "Groceries": "bg-blue-500",
    "Transport": "bg-green-500",
    "Fuel": "bg-green-500",
    "Entertainment": "bg-orange-500",
    "Leisure": "bg-orange-500",
    "Subscriptions": "bg-purple-500",
    "Utilities": "bg-cyan-500",
    "Rent": "bg-slate-600",
    "Insurance": "bg-amber-600",
};
const DEFAULT_COLOR = "bg-purple-500";

type BudgetItem = {
    name: string;
    spent: number;
    limit: number;
    color: string;
};

function mapBudgetToItems(budget: BudgetResponse, plan: BudgetPlanResponse): BudgetItem[] {
    const items: BudgetItem[] = [];
    for (const [name, amount] of Object.entries(budget.categories)) {
        const spent = Math.abs(amount);
        const limit = typeof plan[name] === "number" && plan[name] > 0
            ? plan[name]
            : Math.max(spent * 1.2, 100);
        items.push({
            name,
            spent: Math.round(spent * 100) / 100,
            limit: Math.round(limit * 100) / 100,
            color: CATEGORY_COLORS[name] ?? DEFAULT_COLOR,
        });
    }
    return items.sort((a, b) => b.spent - a.spent);
}

export default function BudgetManagerTab() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [budget, setBudget] = useState<BudgetResponse | null>(null);
    const [plan, setPlan] = useState<BudgetPlanResponse>({});
    const [savingsGoal, setSavingsGoal] = useState("");
    const [savingsReason, setSavingsReason] = useState("");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [inputLimits, setInputLimits] = useState<Record<string, string>>({});
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        const email = getStoredUserEmail();
        setUserEmail(email);
        if (!email) {
            setError("Please log in to see your budget.");
            setLoading(false);
            return;
        }
        let cancelled = false;
        Promise.all([getBudget(email), getBudgetPlan(email)])
            .then(([b, p]) => {
                if (!cancelled) {
                    setBudget(b);
                    setPlan(p.plan ?? {});
                    setSavingsGoal(p.savings_goal ?? "");
                    setSavingsReason(p.savings_reason ?? "");
                    setError(null);
                }
            })
            .catch((err) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Failed to load budget.");
                }
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => { cancelled = true; };
    }, []);

    // Initialize input strings from plan + budget (plan value or default max(spent*1.2, 100))
    useEffect(() => {
        if (!budget) return;
        const items = mapBudgetToItems(budget, plan);
        const initial: Record<string, string> = {};
        for (const item of items) {
            initial[item.name] = String(item.limit);
        }
        setInputLimits(initial);
    }, [budget, plan]);

    if (loading) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Monthly Budget Tracker</h2>
                <div className="flex items-center justify-center py-12 text-slate-500">
                    Loading budget…
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Monthly Budget Tracker</h2>
                <div className="rounded-xl border-2 border-red-200 bg-red-50 p-6 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!budget) {
        return (
            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Monthly Budget Tracker</h2>
                <p className="text-slate-600">No budget data yet. Add transactions to see your budget.</p>
            </div>
        );
    }

    const items = mapBudgetToItems(budget, plan);
    const income = budget.income;
    const expenses = Math.abs(budget.expenses);
    const savings = budget.savings;
    const hasNoData = income === 0 && expenses === 0 && items.length === 0;

    const getNumericLimit = (name: string): number => {
        const n = parseFloat(inputLimits[name]);
        return Number.isFinite(n) && n > 0 ? n : 0;
    };
    const totalAllocated = items.reduce((a, item) => a + getNumericLimit(item.name), 0);
    const exceedsIncome = income > 0 && totalAllocated > income;
    const planFromInputs: BudgetPlanResponse = items.reduce(
        (acc, item) => ({ ...acc, [item.name]: getNumericLimit(item.name) }),
        {},
    );
    const allLimitsValid = items.every((item) => getNumericLimit(item.name) > 0);
    const canSave = !saving && items.length > 0 && allLimitsValid;

    const handleLimitChange = (category: string, value: string) => {
        setInputLimits((prev) => ({ ...prev, [category]: value }));
        setSaveMessage(null);
    };

    const handleSavePlan = () => {
        if (!userEmail || !canSave) return;
        setSaving(true);
        setSaveMessage(null);
        setError(null);
        const payload = {
            ...planFromInputs,
            savings_goal: savingsGoal.trim(),
            savings_reason: savingsReason.trim(),
        };
        updateBudgetPlan(userEmail, payload)
            .then((res) => {
                setPlan(planFromInputs);
                setSaveMessage(res?.message ?? "Budget plan saved.");
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : "Failed to save budget plan.");
            })
            .finally(() => setSaving(false));
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Monthly Budget Tracker</h2>

            {userEmail && (
                <p className="text-sm text-slate-500">Using account: {userEmail}</p>
            )}

            {hasNoData && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    <p className="font-medium">No transactions found for this account.</p>
                    <p className="text-sm mt-1">Budget and plan will appear here once transactions exist for <strong>{userEmail ?? "your email"}</strong>. Make sure your transactions in Firestore are stored under this exact email (lowercase).
                    </p>
                </div>
            )}

            {/* Summary: Income and Expenses only (savings is in the Savings card below) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs sm:text-sm text-slate-500">Income</p>
                    <p className="text-xl font-bold text-green-600">${income.toFixed(2)}</p>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <p className="text-xs sm:text-sm text-slate-500">Expenses</p>
                    <p className="text-xl font-bold text-red-600">${expenses.toFixed(2)}</p>
                </div>
            </section>

            {/* Savings card: amount, goal & reason; Update goal button */}
            <section className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg">Savings</h3>
                <p className="text-2xl font-bold text-emerald-700">${savings.toFixed(2)}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="savings-goal" className="block text-sm font-medium text-slate-700 mb-1">
                            Goal
                        </label>
                        <input
                            id="savings-goal"
                            type="text"
                            value={savingsGoal}
                            onChange={(e) => { setSavingsGoal(e.target.value); setSaveMessage(null); }}
                            placeholder="e.g. Emergency fund, MacBook Pro"
                            className="w-full rounded border border-slate-300 px-3 py-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="savings-reason" className="block text-sm font-medium text-slate-700 mb-1">
                            Reason
                        </label>
                        <input
                            id="savings-reason"
                            type="text"
                            value={savingsReason}
                            onChange={(e) => { setSavingsReason(e.target.value); setSaveMessage(null); }}
                            placeholder="e.g. For unexpected expenses"
                            className="w-full rounded border border-slate-300 px-3 py-2"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleSavePlan}
                        disabled={saving}
                        className="rounded-lg bg-emerald-700 px-4 py-2 text-white font-medium disabled:opacity-50 hover:bg-emerald-600"
                    >
                        {saving ? "Saving…" : "Update goal"}
                    </button>
                    {saveMessage && (
                        <span className="text-sm text-green-600">{saveMessage}</span>
                    )}
                </div>
            </section >

            {/* Total budget limits card with Save button */}
            {
                items.length > 0 && (
                    <section className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-600">Total budget limits:</span>
                            <span className="font-semibold">${totalAllocated.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-600">Your income:</span>
                            <span className="font-semibold text-green-600">${income.toFixed(2)}</span>
                        </div>
                        {exceedsIncome && (
                            <p className="text-amber-700 text-sm font-medium rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                                You’re allocating more than your monthly income. This may be from savings or previous months.
                            </p>
                        )}
                        {!allLimitsValid && (
                            <span className="text-amber-700 text-sm">
                                Each budget limit must be a number greater than 0.
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleSavePlan}
                            disabled={!canSave}
                            className="rounded-lg bg-slate-800 px-4 py-2 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700"
                        >
                            {saving ? "Saving…" : "Save budget plan"}
                        </button>
                        {saveMessage && (
                            <span className="text-sm text-green-600">{saveMessage}</span>
                        )}
                    </section>
                )
            }

            {/* Category Cards */}
            {
                items.length === 0 ? (
                    <p className="text-slate-600">No spending by category yet. Transactions will appear here.</p>
                ) : (
                    items.map((item) => {
                        const limit = getNumericLimit(item.name);
                        const percent = limit > 0
                            ? Math.min(Math.round((item.spent / limit) * 100), 100)
                            : 0;
                        const isOver = limit > 0 && item.spent > limit;
                        const inputVal = inputLimits[item.name] ?? String(item.limit);
                        const isInvalid = inputVal !== "" && !(Number.isFinite(parseFloat(inputVal)) && parseFloat(inputVal) > 0);

                        return (
                            <div
                                key={item.name}
                                className={`rounded-xl border-2 p-6 space-y-3 ${isOver
                                    ? "bg-red-50 border-red-400"
                                    : "bg-white border-slate-300"
                                    }`}
                            >
                                <div className="flex flex-wrap justify-between items-center gap-2">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-600">${item.spent.toFixed(2)} /</span>
                                        <label className="sr-only">Budget limit for {item.name} (must be greater than 0)</label>
                                        <input
                                            type="number"
                                            min={0.01}
                                            step={10}
                                            placeholder="0"
                                            value={inputVal}
                                            onChange={(e) => handleLimitChange(item.name, e.target.value)}
                                            className={`w-28 rounded border px-2 py-1 text-right font-semibold ${isInvalid ? "border-red-400 bg-red-50" : "border-slate-300"
                                                }`}
                                        />
                                    </div>
                                </div>
                                <div className="w-full h-4 bg-white border-2 border-slate-300 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color}`}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                                {isOver && (
                                    <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                                        Over budget by ${(item.spent - limit).toFixed(2)}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )
            }
        </div >
    );
}
