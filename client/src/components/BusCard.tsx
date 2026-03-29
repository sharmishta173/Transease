import { useNavigate } from "react-router-dom";
import type { Bus } from "../types";
import SpotlightCard from "./animations/SpotlightCard";

interface Props {
    bus: Bus;
    searchParams: {
        departureCity: string;
        arrivalCity: string;
        date: string;
    };
}

export default function BusCard({ bus, searchParams }: Props) {
    const navigate = useNavigate();

    const firstStop = bus.stops[0];
    const lastStop = bus.stops[bus.stops.length - 1];

    const handleBook = () => {
        navigate(`/buses/${bus._id}`, {
            state: { bus, searchParams },
        });
    };

    return (
        <SpotlightCard className="p-6 bg-white/70 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                {/* left — bus info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-bold text-slate-800 text-lg tracking-tight">{bus.name}</h3>
                        {bus.isAC ? (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md px-2 py-0.5 ml-1">
                                AC
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200 rounded-md px-2 py-0.5 ml-1">
                                Non-AC
                            </span>
                        )}
                        {bus.seatTypes.map((type) => (
                            <span
                                key={type}
                                className="text-[10px] font-bold uppercase tracking-widest bg-sky-50 text-sky-600 border border-sky-200 rounded-md px-2 py-0.5"
                            >
                                {type}
                            </span>
                        ))}
                    </div>

                    {/* route */}
                    <p className="text-xs text-slate-500 mb-4 font-medium flex items-center gap-1.5">
                        <span className="text-indigo-400">📍</span> {bus.departureCity} <span className="text-slate-300 mx-1">→</span> {bus.arrivalCity}
                    </p>

                    {/* timing */}
                    <div className="flex items-center justify-between gap-4 max-w-sm">
                        <div className="text-left">
                            <p className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                                {firstStop.departureTime}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{firstStop.stopName}</p>
                        </div>
                        <div className="flex-1 flex flex-col items-center px-2 self-center">
                            <div className="w-full border-t-2 border-dashed border-slate-300 relative">
                                <span className="absolute -top-[11px] left-1/2 -translate-x-1/2 text-[10px] bg-white text-slate-400 px-2 rounded-full border border-slate-200 shadow-sm">
                                    🚌
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-2">
                                {bus.stops.length > 1
                                    ? `${bus.stops.length - 1} stop${bus.stops.length > 2 ? "s" : ""}`
                                    : "Direct"}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                                {lastStop.arrivalTime}
                            </p>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{lastStop.stopName}</p>
                        </div>
                    </div>
                </div>

                {/* right — price + seats + book */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:min-w-[160px] md:border-l md:border-slate-100 md:pl-6 pt-4 border-t border-slate-100 md:border-t-0 md:pt-0">
                    <div className="text-left md:text-right">
                        <p className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">
                            ₹{bus.price.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">per seat</p>
                    </div>

                    <div className="flex flex-col gap-3 items-end w-auto md:w-full">
                        <p
                            className={`text-sm font-bold ${bus.availableSeats < 5 ? "text-rose-500" : "text-emerald-600"
                                }`}
                        >
                            {bus.availableSeats} seats left
                        </p>

                        <button
                            onClick={handleBook}
                            disabled={bus.availableSeats === 0}
                            className={`px-5 py-2.5 md:py-3 rounded-xl text-sm transition-all duration-300 font-bold whitespace-nowrap ${bus.availableSeats === 0
                                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                                    : "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
                                }`}
                        >
                            {bus.availableSeats === 0 ? "Sold Out" : "Book Now"}
                        </button>
                    </div>
                </div>
            </div>
        </SpotlightCard>
    );
}