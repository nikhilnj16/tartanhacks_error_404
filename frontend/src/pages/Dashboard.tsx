import { useState } from "react";
import Sidebar from "./Sidebar";
import BudgetManagerTab from "./BudgetManagerTab";
import SubscriptionManagerTab from "./SubscriptionManagerTab";
import UserSettingsTab from "./UserSettingsTab";
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

/* -------------------- Types -------------------- */
type Tab =
    | "spending"
    | "predictive"
    | "budget"
    | "subscriptions"
    | "settings";

/* -------------------- Data -------------------- */

const spendingData = [
    { name: "Dining", value: 400, color: "#ef4444" },
    { name: "Groceries", value: 350, color: "#3b82f6" },
    { name: "Transport", value: 250, color: "#22c55e" },
    { name: "Entertainment", value: 150, color: "#f59e0b" },
    { name: "Other", value: 90, color: "#8b5cf6" },
];

const weeklyData = [
    { day: "Mon", amount: 45 },
    { day: "Tue", amount: 82 },
    { day: "Wed", amount: 38 },
    { day: "Thu", amount: 95 },
    { day: "Fri", amount: 120 },
    { day: "Sat", amount: 88 },
    { day: "Sun", amount: 52 },
];

/* -------------------- Component -------------------- */

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("spending");

    return (
        <div className="h-screen w-full flex overflow-hidden bg-[#D1E8E2]">
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
                        {/* Left: Menu button */}
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
                    </div>
                </header>


                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-6 space-y-8">
                    {activeTab === "spending" && <SpendingTab />}
                    {activeTab === "predictive" && <PredictiveTab />}
                    {activeTab === "budget" && <BudgetManagerTab />}
                    {activeTab === "subscriptions" && <SubscriptionManagerTab />}
                    {activeTab === "settings" && <UserSettingsTab />}
                </main>
            </div>
        </div>
    );
}

/* -------------------- Spending Tab -------------------- */

function SpendingTab() {
    return (
        <>
            {/* Summary */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-6">
                    <p className="text-slate-500">Total Spend This Month</p>
                    <h2 className="text-4xl font-bold mt-2">$1,240</h2>
                </div>

                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6">
                    <h3 className="font-semibold mb-2">🎯 Savings Goal</h3>
                    <p className="text-lg font-bold">MacBook Pro</p>
                    <p className="text-sm text-slate-600">$1,850 / $2,500</p>
                    <div className="w-full h-3 bg-white rounded-full mt-3 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[74%]" />
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                        Target: Dec 15, 2026
                    </p>
                </div>
            </section>

            {/* Spending Breakdown */}
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
                                <span className="font-semibold">${d.value}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <div className="bg-yellow-100 border border-yellow-400 rounded-xl p-4 text-center font-medium">
                💡 Biggest Spend: Dining Out ($400)
            </div>

            <section className="bg-white rounded-xl shadow p-6">
                <h3 className="text-xl font-bold mb-4">Weekly Spending Pattern</h3>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={weeklyData}>
                        <XAxis dataKey="day" />
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
                {/* Next Month Prediction */}
                <div className="bg-indigo-50 border border-indigo-300 rounded-xl p-6">
                    <h3 className="font-semibold mb-2">✨ Next Month Prediction</h3>
                    <p className="text-5xl font-bold text-indigo-600">$1,380</p>
                    <p className="text-slate-600 mt-2">
                        +11% from this month
                    </p>
                </div>

                {/* Risk Alert */}
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

            {/* Savings Opportunity */}
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
