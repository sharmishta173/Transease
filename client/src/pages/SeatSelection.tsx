import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SeatGrid from "../components/SeatGrid";
import { fetchBusById } from "../api";
import type { Bus } from "../types";

const LOCK_DURATION = 2 * 60; // 2 minutes in seconds

export default function SeatSelection() {
    const { busId } = useParams<{ busId: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const [bus, setBus] = useState<Bus | null>(
        location.state?.bus || null
    );
    const [loading, setLoading] = useState(!location.state?.bus);
    const [error, setError] = useState("");
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [lockedSeats, setLockedSeats] = useState<number[]>([]);

    // Timer state
    const [timeLeft, setTimeLeft] = useState(LOCK_DURATION);
    const [timerActive, setTimerActive] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const searchParams = location.state?.searchParams || {};

    useEffect(() => {
        if (!bus && busId) {
            setLoading(true);
            fetchBusById(busId)
                .then((data) => setBus(data))
                .catch(() => setError("Failed to load bus details."))
                .finally(() => setLoading(false));
        }
    }, [busId]);

    //2 min timer
    useEffect(() => {
        if (timerActive && selectedSeats.length > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        // Timer expired — release selected seats
                        clearInterval(timerRef.current!);
                        setLockedSeats((old) => [...old, ...selectedSeats]);
                        setSelectedSeats([]);
                        setTimerActive(false);
                        setTimeLeft(LOCK_DURATION);
                        alert(
                            "⏰ Your seat reservation has expired. Please select seats again."
                        );
                        return LOCK_DURATION;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [timerActive, selectedSeats]);

    const handleSeatClick = useCallback((seatNumber: number) => {
        setSelectedSeats((prev) => {
            const isSelected = prev.includes(seatNumber);
            const updated = isSelected
                ? prev.filter((s) => s !== seatNumber)
                : [...prev, seatNumber];

            // Start the timer when first seat is selected
            if (!isSelected && prev.length === 0) {
                setTimeLeft(LOCK_DURATION);
                setTimerActive(true);
            }

            // Stop the timer if all seats deselected
            if (updated.length === 0) {
                setTimerActive(false);
                setTimeLeft(LOCK_DURATION);
                if (timerRef.current) clearInterval(timerRef.current);
            }

            return updated;
        });
    }, []);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleProceed = () => {
        if (selectedSeats.length === 0) return;
        if (!bus) return;

        //stop the timer before navigating
        setTimerActive(false);
        if (timerRef.current) clearInterval(timerRef.current);

        navigate("/confirm", {
            state: {
                bus,
                selectedSeats,
                totalPrice: bus.price * selectedSeats.length,
                searchParams,
            },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen relative isolate overflow-hidden">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 h-64 animate-pulse shadow-sm" />
                </div>
            </div>
        );
    }

    if (error || !bus) {
        return (
            <div className="min-h-screen relative isolate overflow-hidden text-slate-800">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <p className="text-rose-500 font-bold">{error || "Bus not found."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-4 text-indigo-600 font-medium hover:underline text-sm"
                    >
                        Go back
                    </button>
                </div>
            </div>
        );
    }
    const firstStop = bus.stops[0];
    const lastStop = bus.stops[bus.stops.length - 1];
    const totalPrice = bus.price * selectedSeats.length;

    return (
        <div className="min-h-screen relative isolate overflow-hidden text-slate-800">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-10">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 sm:p-6 rounded-3xl mb-8">
                    <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-4 sm:mb-5">Selected Journey</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-sm">
                        <div>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">Bus Name</p>
                            <p className="font-extrabold text-slate-800 text-base tracking-tight">{bus.name}</p>
                            <p className="text-slate-500 text-xs font-semibold capitalize mt-1">
                                {bus.isAC ? "AC" : "Non-AC"} ·{" "}
                                {bus.seatTypes.join(", ")}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">Route</p>
                            <p className="font-semibold text-slate-700">
                                {bus.departureCity} <span className="text-slate-400 mx-1">→</span> {bus.arrivalCity}
                            </p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">Date</p>
                            <p className="font-semibold text-slate-700">{new Date(bus.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                        <div>
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1.5">Timing</p>
                            <p className="font-semibold text-slate-700">
                                {firstStop.departureTime} <span className="text-slate-400 mx-1">→</span> {lastStop.arrivalTime}
                            </p>
                        </div>
                    </div>

                    {/* Intermediate Stops */}
                    <div className="border-t border-slate-100 mt-6 pt-5">
                        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-3">Route Stops</p>
                        <div className="flex items-center gap-1 overflow-x-auto pb-2">
                            {bus.stops.map((stop, idx) => (
                                <div key={idx} className="flex items-center shrink-0">
                                    <div className="flex flex-col items-center bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors">
                                        <span className="text-slate-700 font-bold text-xs">{stop.stopName}</span>
                                        <span className="text-slate-500 font-medium text-[10px] mt-0.5">
                                            {stop.departureTime || stop.arrivalTime}
                                        </span>
                                    </div>
                                    {idx < bus.stops.length - 1 && (
                                        <div className="w-8 border-t-2 border-dashed border-slate-200 mx-0.5"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    {/* seat grid */}
                    <div className="flex-1 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_6px_30px_rgb(0,0,0,0.06)] p-5 sm:p-8 rounded-3xl overflow-x-auto">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                                Select Your Seats
                            </h2>

                            {/* reservation timer */}
                            {timerActive && selectedSeats.length > 0 && (
                                <div
                                    className={`flex items-center gap-2 text-sm font-bold px-4 py-1.5 rounded-full border shadow-sm ${timeLeft < 30
                                        ? "text-rose-600 border-rose-200 bg-rose-50"
                                        : "text-indigo-600 border-indigo-200 bg-indigo-50"
                                        }`}
                                >
                                    <span>⏱</span>
                                    <span>{formatTime(timeLeft)}</span>
                                </div>
                            )}
                        </div>

                        <SeatGrid
                            seats={bus.seats}
                            selectedSeats={selectedSeats}
                            lockedSeats={lockedSeats}
                            onSeatClick={handleSeatClick}
                        />
                    </div>

                    {/* booking summary */}
                    <div className="lg:w-80 shrink-0">
                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-7 rounded-3xl sticky top-28">
                            <h3 className="font-extrabold text-slate-800 mb-6 text-lg tracking-tight">Booking Summary</h3>

                            {selectedSeats.length === 0 ? (
                                <p className="text-slate-500 font-medium text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    No seats selected yet. Click on a seat on the map to get started.
                                </p>
                            ) : (
                                <>
                                    <div className="mb-5">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Selected Seats</p>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSeats.sort((a, b) => a - b).map((s) => (
                                                <span
                                                    key={s}
                                                    className="bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm rounded-lg px-2.5 py-1 text-xs font-bold"
                                                >
                                                    Seat {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-5">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Price Breakdown</p>
                                        <p className="text-sm font-semibold text-slate-600">
                                            ₹{bus.price.toLocaleString()} × {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""}
                                        </p>
                                    </div>

                                    <div className="border-t border-slate-200 pt-5 mb-6">
                                        <div className="flex items-center justify-between">
                                            <p className="font-bold text-slate-500 uppercase tracking-widest text-[11px]">Total Due</p>
                                            <p className="text-3xl font-black text-indigo-600 tracking-tight">
                                                ₹{totalPrice.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {timerActive && (
                                        <p className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-5 leading-relaxed shadow-sm">
                                            ⏳ Seats reserved for <strong>{formatTime(timeLeft)}</strong>. Proceed to payment before time runs out!
                                        </p>
                                    )}
                                </>
                            )}

                            <button
                                onClick={handleProceed}
                                disabled={selectedSeats.length === 0}
                                className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md ${selectedSeats.length === 0
                                    ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                                    : "bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:shadow-lg hover:-translate-y-0.5"
                                    }`}
                            >
                                Proceed to Payment →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="text-center text-slate-500 font-medium text-xs py-10 mt-8">
                © 2026 TransEase. All rights reserved.
            </footer>
        </div>
    );
}