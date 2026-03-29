interface Filters {
    seatType: string[];
    isAC: string;
    departureSlot: string[];
}

interface Props {
    filters: Filters;
    onChange: (filters: Filters) => void;
    onClear: () => void;
}

const SEAT_TYPES = ["normal", "semi-sleeper", "sleeper"];
const DEPARTURE_SLOTS = ["morning", "afternoon", "evening", "night"];

const slotLabels: Record<string, string> = {
    morning: "Morning (6AM - 12PM)",
    afternoon: "Afternoon (12PM - 4PM)",
    evening: "Evening (4PM - 8PM)",
    night: "Night (8PM - 6AM)",
};

export default function FilterSidebar({ filters, onChange, onClear }: Props) {
    const toggleArray = (arr: string[], val: string) =>
        arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

    const handleSeatType = (val: string) => {
        onChange({ ...filters, seatType: toggleArray(filters.seatType, val) });
    };

    const handleSlot = (val: string) => {
        onChange({
            ...filters,
            departureSlot: toggleArray(filters.departureSlot, val),
        });
    };

    const handleAC = (val: string) => {
        onChange({ ...filters, isAC: filters.isAC === val ? "" : val });
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 rounded-3xl w-full">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-800">Filters</h3>
                <button
                    onClick={onClear}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                    Clear all
                </button>
            </div>

            {/* seat type */}
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Seat Type
                </p>
                <div className="flex flex-col gap-3">
                    {SEAT_TYPES.map((type) => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.seatType.includes(type)}
                                onChange={() => handleSeatType(type)}
                                className="accent-indigo-600 w-4 h-4 rounded"
                            />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors capitalize">{type}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* AC type */}
            <div className="mb-6">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    AC Type
                </p>
                <div className="flex flex-col gap-3">
                    {["true", "false"].map((val) => (
                        <label key={val} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.isAC === val}
                                onChange={() => handleAC(val)}
                                className="accent-indigo-600 w-4 h-4 rounded"
                            />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                                {val === "true" ? "AC" : "Non-AC"}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* departure slots */}
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Departure Time
                </p>
                <div className="flex flex-col gap-3">
                    {DEPARTURE_SLOTS.map((slot) => (
                        <label key={slot} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.departureSlot.includes(slot)}
                                onChange={() => handleSlot(slot)}
                                className="accent-indigo-600 w-4 h-4 rounded"
                            />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{slotLabels[slot]}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}