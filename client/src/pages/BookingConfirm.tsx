import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createBooking } from "../api";
import type { Bus, Passenger } from "../types";

interface LocationState {
    bus: Bus;
    selectedSeats: number[];
    totalPrice: number;
    searchParams: {
        departureCity: string;
        arrivalCity: string;
        date: string;
    };
}

const emptyPassenger = (): Passenger => ({
    name: "",
    age: 0,
    gender: "male",
});

export default function BookingConfirm() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    if (!state?.bus || !state?.selectedSeats) {
        navigate("/");
        return null;
    }

    const { bus, selectedSeats, totalPrice } = state;

    const [passengers, setPassengers] = useState<Passenger[]>(
        selectedSeats.map(() => emptyPassenger())
    );
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [bookingSuccess, setBookingSuccess] = useState<{
        id: string;
        seatsBooked: number[];
        totalPrice: number;
    } | null>(null);

    const firstStop = bus.stops[0];
    const lastStop = bus.stops[bus.stops.length - 1];

    const updatePassenger = (
        index: number,
        field: keyof Passenger,
        value: string | number
    ) => {
        setPassengers((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const validate = (): boolean => {
        const newErrors: string[] = [];

        passengers.forEach((p, i) => {
            if (!p.name.trim()) {
                newErrors.push(`Passenger ${i + 1}: Name is required.`);
            }
            if (!p.age || p.age < 1 || p.age > 120) {
                newErrors.push(`Passenger ${i + 1}: Enter a valid age.`);
            }
        });

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleConfirm = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const result = await createBooking({
                busId: bus._id,
                seats: selectedSeats,
                passengerDetails: passengers,
            });

            setBookingSuccess({
                id: result.id,
                seatsBooked: result.seatsBooked,
                totalPrice: result.totalPrice,
            });
        } catch (err: any) {
            const msg =
                err?.response?.data?.message ||
                "Booking failed. Seats may no longer be available.";
            setErrors([msg]);
        } finally {
            setLoading(false);
        }
    };

    if (bookingSuccess) {
        return (
            <div className="min-h-screen relative isolate overflow-hidden text-slate-800">
                <Navbar />
                <div className="max-w-lg mx-auto px-4 py-20 text-center">
                    <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-10 rounded-3xl">
                        <div className="text-6xl mb-6">🎉</div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                            Booking Confirmed!
                        </h2>
                        <p className="text-slate-500 font-medium text-sm mb-8">
                            Your seats have been successfully booked and secured.
                        </p>

                        <div className="bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 rounded-2xl p-6 text-left mb-8 shadow-sm">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-500 font-medium">Booking ID</span>
                                <span className="font-mono text-xs text-indigo-700 bg-white border border-indigo-100 px-2 rounded font-bold shadow-sm">
                                    {bookingSuccess.id.slice(-8).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-500 font-medium">Bus</span>
                                <span className="font-bold text-slate-800">{bus.name}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-500 font-medium">Route</span>
                                <span className="font-bold text-slate-800">
                                    {bus.departureCity} → {bus.arrivalCity}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-500 font-medium">Date</span>
                                <span className="font-bold text-slate-800">{new Date(bus.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-500 font-medium">Seats</span>
                                <span className="font-bold text-indigo-600">
                                    {bookingSuccess.seatsBooked.join(", ")}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm border-t border-indigo-200/50 pt-4 mt-4">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[11px]">Total Paid</span>
                                <span className="text-indigo-600 font-black text-xl tracking-tight">
                                    ₹{bookingSuccess.totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/")}
                            className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-md text-white font-bold hover:shadow-lg hover:-translate-y-0.5 py-3.5 rounded-xl text-sm transition-all duration-300"
                        >
                            Book Another Trip
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative isolate overflow-hidden text-slate-800">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 sm:mb-8 tracking-tight">
                    Review &amp; Checkout
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* left — passenger details */}
                    <div className="flex-1">
                        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_4px_20px_rgb(0,0,0,0.04)] p-5 sm:p-8 rounded-3xl">
                            <h2 className="text-xl font-extrabold text-slate-800 mb-6 tracking-tight">
                                Passenger Details
                            </h2>

                            <div className="flex flex-col gap-6">
                                {passengers.map((passenger, index) => (
                                    <div
                                        key={index}
                                        className="border border-slate-200 rounded-2xl p-6 bg-white shadow-sm"
                                    >
                                        <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                                            <h3 className="font-bold text-slate-800 text-sm">
                                                Passenger {index + 1}
                                            </h3>
                                            <span className="text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm rounded-lg px-2.5 py-1">
                                                Seat {selectedSeats[index]}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-5 mb-5">
                                            {/* name */}
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Rahul Sharma"
                                                    value={passenger.name}
                                                    onChange={(e) =>
                                                        updatePassenger(index, "name", e.target.value)
                                                    }
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 text-slate-800 transition"
                                                />
                                            </div>

                                            {/* age */}
                                            <div className="col-span-2 md:col-span-1">
                                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                                    Age
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 25"
                                                    min={1}
                                                    max={120}
                                                    value={passenger.age || ""}
                                                    onChange={(e) =>
                                                        updatePassenger(
                                                            index,
                                                            "age",
                                                            parseInt(e.target.value) || 0
                                                        )
                                                    }
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 text-slate-800 transition"
                                                />
                                            </div>
                                        </div>

                                        {/* gender */}
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                                Gender
                                            </label>
                                            <div className="flex gap-5">
                                                {(["male", "female", "other"] as const).map((g) => (
                                                    <label
                                                        key={g}
                                                        className="flex items-center gap-2 cursor-pointer group"
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`gender-${index}`}
                                                            value={g}
                                                            checked={passenger.gender === g}
                                                            onChange={() =>
                                                                updatePassenger(index, "gender", g)
                                                            }
                                                            className="accent-indigo-600 w-4 h-4 scale-110"
                                                        />
                                                        <span className="text-sm font-semibold text-slate-600 capitalize group-hover:text-indigo-600 transition-colors">
                                                            {g}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* validation errors */}
                            {errors.length > 0 && (
                                <div className="mt-6 bg-rose-50 border border-rose-200 rounded-xl p-5 shadow-sm">
                                    {errors.map((err, i) => (
                                        <p key={i} className="text-rose-600 text-sm font-semibold mb-1 last:mb-0">
                                            • {err}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* right — bus details + booking summary */}
                    <div className="lg:w-80 shrink-0 flex flex-col gap-5 sm:gap-6">
                        {/* bus details */}
                        <div className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 rounded-3xl">
                            <h3 className="font-extrabold text-slate-800 mb-5 text-lg tracking-tight border-b border-slate-100 pb-3">
                                Trip Info
                            </h3>
                            <p className="font-black text-slate-800 text-lg mb-1">{bus.name}</p>
                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-4">
                                {bus.isAC ? "AC" : "Non-AC"} · {bus.seatTypes.join(", ")}
                            </p>
                            <div className="text-sm font-medium text-slate-600 flex flex-col gap-3">
                                <p className="flex items-center gap-2"><span className="text-indigo-400">📍</span> {bus.departureCity} → {bus.arrivalCity}</p>
                                <p className="flex items-center gap-2"><span className="text-indigo-400">📅</span> {new Date(bus.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})}</p>
                                <p className="flex items-center gap-2">
                                <span className="text-indigo-400">🕐</span> {firstStop.departureTime} → {lastStop.arrivalTime}
                                </p>
                            </div>
                        </div>

                        {/* booking summary */}
                        <div className="bg-gradient-to-b from-slate-50 to-white backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 rounded-3xl">
                            <h3 className="font-extrabold text-slate-800 mb-6 text-lg tracking-tight">
                                Order Summary
                            </h3>
                            <div className="flex justify-between text-sm mb-3 font-medium">
                                <span className="text-slate-500">Selected Seats</span>
                                <span className="font-bold text-slate-800">
                                    {selectedSeats.join(", ")}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm mb-3 font-medium">
                                <span className="text-slate-500">Price per seat</span>
                                <span className="font-bold text-slate-800">
                                    ₹{bus.price.toLocaleString()}
                                </span>
                            </div>
                            <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center bg-white rounded-xl p-3 shadow-sm border">
                                <span className="font-bold text-slate-400 uppercase tracking-widest text-[11px]">Total Due</span>
                                <span className="font-black text-indigo-600 text-2xl tracking-tight">
                                    ₹{totalPrice.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* confirm button */}
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl text-sm font-bold shadow-md transition-all duration-300 ${loading
                                ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                                : "bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:shadow-lg hover:-translate-y-0.5"
                                }`}
                        >
                            {loading ? "Confirming..." : "Confirm & Pay ✓"}
                        </button>
                    </div>
                </div>
            </div>

            <footer className="text-center text-slate-500 font-medium text-xs py-10 mt-6">
                © 2026 TransEase. All rights reserved.
            </footer>
        </div>
    );
}