import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

type SignupForm = {
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Signup() {
    const navigate = useNavigate();

    const [form, setForm] = useState<SignupForm>({
        name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const passwordsMatch =
        form.password.length > 0 &&
        form.password === form.confirmPassword;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) return;
        navigate("/bank-connection");
    };

    return (
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 sm:px-6">
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900">
                    Create Account
                </h1>

                <p className="text-center text-slate-500 mt-2 mb-6 text-sm sm:text-base">
                    Start managing your finances smarter
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
                    <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />
                    <Input label="Email Address" name="email" type="email" value={form.email} onChange={handleChange} />
                    <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} />
                    <Input
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        error={
                            form.confirmPassword.length > 0 && !passwordsMatch
                                ? "Passwords do not match"
                                : undefined
                        }
                    />

                    <button
                        type="submit"
                        disabled={!passwordsMatch}
                        className={`w-full mt-4 py-3 rounded-xl font-semibold text-base sm:text-lg transition ${passwordsMatch
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-slate-300 text-slate-500 cursor-not-allowed"
                            }`}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

/* ---------- Input Component ---------- */

type InputProps = {
    label: string;
    name: string;
    value: string;
    placeholder?: string;
    type?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
};

function Input({
    label,
    name,
    value,
    placeholder,
    type = "text",
    onChange,
    error,
}: InputProps) {
    return (
        <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                {label}
            </label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                className={`w-full rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base border focus:outline-none focus:ring-2 ${error
                        ? "border-red-400 focus:ring-red-400"
                        : "border-slate-300 focus:ring-indigo-500"
                    }`}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
