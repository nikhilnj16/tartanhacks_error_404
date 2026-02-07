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
        <div className="h-screen w-full flex items-center justify-center px-4 sm:px-6 bg-gradient-to-br from-[#D1E8E2] via-[#E2E2E2] to-[#A9D6E5] overflow-hidden">
            <div className="w-full max-w-md bg-[#F7FBFA] border border-[#E2E2E2] rounded-2xl shadow-xl p-5">
                <h1 className="text-2xl font-bold text-center text-[#19747E] mb-1">
                    Create Account
                </h1>

                <p className="text-center text-slate-500 text-sm mb-4">
                    Start managing your finances smarter
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
                    <Input label="Full Name" name="name" value={form.name} onChange={handleChange} />
                    <Input
                        label="Phone Number"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. 5551234567"
                        hint="10 digits only."
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
                        hint="Use a valid email."
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
                        className={`w-full mt-3 py-2.5 rounded-xl font-semibold text-base transition ${formValid && !loading
                            ? "bg-[#19747E] text-white hover:bg-[#19747E]"
                            : "bg-[#E2E2E2] text-slate-500 cursor-not-allowed"
                            }`}
                    >
                        {loading ? "Signing up…" : "Sign Up"}
                    </button>
                </form>

                <p className="mt-3 text-center text-xs text-slate-600">
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
