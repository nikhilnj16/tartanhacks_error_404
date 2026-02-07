import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup as signupApi } from "../api/auth";

const PHONE_REGEX = /^\d{10}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

type SignupForm = {
    name: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function Signup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

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

    const phoneValid = PHONE_REGEX.test(form.phone);
    const emailValid = form.email.length === 0 || EMAIL_REGEX.test(form.email);

    const formValid =
        passwordsMatch &&
        phoneValid &&
        emailValid &&
        form.name.trim().length > 0 &&
        form.email.trim().length > 0 &&
        form.password.length > 0;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
            setForm({ ...form, phone: digitsOnly });
            return;
        }
        setForm({ ...form, [name]: value });
        setApiError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formValid || loading) return;
        setApiError(null);
        setLoading(true);
        try {
            const res = await signupApi({
                email: form.email.trim(),
                password: form.password,
                name: form.name.trim(),
                phone_number: form.phone,
                full_name: form.name.trim() || undefined,
            });
            localStorage.setItem(AUTH_TOKEN_KEY, res.access_token);
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(res.user));
            navigate("/bank-connection");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Sign up failed. Please try again.";
            setApiError(message);
        } finally {
            setLoading(false);
        }
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

                {apiError && (
                    <div
                        role="alert"
                        className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                    >
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 5551234567"
                        hint="Enter 10 digits only (numbers, no spaces or symbols)."
                        error={
                            form.phone.length > 0 && !phoneValid
                                ? "Phone must be exactly 10 digits."
                                : undefined
                        }
                    />
                    <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        hint="We'll use this to sign you in. Use a valid email format (e.g. name@example.com)."
                        error={
                            form.email.length > 0 && !emailValid
                                ? "Please enter a valid email address."
                                : undefined
                        }
                    />
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
                        disabled={!formValid || loading}
                        className={`w-full mt-4 py-3 rounded-xl font-semibold text-base sm:text-lg transition ${formValid && !loading
                                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                                : "bg-slate-300 text-slate-500 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Signing up…" : "Sign Up"}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                        Log in
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
            {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
