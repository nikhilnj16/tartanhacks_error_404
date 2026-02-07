/**
 * Paths to subscription icons. Place your SVG (or image) files in
 * frontend/public/subscription-icons/ and add or update entries here.
 * Keys must match the `icon` field on each subscription.
 */
const SUBSCRIPTION_ICON_PATHS: Record<string, string> = {
    spotify: "/subscription-icons/spotify.svg",
    netflix: "/subscription-icons/netflix.svg",
    amazon: "/subscription-icons/amazon.svg",
    apple: "/subscription-icons/apple.svg",
    disney: "/subscription-icons/disney.svg",
    github: "/subscription-icons/github.svg",
    openai: "/subscription-icons/openai.svg",
};

type Subscription = {
    name: string;
    amount: number;
    lastPaidDate: string;
    renewal: string;
    cancellationUrl: string;
    icon: string;
};

const subscriptions: Subscription[] = [
    { name: "Spotify Premium", amount: 10.99, lastPaidDate: "Jan 15, 2025", renewal: "Feb 15", cancellationUrl: "https://www.spotify.com/account/subscription/", icon: "spotify" },
    { name: "Netflix Standard", amount: 15.49, lastPaidDate: "Jan 20, 2025", renewal: "Feb 20", cancellationUrl: "https://www.netflix.com/cancelplan", icon: "netflix" },
    { name: "Amazon Prime", amount: 14.99, lastPaidDate: "Jan 10, 2025", renewal: "Feb 10", cancellationUrl: "https://www.amazon.com/gp/primecentral", icon: "amazon" },
    { name: "Apple iCloud+", amount: 2.99, lastPaidDate: "Jan 25, 2025", renewal: "Feb 25", cancellationUrl: "https://support.apple.com/guide/icloud", icon: "apple" },
    { name: "Disney+", amount: 13.99, lastPaidDate: "Jan 18, 2025", renewal: "Feb 18", cancellationUrl: "https://www.disneyplus.com/account", icon: "disney" },
    { name: "GitHub Pro", amount: 4.0, lastPaidDate: "Jan 12, 2025", renewal: "Feb 12", cancellationUrl: "https://github.com/settings/billing", icon: "github" },
    { name: "ChatGPT Plus", amount: 20.0, lastPaidDate: "Jan 28, 2025", renewal: "Feb 28", cancellationUrl: "https://help.openai.com/en/articles/6893482-how-do-i-cancel-my-subscription", icon: "openai" },
];

const totalMonthlyCost = subscriptions.reduce(
    (sum, sub) => sum + sub.amount,
    0
);

export default function SubscriptionManagerTab() {
    return (
        <div className="space-y-8">
            {/* Title */}
            <h2 className="text-2xl font-bold">Active Subscriptions</h2>

            {/* Total Monthly Cost */}
            <div className="bg-blue-50 border-2 border-black rounded-xl p-6">
                <p className="text-slate-600 mb-2">Total Monthly Cost</p>
                <p className="text-5xl font-bold">
                    ${totalMonthlyCost.toFixed(2)}
                </p>
            </div>

            {/* Subscription List */}
            <div className="space-y-4">
                {subscriptions.map((sub) => (
                    <div
                        key={sub.name}
                        className="bg-white border-2 border-black rounded-xl p-5 flex flex-wrap justify-between items-center gap-3"
                    >
                        <div className="min-w-0 flex items-center gap-4">
                            {SUBSCRIPTION_ICON_PATHS[sub.icon] && (
                                <img
                                    src={SUBSCRIPTION_ICON_PATHS[sub.icon]}
                                    alt=""
                                    className="h-12 w-12 rounded-xl object-contain flex-shrink-0 bg-slate-50"
                                />
                            )}
                            <div>
                                <p className="font-semibold text-lg">
                                    {sub.name}
                                </p>
                                <p className="text-sm text-slate-600">
                                    Amount: ${sub.amount.toFixed(2)}/mo
                                </p>
                                <p className="text-sm text-slate-600">
                                    Last paid: {sub.lastPaidDate} · Next renewal: {sub.renewal}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-lg font-bold">
                                ${sub.amount.toFixed(2)}
                            </p>
                            <a
                                href={sub.cancellationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg border-2 border-red-500 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                            >
                                Remove
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
