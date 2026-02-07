type BudgetItem = {
    name: string;
    spent: number;
    limit: number;
    color: string;
};

const budgets: BudgetItem[] = [
    {
        name: "Dining Out",
        spent: 400,
        limit: 350,
        color: "bg-red-500",
    },
    {
        name: "Groceries",
        spent: 350,
        limit: 400,
        color: "bg-blue-500",
    },
    {
        name: "Transport",
        spent: 250,
        limit: 300,
        color: "bg-green-500",
    },
    {
        name: "Entertainment",
        spent: 150,
        limit: 200,
        color: "bg-orange-500",
    },
    {
        name: "Other",
        spent: 90,
        limit: 150,
        color: "bg-purple-500",
    },
];

export default function BudgetManagerTab() {
    return (
        <div className="space-y-8">
            {/* Title */}
            <h2 className="text-2xl font-bold">Monthly Budget Tracker</h2>

            {/* Budget Cards */}
            {budgets.map((item) => {
                const percent = Math.min(
                    Math.round((item.spent / item.limit) * 100),
                    100
                );
                const isOver = item.spent > item.limit;

                return (
                    <div
                        key={item.name}
                        className={`rounded-xl border-2 p-6 space-y-3
              ${isOver
                                ? "bg-red-50 border-red-400"
                                : "bg-white border-slate-300"
                            }`}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            <span
                                className={`font-semibold ${isOver ? "text-red-600" : "text-slate-700"
                                    }`}
                            >
                                ${item.spent} / ${item.limit}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-4 bg-white border-2 border-black rounded-full overflow-hidden">
                            <div
                                className={`h-full ${item.color}`}
                                style={{ width: `${percent}%` }}
                            />
                        </div>

                        {/* Warning */}
                        {isOver && (
                            <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                                ⚠️ Over budget by ${item.spent - item.limit}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
