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

/* -------------------- Predictive Analysis Tab -------------------- */
function PredictiveTab() {
    return (
        <>
            <h2 className="text-2xl font-bold">
                AI-Powered Spending Predictions
            </h2>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 border border-indigo-300 rounded-xl p-6">
                    <h3 className="font-semibold mb-2">✨ Next Month Prediction</h3>
                    <p className="text-5xl font-bold text-indigo-600">$1,380</p>
                    <p className="text-slate-600 mt-2">
                        +11% from this month
                    </p>
                </div>

                <div className="bg-rose-50 border border-rose-300 rounded-xl p-6">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        ⚠️ Risk Alert
                    </h3>
                    <p className="text-slate-700">
                        You're likely to overspend on Dining Out next week based
                        on your recent patterns.
                    </p>
                </div>
            </section>

            <section className="bg-emerald-50 border border-emerald-300 rounded-xl p-6">
                <h3 className="font-semibold mb-2">💰 Savings Opportunity</h3>
                <p className="text-slate-700">
                    By reducing dining out by <strong>25%</strong>, you could
                    save an extra <strong>$100/month</strong> and reach your
                    MacBook Pro goal <strong>2 months earlier</strong>.
                </p>
            </section>
        </>
    );
}