import { useState, useEffect } from "react";
import { User, Bell, Shield, Save, Mail } from "lucide-react";

export default function UserSettingsTab() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);

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

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
                    <p className="text-slate-500 mt-1">Manage your profile and preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#19747E] text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:bg-[#145E66] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Navigation / Quick Links (Optional, for now just profile snippet) */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#D1E8E2] to-[#A9D6E5] rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                            <span className="text-3xl font-bold text-[#19747E]">
                                {name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900">{name}</h3>
                        <p className="text-sm text-slate-500">{email}</p>
                    </div>
                </div>

                {/* Right Column: Forms */}
                <div className="md:col-span-2 space-y-6">

                    {/* Profile Section */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <User className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Profile Information</h3>
                                <p className="text-xs text-slate-500">Update your personal details</p>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="grid grid-cols-1 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#19747E] focus:ring-4 focus:ring-[#19747E]/10 transition-all outline-none text-slate-700"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#19747E] focus:ring-4 focus:ring-[#19747E]/10 transition-all outline-none text-slate-700 bg-slate-50 cursor-not-allowed"
                                            placeholder="john@example.com"
                                            disabled
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1.5 ml-1">
                                        Email cannot be changed without verification.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Notifications Section */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Bell className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Notifications</h3>
                                <p className="text-xs text-slate-500">Manage how we communicate with you</p>
                            </div>
                        </div>

                        <div className="divide-y divide-slate-100">
                            <ToggleRow
                                label="Budget Alerts"
                                description="Get notified when you exceed 80% of your budget."
                                checked={notifications.budgetAlerts}
                                onChange={() => toggle("budgetAlerts")}
                            />
                            <ToggleRow
                                label="Weekly Summary"
                                description="Receive a weekly breakdown of your spending habits."
                                checked={notifications.weeklySummary}
                                onChange={() => toggle("weeklySummary")}
                            />
                            <ToggleRow
                                label="Subscription Reminders"
                                description="Get alerted 3 days before a subscription renews."
                                checked={notifications.subscriptionReminders}
                                onChange={() => toggle("subscriptionReminders")}
                            />
                            <ToggleRow
                                label="Savings Updates"
                                description="Celebratory notifications when you reach milestones."
                                checked={notifications.savingsUpdates}
                                onChange={() => toggle("savingsUpdates")}
                            />
                        </div>
                    </section>

                    {/* Security Section (Placeholder) */}
                    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden opacity-80">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <Shield className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">Security</h3>
                                <p className="text-xs text-slate-500">Password and authentication</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <button className="text-sm font-medium text-[#19747E] hover:underline">
                                Change Password
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

/* -------------------- Toggle Row Component -------------------- */

function ToggleRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
            <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-slate-900">{label}</h4>
                <p className="text-xs text-slate-500">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#19747E]' : 'bg-slate-200'
                    }`}
            >
                <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    );
}
