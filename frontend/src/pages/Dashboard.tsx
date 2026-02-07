import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import axios from "axios";
import Sidebar from "./Sidebar";
import BudgetManagerTab from "./BudgetManagerTab";
import SubscriptionManagerTab from "./SubscriptionManagerTab";
import CarbonEmissionsTab from "./CarbonEmissionsTab";
import UserSettingsTab from "./UserSettingsTab";

import MoneyRain from "../components/MoneyRain";
import Loader from "../components/Loader";
import { getBudget, getBudgetPlan, getStoredUserEmail } from "../api/budget";
import logo from "../assets/logo.png";

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
} from "recharts";

type Tab =
    | "spending"
    | "predictive"
    | "budget"
    | "subscriptions"
    | "carbon"
    | "settings";

/* -------------------- Data -------------------- */

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#F472B6", "#111827"];

interface SpendingItem {
    name: string;
    value: number;
    color: string;
}

interface WeeklyItem {
    name: string;
    amount: number;
}

/* -------------------- Component -------------------- */

export default function Dashboard() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("spending");

    // State for Data
    const [loading, setLoading] = useState(true);
    const [spendingData, setSpendingData] = useState<SpendingItem[]>([]);
    const [weeklyData, setWeeklyData] = useState<WeeklyItem[]>([]);
    const [totalMonthlySpend, setTotalMonthlySpend] = useState<number>(0);
    const [savings, setSavings] = useState<number>(0);
    const [savingsGoal, setSavingsGoal] = useState("");
    const [savingsReason, setSavingsReason] = useState("");

    useEffect(() => {
        const email = getStoredUserEmail();
        if (!email) {
            setLoading(false);
            return;
        }

        const fetchTransactions = axios.get(`http://localhost:8000/transactions?user_email=${email}`);
        const fetchAnalysis = axios.get(`http://localhost:8000/analysis?user_email=${email}`);
        const fetchBudget = getBudget(email);
        const fetchPlan = getBudgetPlan(email);

        Promise.all([fetchTransactions, fetchAnalysis, fetchBudget, fetchPlan])
            .then(([transRes, analysisRes, budgetRes, planRes]) => {
                // 1. Transactions (Graph 2)
                const transactions = transRes.data;
                if (transactions && transactions.length > 0) {
                    const lastTransaction = transactions[transactions.length - 1];
                    const endDate = new Date(lastTransaction.date);
                    endDate.setHours(23, 59, 59, 999);
                    const startDate = new Date(endDate);
                    startDate.setDate(endDate.getDate() - 6);
                    startDate.setHours(0, 0, 0, 0);

                    const last7DaysMap: { [key: string]: number } = {};
                    for (let i = 0; i < 7; i++) {
                        const d = new Date(startDate);
                        d.setDate(startDate.getDate() + i);
                        const dateKey = d.toISOString().split('T')[0];
                        last7DaysMap[dateKey] = 0;
                    }

                    transactions.forEach((t: any) => {
                        const tDate = new Date(t.date);
                        if (tDate >= startDate && tDate <= endDate) {
                            if (t.amount < 0) {
                                const absAmount = Math.abs(t.amount);
                                const dateKey = t.date;
                                if (last7DaysMap[dateKey] !== undefined) {
                                    last7DaysMap[dateKey] += absAmount;
                                }
                            }
                        }
                    });

                    const formattedChartData = Object.keys(last7DaysMap).sort().map(dateKey => {
                        const d = new Date(dateKey);
                        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                        return {
                            name: daysOfWeek[d.getDay()],
                            amount: parseFloat(last7DaysMap[dateKey].toFixed(2))
                        };
                    });
                    setWeeklyData(formattedChartData);
                }

                // 2. Analysis (Graph 1)
                const { spending, monthly_expenditure } = analysisRes.data;
                if (monthly_expenditure !== undefined) {
                    setTotalMonthlySpend(monthly_expenditure);
                }
                if (spending) {
                    const formattedPieData = Object.keys(spending).map((key, index) => ({
                        name: key,
                        value: spending[key],
                        color: COLORS[index % COLORS.length]
                    }));
                    setSpendingData(formattedPieData);
                }

                // 3. Savings (MoneyRain & SpendingTab)
                setSavings(budgetRes.savings);

                // 4. Budget Plan (SpendingTab)
                setSavingsGoal(planRes.savings_goal ?? "");
                setSavingsReason(planRes.savings_reason ?? "");
            })
            .catch((error) => {
                console.error("Error fetching dashboard data:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <Loader fullScreen />;
    }

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#D1E8E2]">
            <MoneyRain savings={savings} />
            {/* Sidebar */}
            <Sidebar
                isOpen={sidebarOpen}
                activeTab={activeTab}
                onSelectTab={(tab) => {
                    setActiveTab(tab);
                    setSidebarOpen(false);
                }}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Area */}
            <div className="flex-1 flex flex-col ">
                {/* Top Navbar */}
                <header className="h-14 bg-[#F7FBFA] border-b border-[#E2E2E2] sticky top-0 z-20">
                    <div className="relative h-full flex items-center px-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg border-2 border-slate-800 p-2 md:hidden z-10"
                        >
                            ☰
                        </button>

                        {/* Center: Title */}
                        <img
                            src={logo}
                            alt="BudgetBruh"
                            className="absolute left-1/2 -translate-x-1/2 h-8 md:hidden"
                        />

                        <button
                            onClick={() => {
                                localStorage.removeItem("auth_user");
                                navigate("/");
                            }}
                            className="ml-auto flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors font-medium z-10"
                            title="Log Out"
                        >
                            <span className="hidden md:inline">Log Out</span>
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6 space-y-8">
                    {activeTab === "spending" && (
                        <SpendingTab
                            spendingData={spendingData}
                            weeklyData={weeklyData}
                            totalMonthlySpend={totalMonthlySpend}
                            savings={savings}
                            savingsGoal={savingsGoal}
                            savingsReason={savingsReason}
                        />
                    )}
                    {activeTab === "predictive" && <PredictiveTab />}
                    {activeTab === "budget" && <BudgetManagerTab />}
                    {activeTab === "subscriptions" && <SubscriptionManagerTab />}
                    {activeTab === "carbon" && <CarbonEmissionsTab />}
                    {activeTab === "settings" && <UserSettingsTab />}
                </main>
            </div>
        </div>
    );
}

/* -------------------- Spending Tab -------------------- */

interface SpendingTabProps {
    spendingData: SpendingItem[];
    weeklyData: WeeklyItem[];
    totalMonthlySpend: number;
    savings: number;
    savingsGoal: string;
    savingsReason: string;
}

function SpendingTab({
    spendingData,
    weeklyData,
    totalMonthlySpend,
    savings,
    savingsGoal,
    savingsReason
}: SpendingTabProps) {

    // Calculate biggest spend category for the insight card
    const biggestSpend = spendingData.length > 0
        ? spendingData.reduce((prev, current) => (prev.value > current.value) ? prev : current)
        : null;

    return (
        <>
            {/* Summary */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-slate-500">Total Spend This Month</p>
                    <h2 className="text-4xl font-bold mt-2">${totalMonthlySpend.toLocaleString()}</h2>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6">
                    <h3 className="font-semibold mb-2">🎯 Savings</h3>
                    <p className="text-2xl font-bold text-emerald-700">
                        ${savings.toFixed(2)}
                    </p>
                    {savingsGoal && (
                        <p className="text-lg font-semibold mt-3">Goal: ${savingsGoal}</p>
                    )}
                    {savingsReason && (
                        <p className="text-sm text-slate-600 mt-1">Reason: {savingsReason}</p>
                    )}
                    {!savingsGoal && !savingsReason && (
                        <p className="text-sm text-slate-500 mt-2">Set your savings goal and reason on the Budget Planner tab.</p>
                    )}
                </div>
            </section>

            {/* Graph 1: Spending Breakdown (Pie Chart) */}
            <section className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Spending Breakdown</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={spendingData}
                                dataKey="value"
                                innerRadius={70}
                                outerRadius={100}
                            >
                                {spendingData.map((d, i) => (
                                    <Cell key={i} fill={d.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>

                    <ul className="space-y-3">
                        {spendingData.map((d) => (
                            <li key={d.name} className="flex justify-between">
                                <span>{d.name}</span>
                                <span className="font-semibold">${d.value.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {biggestSpend && (
                <div className="bg-yellow-100 border border-yellow-400 rounded-xl p-4 text-center font-medium">
                    💡 Biggest Spend: {biggestSpend.name} (${biggestSpend.value.toFixed(2)})
                </div>
            )}

            {/* Graph 2: Weekly Spending Pattern (Bar Chart) */}
            <section className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Daily Spending Pattern (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={weeklyData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </section>
        </>
    );
}

type TimeRange = "week" | "month" | "total";

// Helper: Get User Email (Replace with your actual auth context)


// Helper: Ensure consistent date strings (YYYY-MM-DD)
const getYYYYMMDD = (d: Date) => {
    return d.toISOString().split('T')[0];
};
interface PredictionData {
    prediction_amount: number;
    percentage_change: number;
    savings_category: string;
    savings_amount: number;
    months_saved: number;
}

function PredictiveTab() {
    // --- State ---
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [transactions, setTransactions] = useState<any[]>([]);
    const [chartData, setChartData] = useState<any[]>([]);

    // Prediction State
    const [prediction, setPrediction] = useState<PredictionData | null>(null);
    const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);

    // Interaction State
    const [selectedBarKey, setSelectedBarKey] = useState<string | null>(null);
    const [selectedTransactions, setSelectedTransactions] = useState<any[]>([]);

    // --- 1. Fetch Data ---
    useEffect(() => {
        const email = getStoredUserEmail();
        axios.get(`http://localhost:8000/transactions_valid?user_email=${email}`)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setTransactions(response.data);
                } else {
                    setTransactions([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching transactions:", error);
                setTransactions([]);
            });
    }, []);

    // --- 2. Call LLM Prediction (Triggered when transactions are loaded) ---
    useEffect(() => {
        if (!transactions || transactions.length === 0) return;

        // Avoid re-fetching if we already have data
        if (prediction) return;

        setIsLoadingPrediction(true);

    }, [transactions]);


    useEffect(() => {
        // Wait for transactions to load first (optional, but looks better)
        if (!transactions || transactions.length === 0) return;

        // Prevent re-fetching if we already have a prediction
        if (prediction) return;

        setIsLoadingPrediction(true);
        const email = getStoredUserEmail();
        axios.get(`http://localhost:8000/prediction?user_email=${email}`)
            .then((response) => {
                console.log("Prediction received:", response.data);

                // FIX 1: Check for the object properties, NOT Array.isArray
                if (response.data && response.data.prediction_amount !== undefined) {

                    // FIX 2: Set the PREDICTION state, not transactions
                    setPrediction(response.data);
                } else {
                    console.warn("Invalid prediction format:", response.data);
                }
            })
            .catch((error) => {
                console.error("Error fetching prediction:", error);
            })
            .finally(() => {
                // FIX 3: Turn off loading state
                setIsLoadingPrediction(false);
            });

    }, [transactions]);

    // --- 3. Process Graph Data (Same logic as before) ---
    useEffect(() => {
        if (!transactions || transactions.length === 0) return;

        // Sort to get the latest transaction
        const sortedTxns = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const lastTxn = sortedTxns[sortedTxns.length - 1];

        const endDate = new Date(lastTxn.date);
        endDate.setHours(23, 59, 59, 999);

        const groupedData: { [key: string]: { amount: number, txns: any[], label: string, sortIndex: number } } = {};

        let startDate = new Date(endDate);

        if (timeRange === "week") {
            startDate.setDate(endDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);
            for (let i = 0; i < 7; i++) {
                const d = new Date(startDate);
                d.setDate(startDate.getDate() + i);
                const key = getYYYYMMDD(d);
                const label = d.toLocaleDateString('en-US', { weekday: 'short' });
                groupedData[key] = { amount: 0, txns: [], label: label, sortIndex: i };
            }
        } else if (timeRange === "month") {
            startDate.setDate(endDate.getDate() - 27);
            startDate.setHours(0, 0, 0, 0);
            for (let i = 0; i < 4; i++) {
                const key = `week-${i}`;
                const label = `Week ${i + 1}`;
                groupedData[key] = { amount: 0, txns: [], label: label, sortIndex: i };
            }
        } else {
            startDate.setMonth(endDate.getMonth() - 5);
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            for (let i = 0; i < 6; i++) {
                const d = new Date(startDate);
                d.setMonth(startDate.getMonth() + i);
                const key = d.toISOString().substring(0, 7);
                const label = d.toLocaleDateString('en-US', { month: 'short' });
                groupedData[key] = { amount: 0, txns: [], label: label, sortIndex: i };
            }
        }

        transactions.forEach(t => {
            if (!t.date) return;
            const tDate = new Date(t.date);
            const isExpenses = t.amount < 0;

            let categoryLabel = "Uncategorized";
            if (Array.isArray(t.category)) {
                categoryLabel = t.category[0];
            } else if (typeof t.category === 'string') {
                categoryLabel = t.category;
            }
            const isImportant = categoryLabel === "Important";

            if (tDate >= startDate && tDate <= endDate && isExpenses && !isImportant) {
                let groupKey = "";
                if (timeRange === "week") {
                    groupKey = t.date;
                } else if (timeRange === "month") {
                    const diffTime = tDate.getTime() - startDate.getTime();
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    const weekIndex = Math.floor(diffDays / 7);
                    const safeWeekIndex = Math.min(weekIndex, 3);
                    if (safeWeekIndex >= 0) groupKey = `week-${safeWeekIndex}`;
                } else {
                    groupKey = t.date.substring(0, 7);
                }
                if (groupedData[groupKey]) {
                    groupedData[groupKey].amount += Math.abs(t.amount);
                    groupedData[groupKey].txns.push(t);
                }
            }
        });

        const finalChartData = Object.values(groupedData)
            .sort((a, b) => a.sortIndex - b.sortIndex)
            .map((item, index) => ({
                key: item.label + index,
                ...item,
                amount: parseFloat(item.amount.toFixed(2))
            }));

        setChartData(finalChartData);
        setSelectedBarKey(null);
        setSelectedTransactions([]);

    }, [timeRange, transactions]);

    const handleBarClick = (data: any) => {
        if (data && data.activePayload && data.activePayload.length > 0) {
            const payload = data.activePayload[0].payload;
            setSelectedBarKey(payload.key);
            setSelectedTransactions(payload.txns);
        }
    };

    const selectedTotal = chartData.find(d => d.key === selectedBarKey)?.amount.toFixed(2) || "0.00";

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">AI Spending Predictions</h2>
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-slate-200">
                    {(["week", "month", "total"] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${timeRange === range
                                ? "bg-rose-500 text-white shadow-sm"
                                : "text-slate-500 hover:bg-slate-50"
                                }`}
                        >
                            {range === "week" ? "Week" : range === "month" ? "Month" : "Total"}
                        </button>
                    ))}
                </div>
            </div>

            {/* --- Graph Section --- */}
            <section className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-2">Discretionary Spending</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} onClick={handleBarClick}>
                            <XAxis dataKey="label" fontSize={12} tickMargin={5} />
                            <YAxis fontSize={12} />
                            <Tooltip cursor={{ fill: '#f3f4f6' }} />
                            <Bar dataKey="amount" radius={[4, 4, 0, 0]} cursor="pointer">
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.key === selectedBarKey ? "#f43f5e" : "#fda4af"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* --- Details Section --- */}
            {selectedBarKey && (
                <section className="bg-white border-l-4 border-rose-500 rounded-r-xl shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-slate-800">Transactions</h3>
                        <span className="text-2xl font-bold text-rose-600">${selectedTotal}</span>
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {selectedTransactions.length > 0 ? selectedTransactions.map((t, idx) => {
                            const confidence = Array.isArray(t.category) && t.category.length > 1
                                ? (t.category[1] * 100).toFixed(0) : "N/A";
                            const categoryName = Array.isArray(t.category) ? t.category[0] : t.category;

                            return (
                                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-700">{t.place}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded">{categoryName}</span>
                                            <span className="text-xs text-slate-400">{t.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-rose-500">-${Math.abs(t.amount).toFixed(2)}</div>
                                        {confidence !== "N/A" && <div className="text-xs text-indigo-600 font-medium mt-1">{confidence}% AI Conf.</div>}
                                    </div>
                                </div>
                            );
                        }) : <p className="text-slate-400 italic text-sm">No transactions.</p>}
                    </div>
                </section>
            )}

            {/* --- 3. DYNAMIC AI INSIGHTS (LLM Powered) --- */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-indigo-50 border border-indigo-300 rounded-xl p-6 relative overflow-hidden">
                    {isLoadingPrediction ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-indigo-500 animate-pulse font-medium">Generating Prediction...</span>
                        </div>
                    ) : prediction ? (
                        <>
                            <h3 className="font-semibold mb-2">✨ Next Month Prediction</h3>
                            <p className="text-5xl font-bold text-indigo-600">
                                ${prediction.prediction_amount.toLocaleString()}
                            </p>
                            <p className="text-slate-600 mt-2">
                                {prediction.percentage_change > 0 ? "+" : "-"}
                                {prediction.percentage_change.toFixed(2)}% from this month
                            </p>
                        </>
                    ) : (
                        <div className="text-slate-400">Waiting for data...</div>
                    )}
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 relative overflow-hidden">
                    {isLoadingPrediction ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-emerald-500 animate-pulse font-medium">Analyzing Savings...</span>
                        </div>
                    ) : prediction ? (
                        <>
                            <h3 className="font-semibold mb-2">💰 Savings Opportunity</h3>
                            <p className="text-slate-700">
                                By reducing <strong>{prediction.savings_category}</strong> by <strong>25%</strong>,
                                you could save an extra <strong>${prediction.savings_amount}/month</strong> and
                                reach your goal <strong>{prediction.months_saved} months earlier</strong>.
                            </p>
                        </>
                    ) : (
                        <div className="text-slate-400">Waiting for data...</div>
                    )}
                </div>
            </section>
        </div>
    );
}