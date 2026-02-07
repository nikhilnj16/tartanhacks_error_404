import logo from "../assets/logo.png";

type Tab =
    | "spending"
    | "predictive"
    | "budget"
    | "subscriptions"
    | "settings";

type SidebarProps = {
    isOpen: boolean;
    activeTab: Tab;
    onSelectTab: (tab: Tab) => void;
    onClose: () => void;
};

const navItems: { label: string; tab: Tab }[] = [
    { label: "Spending Analysis", tab: "spending" },
    { label: "Predictive Analysis", tab: "predictive" },
    { label: "Budget Manager", tab: "budget" },
    { label: "Subscription Manager", tab: "subscriptions" },
    { label: "User Settings", tab: "settings" },
];

export default function Sidebar({
    isOpen,
    activeTab,
    onSelectTab,
    onClose,
}: SidebarProps) {
    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#F7FBFA] border-r border-[#E2E2E2]
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:shadow-none
        `}
            >
                {/* Header */}
                <div className="h-14 flex items-center justify-between px-4 border-b border-[#E2E2E2]">
                    <img src={logo} alt="BudgetBruh" className="h-10 hidden md:block" />
                    <button onClick={onClose} className="md:hidden text-xl text-[#19747E]">
                        ✕
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-4">
                    {navItems.map(({ label, tab }) => {
                        const isActive = activeTab === tab;

                        return (
                            <button
                                key={tab}
                                onClick={() => onSelectTab(tab)}
                                className={`
                  w-full px-4 py-3 rounded-xl border-2 text-left font-medium
                  transition
                  ${isActive
                                        ? "bg-[#19747E] text-white shadow"
                                        : "text-[#19747E] hover:bg-[#D1E8E2]"
                                    }
                `}
                            >
                                {label}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Overlay (mobile only) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                    onClick={onClose}
                />
            )}
        </>
    );
}
