import { Clock, Target, Leaf, Zap } from "lucide-react";

export function ReflectionEngine() {
    return (
        <div className="bg-gradient-to-b from-[#F7FBFA] to-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#D1E8E2] px-4 py-2 mb-6">
                        <Zap className="h-4 w-4 text-[#19747E]" />
                        <span className="text-sm font-semibold text-[#19747E]">The Reflection Engine</span>
                    </div>
                    <p className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Every purchase, reframed
                    </p>
                    <p className="mt-4 text-lg text-slate-600">
                        We instantly translate your spending into three meaningful costs that change how you think about money.
                    </p>
                </div>

                {/* Three Cost Types */}
                <div className="grid grid-cols-1 gap-8 lg:gap-12">
                    {/* Time Cost */}
                    <div className="overflow-hidden border border-slate-200 rounded-3xl bg-white hover:border-[#19747E]/50 transition-all shadow-sm hover:shadow-md">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D1E8E2]">
                                        <Clock className="h-7 w-7 text-[#19747E]" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">The Time Cost</h3>
                                        <p className="text-sm text-[#19747E] font-medium">Labor Hours</p>
                                    </div>
                                </div>
                                <p className="text-lg text-slate-700 mb-4">
                                    See exactly how much of your life you traded for each purchase.
                                </p>
                                <div className="bg-[#F7FBFA] border border-[#D1E8E2] rounded-xl p-6 mb-4">
                                    <p className="text-slate-800 mb-2">
                                        <span className="font-semibold">Example:</span> That $18 Uber ride?
                                    </p>
                                    <p className="text-2xl font-bold text-[#19747E]">
                                        = 1.5 hours of work
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    It grounds spending in the reality of your daily grind. Time is the one thing you can never get back.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-[#D1E8E2] to-[#A9D6E5] p-8 lg:p-12 flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1764577291963-6b1e3642a44e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3b3JraW5nJTIwbGFwdG9wJTIwY29mZmVlfGVufDF8fHx8MTc3MDM1NjA0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                    alt="Person working"
                                    className="rounded-2xl shadow-xl w-full max-w-md object-cover aspect-square"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Freedom Cost */}
                    <div className="overflow-hidden border border-slate-200 rounded-3xl bg-white hover:border-amber-300 transition-all shadow-sm hover:shadow-md">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="order-2 lg:order-1 bg-gradient-to-br from-amber-100 to-orange-100 p-8 lg:p-12 flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1706208224221-0944db693705?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjB2YWNhdGlvbiUyMGJlYWNofGVufDF8fHx8MTc3MDQ3OTAwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                    alt="Beach vacation"
                                    className="rounded-2xl shadow-xl w-full max-w-md object-cover aspect-square"
                                />
                            </div>
                            <div className="order-1 lg:order-2 p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100">
                                        <Target className="h-7 w-7 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">The Freedom Cost</h3>
                                        <p className="text-sm text-amber-600 font-medium">Goal Delay</p>
                                    </div>
                                </div>
                                <p className="text-lg text-slate-700 mb-4">
                                    See how each purchase affects your specific goals—whether it's a trip, a new laptop, or concert tickets.
                                </p>
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-4">
                                    <p className="text-slate-800 mb-2">
                                        <span className="font-semibold">Example:</span> This $45 dinner pushed your
                                    </p>
                                    <p className="text-2xl font-bold text-amber-600">
                                        Spring Break Trip back 2 days
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    This is the killer feature. Losing a savings buffer is painless. Delaying a vacation you're excited about? That hurts.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Environmental Cost */}
                    <div className="overflow-hidden border border-slate-200 rounded-3xl bg-white hover:border-green-300 transition-all shadow-sm hover:shadow-md">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="p-8 lg:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">
                                        <Leaf className="h-7 w-7 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-900">The Environmental Cost</h3>
                                        <p className="text-sm text-green-600 font-medium">Carbon Impact</p>
                                    </div>
                                </div>
                                <p className="text-lg text-slate-700 mb-4">
                                    Understand the environmental footprint of your spending habits based on merchant categories.
                                </p>
                                <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-4">
                                    <p className="text-slate-800 mb-2">
                                        <span className="font-semibold">Example:</span> That food delivery?
                                    </p>
                                    <p className="text-2xl font-bold text-green-600 mb-1">
                                        3.2 kg CO₂
                                    </p>
                                    <p className="text-sm text-slate-600">
                                        (Equivalent to charging your phone 400 times)
                                    </p>
                                </div>
                                <p className="text-sm text-slate-600">
                                    Add a layer of ethical responsibility without being preachy. Awareness creates change.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 lg:p-12 flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1594664969282-d96f7a5520d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGxlYXZlcyUyMHN1c3RhaW5hYmlsaXR5fGVufDF8fHx8MTc3MDQ3OTAwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                    alt="Green leaves"
                                    className="rounded-2xl shadow-xl w-full max-w-md object-cover aspect-square"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* How It Works */}
                <div className="mt-20 text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">How does it work?</h3>
                    <p className="max-w-3xl mx-auto text-lg text-slate-600 mb-8">
                        The Reflection Engine runs instantly on every non-essential purchase. Using AI, we automatically classify transactions as "Need" vs. "Want" and show you the true cost only for discretionary spending.
                    </p>
                    <div className="inline-block bg-[#F7FBFA] border border-[#D1E8E2] rounded-2xl px-6 py-4">
                        <p className="text-sm text-slate-700">
                            <span className="font-semibold text-[#19747E]">Example:</span> "Whole Foods" = Need. "Whole Foods (Under $10)" = Want (Snack).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
