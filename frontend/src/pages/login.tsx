import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

type LoginForm = {
    email: string;
    password: string;
};

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [form, setForm] = useState<LoginForm>({
        email: "",
        password: "",
    });

    const emailValid = form.email.length === 0 || EMAIL_REGEX.test(form.email);
    const formValid =
        emailValid &&
        form.email.trim().length > 0 &&
        form.password.length > 0;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setApiError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formValid || loading) return;
        setApiError(null);
        setLoading(true);
        try {
            const res = await loginApi({
                email: form.email.trim(),
                password: form.password,
            });
            localStorage.setItem(AUTH_TOKEN_KEY, res.access_token);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
            navigate("/dashboard");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Login failed. Please try again.";
            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-[#D1E8E2] via-[#E2E2E2] to-[#A9D6E5] overflow-hidden">
            <div className="w-full max-w-md bg-[#F7FBFA] border border-[#E2E2E2] rounded-2xl shadow-xl p-5">
                <h1 className="text-2xl font-bold text-center text-[#19747E] mb-1">
                    Log in
                </h1>

                <p className="text-center text-slate-500 text-sm mb-4">
                    Welcome back. Sign in to continue.
                </p>

                {apiError && (
                    <div
                        role="alert"
                        className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs"
                    >
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        error={
                            form.email.length > 0 && !emailValid
                                ? "Please enter a valid email address."
                                : undefined
                        }
                    />

                    <Input
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        disabled={!formValid || loading}
                        className={`w-full mt-3 py-2.5 rounded-xl font-semibold text-base transition ${formValid && !loading
                            ? "bg-[#19747E] text-white hover:bg-[#19747E]"
                            : "bg-[#E2E2E2] text-slate-500 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Signing in…" : "Log in"}
                    </button>
                </form>

                <p className="mt-3 text-center text-xs text-slate-600">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
                        Sign up
                    </Link>
                </p>
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
    hint?: string;
    error?: string;
};

function Input({
    label,
    name,
    value,
    placeholder,
    type = "text",
    onChange,
    hint,
    error,
}: InputProps) {
    return (
        <div>
            <label className="block text-xs font-medium text-[#19747E] mb-0.5">
                {label}
            </label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required
                placeholder={placeholder}
                className={`w-full rounded-lg px-3 py-1.5 text-sm border focus:outline-none focus:ring-2 ${error
                    ? "border-red-400 focus:ring-red-400"
                    : "border-[#E2E2E2] focus:ring-[#A9D6E5]"
                    }`}
            />
            {hint && !error && <p className="mt-0.5 text-[10px] text-slate-500">{hint}</p>}
            {error && <p className="mt-0.5 text-[10px] text-red-500">{error}</p>}
        </div>
    );
}
