import { useEffect, useState } from "react";

interface MoneyRainProps {
    savings: number;
}

interface Particle {
    id: number;
    left: number; // 0-100%
    delay: number; // 0-2s
    duration: number; // 1-3s
    char: string;
}

const MONEY_CHARS = ["💵", "💰", "💸", "🤑", "💲"];

export default function MoneyRain({ savings }: MoneyRainProps) {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Calculate particle count based on savings
        // Base: 10 particles
        // +1 per $50
        // Cap at 100
        const count = Math.min(Math.floor(savings / 50) + 10, 100);

        const newParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
            newParticles.push({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 2,
                duration: Math.random() * 1.5 + 1.5, // 1.5s - 3s
                char: MONEY_CHARS[Math.floor(Math.random() * MONEY_CHARS.length)],
            });
        }
        setParticles(newParticles);

        // Hide after 3 seconds + max delay
        const timer = setTimeout(() => {
            setVisible(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, [savings]);

    if (!visible || savings <= 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute top-[-50px] text-2xl animate-fall"
                    style={{
                        left: `${p.left}%`,
                        animationDuration: `${p.duration}s`,
                        animationDelay: `${p.delay}s`,
                    }}
                >
                    {p.char}
                </div>
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
}
