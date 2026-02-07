import { XCircle, Heart, Lock, Lightbulb, Shield, Target } from "lucide-react";

export function Philosophy() {
    return (
        <div className="py-24 sm:py-32 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-base font-semibold text-[#19747E]">The Core Philosophy</h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        A different approach to money
                    </p>
                </div>

                {/* Problem vs Solution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                    {/* The Problem */}
                    <div className="p-8 bg-red-50 border border-red-100 rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                                <XCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-red-900">The Problem</h3>
                        </div>
                        <p className="text-lg text-red-800 mb-6">
                            Traditional finance apps ask: <span className="font-semibold">"How much did you spend?"</span>
                        </p>
                        <p className="text-red-700">
                            Then they shame you for hitting arbitrary limits, lock your spending, and make you feel guilty about every purchase.
                        </p>
                    </div>

                    {/* Our Solution */}
                    <div className="p-8 bg-gradient-to-br from-[#D1E8E2]/30 to-[#A9D6E5]/30 border border-[#D1E8E2] rounded-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D1E8E2]">
                                <Lightbulb className="h-6 w-6 text-[#19747E]" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#19747E]">Our Solution</h3>
                        </div>
                        <p className="text-lg text-slate-700 mb-6">
                            We ask: <span className="font-semibold text-[#135E66]">"What did this decision actually cost you?"</span>
                        </p>
                        <p className="text-slate-600">
                            We translate abstract dollars into visceral, relatable trade-offs that help you make better decisions without the guilt.
                        </p>
                    </div>
                </div>

                {/* Core Principles */}
                <div className="mx-auto max-w-3xl">
                    <h3 className="text-center text-2xl font-bold mb-10 text-slate-900">
                        Our Four Principles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* No Shaming */}
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
                                <Heart className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">No Shaming</h4>
                                <p className="text-sm text-slate-600">We never say "bad spend"</p>
                            </div>
                        </div>

                        {/* No Locking */}
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                                <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">No Locking</h4>
                                <p className="text-sm text-slate-600">We never stop a transaction</p>
                            </div>
                        </div>

                        {/* No Budgeting */}
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                                <Lock className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">No Budgeting</h4>
                                <p className="text-sm text-slate-600">No arbitrary category limits</p>
                            </div>
                        </div>

                        {/* Only Reflection */}
                        <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                                <Target className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">One Reflection</h4>
                                <p className="text-sm text-slate-600">Just real, relatable context</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
