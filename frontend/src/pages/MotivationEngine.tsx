import { Heart, TrendingUp, CheckCircle2, Flame } from "lucide-react";

export function MotivationEngine() {
    return (
        <div className="py-24 sm:py-32 bg-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 mb-6">
                        <Heart className="h-4 w-4 text-pink-600" />
                        <span className="text-sm font-semibold text-pink-600">The Motivation Engine</span>
                    </div>
                    <p className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Celebrate wins, not failures
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        Positive reinforcement that encourages better habits without punishment.
                    </p>
                </div>

                {/* Two Features */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                    {/* I Skipped This Button */}
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-3xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                <CheckCircle2 className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">The "I Skipped This" Button</h3>
                        </div>

                        <p className="text-lg text-slate-700 mb-6 relative z-10">
                            Proactively celebrate the purchases you <span className="font-semibold">didn't</span> make.
                        </p>

                        {/* Mock UI */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100 mb-6 relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-slate-500 mb-1">Almost bought</p>
                                    <p className="font-semibold text-slate-900">$25 takeout lunch</p>
                                </div>
                                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                                    <CheckCircle2 className="h-4 w-4" />
                                    I Skipped This
                                </button>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                <p className="text-sm text-blue-900 leading-relaxed">
                                    <span className="inline-block mr-1">🎉</span>
                                    <span className="font-semibold">You just bought yourself 2 hours of freedom</span> closer to Spring Break!
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 relative z-10">
                            Turn moments of restraint into victories. Every skip is progress toward your goals.
                        </p>
                    </div>

                    {/* Non-Toxic Streaks */}
                    <div className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-3xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100">
                                <Flame className="h-7 w-7 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Non-Toxic Streaks</h3>
                        </div>

                        <p className="text-lg text-slate-700 mb-6 relative z-10">
                            Track progress without the pressure. Streaks that encourage, not punish.
                        </p>

                        {/* Mock UI */}
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 mb-6 relative z-10">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-slate-500">Safe-Spend Days</p>
                                    <p className="text-2xl font-bold text-purple-600">7 days</p>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[70%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                                </div>
                                <p className="text-xs text-slate-400 mt-2">3 more days to your personal best!</p>
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {[...Array(7)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-8 rounded-md ${i < 5 ? 'bg-gradient-to-br from-purple-400 to-pink-400 shadow-sm' : 'bg-gray-100'
                                            } flex items-center justify-center`}
                                    >
                                        {i < 5 && <CheckCircle2 className="h-4 w-4 text-white" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <p className="text-sm text-slate-600 relative z-10">
                            No broken chains that make you feel like a failure. Just encouraging progress bars celebrating your wins.
                        </p>
                    </div>
                </div>

                {/* Benefits List */}
                <div className="bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 rounded-3xl p-8 lg:p-12 border border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                        Why This Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                                <TrendingUp className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">Positive Psychology</h4>
                                <p className="text-sm text-slate-600">
                                    Rewards create lasting behavior change better than punishment
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                                <Heart className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">No Shame, No Guilt</h4>
                                <p className="text-sm text-slate-600">
                                    You're in control. We're just here to provide context
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100">
                                <Flame className="h-5 w-5 text-pink-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">Sustainable Habits</h4>
                                <p className="text-sm text-slate-600">
                                    Build long-term awareness, not short-term restriction
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
