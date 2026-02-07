type Subscription = {
    name: string;
    price: number;
    renewal: string;
};

const subscriptions: Subscription[] = [
    { name: "Spotify Premium", price: 10.99, renewal: "Feb 15" },
    { name: "Netflix Standard", price: 15.49, renewal: "Feb 20" },
    { name: "Amazon Prime", price: 14.99, renewal: "Feb 10" },
    { name: "Apple iCloud+", price: 2.99, renewal: "Feb 25" },
    { name: "Disney+", price: 13.99, renewal: "Feb 18" },
    { name: "GitHub Pro", price: 4.0, renewal: "Feb 12" },
    { name: "ChatGPT Plus", price: 20.0, renewal: "Feb 28" },
];

const totalMonthlyCost = subscriptions.reduce(
    (sum, sub) => sum + sub.price,
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
                        className="bg-white border-2 border-black rounded-xl p-5 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold text-lg">
                                {sub.name}
                            </p>
                            <p className="text-sm text-slate-600">
                                Next renewal: {sub.renewal}
                            </p>
                        </div>

                        <p className="text-lg font-bold">
                            ${sub.price.toFixed(2)}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
