import { useState, useEffect } from "react";

export default function UserSettingsTab() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const raw = localStorage.getItem("auth_user");
        if (raw) {
            try {
                const user = JSON.parse(raw);
                setName(user.name || user.full_name || "User");
                setEmail(user.email || "");
            } catch { }
        }
    }, []);

    const [notifications, setNotifications] = useState({
        budgetAlerts: true,
        weeklySummary: true,
        subscriptionReminders: true,
        savingsUpdates: true,
    });

    const toggle = (key: keyof typeof notifications) => {
        setNotifications((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="space-y-8 max-w-3xl">
            {/* Title */}
            <h2 className="text-2xl font-bold">User Settings</h2>

            {/* Profile Information */}
            <section className="bg-white border-2 border-black rounded-xl p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                    👤 Profile Information
                </h3>

                <div className="space-y-3">
                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Name
                        </label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border-2 border-black px-4 py-2 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-600 mb-1">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border-2 border-black px-4 py-2 focus:outline-none"
                        />
                    </div>
                </div>
            </section>

            {/* Notifications */}
            <section className="bg-white border-2 border-black rounded-xl p-6 space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold">
                    🔔 Notifications
                </h3>

                <div className="space-y-3">
                    <Checkbox
                        label="Budget alerts when overspending"
                        checked={notifications.budgetAlerts}
                        onChange={() => toggle("budgetAlerts")}
                    />
                    <Checkbox
                        label="Weekly spending summary"
                        checked={notifications.weeklySummary}
                        onChange={() => toggle("weeklySummary")}
                    />
                    <Checkbox
                        label="Subscription renewal reminders"
                        checked={notifications.subscriptionReminders}
                        onChange={() => toggle("subscriptionReminders")}
                    />
                    <Checkbox
                        label="Savings goal progress updates"
                        checked={notifications.savingsUpdates}
                        onChange={() => toggle("savingsUpdates")}
                    />
                </div>
            </section>

            {/* Save Button */}
            <button className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-emerald-600 transition">
                💾 Save Changes
            </button>
        </div>
    );
}

/* -------------------- Checkbox Component -------------------- */

function Checkbox({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-5 h-5 accent-blue-600"
            />
            <span className="text-slate-700">{label}</span>
        </label>
    );
}
