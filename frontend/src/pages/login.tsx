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
        <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 sm:px-6">
            <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-900">
                    Log in
                </h1>

                <p className="text-center text-slate-500 mt-2 mb-6 text-sm sm:text-base">
                    Welcome back. Sign in to continue.
                </p>

                {apiError && (
                    <div
                        role="alert"
                        className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                    >
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className={`w-full rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base border focus:outline-none focus:ring-2 ${
                                form.email.length > 0 && !emailValid
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-slate-300 focus:ring-indigo-500"
                            }`}
                        />
                        {form.email.length > 0 && !emailValid && (
                            <p className="mt-1 text-xs text-red-500">Please enter a valid email address.</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                            className="w-full rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!formValid || loading}
                        className={`w-full mt-4 py-3 rounded-xl font-semibold text-base sm:text-lg transition ${
                            formValid && !loading
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-slate-300 text-slate-500 cursor-not-allowed"
                        }`}
                    >
                        {loading ? "Signing in…" : "Log in"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}
