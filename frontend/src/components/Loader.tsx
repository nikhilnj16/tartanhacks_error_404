

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    fullScreen?: boolean;
}

export default function Loader({ size = "md", className = "", fullScreen = false }: LoaderProps) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-16 h-16",
        lg: "w-24 h-24",
    };

    const borderClasses = {
        sm: "border-4",
        md: "border-[6px]",
        lg: "border-[8px]",
    };

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#F7FBFA] z-50 transition-opacity duration-300">
                <div className="relative w-24 h-24">
                    {/* Pulse effect behind */}
                    <div className="absolute inset-0 rounded-full bg-[#19747E] opacity-20 animate-ping"></div>

                    {/* Rotating ring */}
                    <div className="absolute inset-0 rounded-full border-[8px] border-[#19747E] border-t-transparent animate-spin"></div>
                </div>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-[#19747E] text-xl font-bold tracking-[0.2em] animate-pulse">
                        LOADING
                    </p>
                    <p className="text-[#19747E]/60 text-sm font-medium">
                        Crunching your numbers...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className={`relative ${sizeClasses[size]}`}>
                <div className={`absolute inset-0 rounded-full border-slate-200 ${borderClasses[size]} opacity-50`}></div>
                <div className={`absolute inset-0 rounded-full border-[#19747E] border-t-transparent ${borderClasses[size]} animate-spin`}></div>
            </div>
        </div>
    );
}
