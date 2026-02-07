import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function BankConnection() {
    const navigate = useNavigate();

    const [bank, setBank] = useState("");
    const [accepted, setAccepted] = useState(false);

    const handleSubmit = () => {
        if (bank && accepted) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Link your bank
                </h1>
                <p className="text-slate-500 mb-6">
                    Connect your account to get personalized insights
                </p>

                {/* Bank Select */}
                <label className="block text-sm font-medium text-slate-700 mb-2">
                    Choose your bank
                </label>

                <select
                    value={bank}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setBank(e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Select a bank</option>
                    <option>Chase</option>
                    <option>Bank of America</option>
                    <option>Wells Fargo</option>
                    <option>Capital One</option>
                </select>

                {/* Promise Box */}
                <div className="border-2 border-indigo-500 rounded-xl p-4 bg-indigo-50 mb-6">
                    <h3 className="text-indigo-700 font-semibold mb-2">
                        Our Promise to You
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                        We only read, we never touch. Your data is encrypted and never shared.
                        We analyze your transactions to help you budget better.
                    </p>
                </div>

                {/* Terms */}
                <label className="flex items-center gap-3 mb-6">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={() => setAccepted(!accepted)}
                        className="h-5 w-5 accent-indigo-600"
                    />
                    <span className="text-slate-700 text-sm">
                        I accept the terms and conditions
                    </span>
                </label>

                {/* Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!bank || !accepted}
                    className={`w-full py-3 rounded-lg text-lg font-semibold transition ${bank && accepted
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "bg-slate-300 text-slate-500 cursor-not-allowed"
                        }`}
                >
                    Analyze My Trades
                </button>
            </div>
        </div>
    );
}
