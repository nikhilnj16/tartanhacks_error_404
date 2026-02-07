import { Sparkles, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export function CTA() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#19747E] via-[#135E66] to-[#0D444A] py-24 sm:py-32">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '48px 48px'
                }} />
            </div>

            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    {/* Logo */}
                    <div className="mb-8 inline-flex items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <Sparkles className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-white">Budgetbruh</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
                        Ready to see the true cost of your spending?
                    </h2>

                    <p className="text-xl text-white/90 mb-10">
                        Join the waitlist and be the first to experience a finance app that changes behavior through awareness, not guilt.
                    </p>

                    {/* Email Signup Card */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 mb-8">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 rounded-xl text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-white bg-white"
                                />
                            </div>
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-xl bg-white text-[#19747E] hover:bg-slate-100 px-8 py-3 font-semibold h-auto whitespace-nowrap transition-colors"
                            >
                                <Mail className="mr-2 h-5 w-5" />
                                Get Early Access
                            </Link>
                        </div>
                        <p className="text-sm text-white/70 mt-4">
                            🎉 Join 5,000+ people on the waitlist. No spam, ever.
                        </p>
                    </div>

                    {/* Value Props */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                        <div className="text-white/90">
                            <div className="text-3xl font-bold mb-1">3</div>
                            <div className="text-sm">Cost Perspectives</div>
                        </div>
                        <div className="text-white/90">
                            <div className="text-3xl font-bold mb-1">100%</div>
                            <div className="text-sm">Shame-Free</div>
                        </div>
                        <div className="text-white/90">
                            <div className="text-3xl font-bold mb-1">AI</div>
                            <div className="text-sm">Powered Insights</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="relative mt-16 border-t border-white/20 pt-8">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/70 text-sm">
                        <p>© 2026 Budgetbruh. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
