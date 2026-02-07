import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";
import { Philosophy } from "./Philosophy";
import { ReflectionEngine } from "./ReflectionEngine";
import { MotivationEngine } from "./MotivationEngine";
import { CTA } from "./CTA";

export default function InfoPage() {
    return (
        <div className="w-full">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#D1E8E2] via-[#E2E2E2] to-[#A9D6E5] min-h-screen">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, #19747E 1px, transparent 0)',
                        backgroundSize: '48px 48px'
                    }} />
                </div>

                {/* Header / Top Right Buttons */}
                <div className="absolute top-0 right-0 p-6 z-10 flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-sm font-semibold text-[#19747E] hover:text-[#145E66] transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        to="/signup"
                        className="rounded-lg bg-[#19747E] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#145E66] transition-all"
                    >
                        Sign up
                    </Link>
                </div>

                <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                    <div className="text-center">
                        {/* Logo/Brand */}
                        <div className="mb-8 inline-flex items-center justify-center">
                            <img src={logo} alt="BudgetBruh" className="h-32 w-auto" />
                        </div>

                        {/* Main Headline */}
                        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-[#19747E] sm:text-6xl lg:text-7xl drop-shadow-sm">
                            See the <span className="text-[#135E66]">true cost</span> of every purchase
                        </h1>

                        {/* The One-Sentence Pitch */}
                        <p className="mx-auto mt-6 max-w-3xl text-xl text-slate-700 sm:text-2xl font-medium">
                            A personal finance app that reveals what purchases really cost—in{" "}
                            <span className="font-bold text-[#135E66]">labor hours</span>,{" "}
                            <span className="font-bold text-[#135E66]">goal delays</span>, and{" "}
                            <span className="font-bold text-[#135E66]">carbon impact</span>.
                        </p>

                        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                            Change behavior through awareness, not guilt.
                        </p>

                        {/* CTA Buttons */}
                        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center rounded-xl bg-[#19747E] px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-[#145E66] hover:-translate-y-0.5"
                            >
                                Get Early Access
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center rounded-xl border-2 border-[#19747E] px-8 py-4 text-lg font-semibold text-[#19747E] backdrop-blur-sm transition-all hover:bg-[#D1E8E2]/50 hover:-translate-y-0.5"
                            >
                                Watch Demo
                            </Link>
                        </div>

                        {/* App Preview Image */}
                        <div className="mt-16 relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#A9D6E5]/50 to-transparent blur-3xl -z-10" />
                            <img
                                src="https://images.unsplash.com/photo-1758876201966-a680772a41ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwZmluYW5jZSUyMGFwcCUyMG1vZGVybnxlbnwxfHx8fDE3NzA0NzkwMDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                alt="BudgetBruh App Preview"
                                className="relative mx-auto rounded-3xl shadow-2xl ring-1 ring-black/5 max-w-4xl w-full object-cover aspect-[16/9]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Philosophy />
            <ReflectionEngine />
            <MotivationEngine />
            <CTA />
        </div>
    );
}
