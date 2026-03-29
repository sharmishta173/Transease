import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SplitText from "../components/animations/SplitText";

const POPULAR_CITIES = [
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Mumbai",
    "Delhi",
    "Pune",
];

const FEATURES = [
    {
        icon: "🔍",
        title: "Smart Search",
        desc: "Find buses across India by city, date, and seat type in seconds.",
    },
    {
        icon: "💺",
        title: "Pick Your Seat",
        desc: "Interactive seat maps let you choose exactly where you sit.",
    },
    {
        icon: "⚡",
        title: "Instant Booking",
        desc: "No waiting, no queues. Book and get confirmed in real time.",
    },
    {
        icon: "🛡️",
        title: "Secure & Reliable",
        desc: "Your bookings and data are always safe with us.",
    },
];

const STATS = [
    { value: "500+", label: "Routes" },
    { value: "50K+", label: "Happy Travellers" },
    { value: "25+", label: "Cities Covered" },
    { value: "99%", label: "On-time Rate" },
];

export default function Home() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        departureCity: "",
        arrivalCity: "",
        date: "",
    });
    const [error, setError] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const handleSearch = () => {
        const { departureCity, arrivalCity, date } = form;

        if (!departureCity.trim() || !arrivalCity.trim() || !date) {
            setError("Please fill in all fields before searching.");
            return;
        }

        if (departureCity.trim().toLowerCase() === arrivalCity.trim().toLowerCase()) {
            setError("Departure and arrival cities can't be the same.");
            return;
        }

        setError("");
        navigate(
            `/buses?departureCity=${departureCity}&arrivalCity=${arrivalCity}&date=${date}`
        );
    };

    const handleSwap = () => {
        setForm((prev) => ({
            ...prev,
            departureCity: prev.arrivalCity,
            arrivalCity: prev.departureCity,
        }));
    };

    return (
        <div className="min-h-screen relative isolate overflow-hidden text-slate-800">
            {/* Bus Scenery Background — fixed so position is relative to viewport */}
            <div
                className="fixed inset-0 -z-20 bg-cover bg-no-repeat"
                style={{ backgroundImage: `url('/bus-scenery.png')`, backgroundPosition: "center calc(100% + 80px)" }}
            />
            <div className="fixed inset-0 -z-10 bg-white/30 backdrop-blur-[2px]" />
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-50/20 via-transparent to-sky-50/40" />

            <Navbar />

            {/* HERO */}
            <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-20 pb-10 text-center relative z-10">
                {/* badge */}
                <span className="inline-flex items-center gap-2 bg-indigo-50/80 border border-indigo-200/60 backdrop-blur-md text-indigo-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 shadow-sm">
                    🚌 India's smartest bus booking
                </span>

                <h1 className="text-3xl md:text-5xl font-bold text-slate-800 mb-5 flex flex-col sm:flex-row items-center justify-center sm:gap-3">
                    <SplitText text="Travel smarter," />
                    <SplitText text="book faster." className="text-indigo-600" delay={70} />
                </h1>
                <p className="text-slate-500 text-base sm:text-lg mb-10 sm:mb-12 font-medium max-w-lg mx-auto">
                    Find and book bus tickets across India in seconds. Safe, simple, and instant.
                </p>

                {/*SEARCH CARD */}
                <div className="bg-white/85 backdrop-blur-xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto">
                    <h2 className="text-base sm:text-xl font-semibold text-slate-800 mb-5 text-left flex items-center gap-2">
                        🗺️ Find Your Bus
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
                            <div className="w-full md:flex-1">
                                <label className="block text-sm font-medium text-slate-600 mb-1 text-left">
                                    Departure City
                                </label>
                                <input
                                    type="text"
                                    list="departure-cities"
                                    placeholder="e.g. Bangalore"
                                    value={form.departureCity}
                                    onChange={(e) =>
                                        setForm({ ...form, departureCity: e.target.value })
                                    }
                                    className="w-full bg-white/60 backdrop-blur-md text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                />
                                <datalist id="departure-cities">
                                    {POPULAR_CITIES.map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                            </div>

                            <button
                                onClick={handleSwap}
                                className="mt-0 md:mt-5 p-2 rounded-full border border-slate-200 bg-white shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition rotate-90 md:rotate-0 shrink-0 text-indigo-500"
                                title="Swap cities"
                            >
                                ⇄
                            </button>

                            <div className="w-full md:flex-1">
                                <label className="block text-sm font-medium text-slate-600 mb-1 text-left">
                                    Arrival City
                                </label>
                                <input
                                    type="text"
                                    list="arrival-cities"
                                    placeholder="e.g. Chennai"
                                    value={form.arrivalCity}
                                    onChange={(e) =>
                                        setForm({ ...form, arrivalCity: e.target.value })
                                    }
                                    className="w-full bg-white/60 backdrop-blur-md text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                                />
                                <datalist id="arrival-cities">
                                    {POPULAR_CITIES.map((c) => (
                                        <option key={c} value={c} />
                                    ))}
                                </datalist>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 mb-1 text-left">
                                Date of Travel
                            </label>
                            <input
                                type="date"
                                min={today}
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full bg-white/60 backdrop-blur-md text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            />
                        </div>

                        {error && (
                            <p className="text-rose-500 text-sm font-medium text-left">{error}</p>
                        )}

                        <button
                            onClick={handleSearch}
                            className="w-full mt-2 bg-gradient-to-r from-indigo-500 to-sky-500 shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] text-white font-semibold hover:-translate-y-0.5 transition-all duration-200 py-3 rounded-xl text-sm tracking-wide"
                        >
                            Search Buses →
                        </button>
                    </div>
                </div>

                {/* STATS STRIP */}
                <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                    {STATS.map((s) => (
                        <div
                            key={s.label}
                            className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl px-4 py-4 shadow-sm"
                        >
                            <p className="text-2xl font-black text-indigo-600 tracking-tight">{s.value}</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* POPULAR ROUTES */}
                <div className="mt-14 text-left max-w-2xl mx-auto">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">
                        Popular Routes
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { from: "Bangalore", to: "Chennai" },
                            { from: "Bangalore", to: "Hyderabad" },
                            { from: "Chennai", to: "Bangalore" },
                            { from: "Hyderabad", to: "Bangalore" },
                            { from: "Mumbai", to: "Pune" },
                            { from: "Delhi", to: "Agra" },
                        ].map((route) => (
                            <button
                                key={`${route.from}-${route.to}`}
                                onClick={() =>
                                    setForm({
                                        departureCity: route.from,
                                        arrivalCity: route.to,
                                        date: form.date,
                                    })
                                }
                                className="group relative flex flex-col items-start bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.12)] hover:border-indigo-200/60 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 overflow-hidden text-left"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100/80 via-sky-50/40 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                <div className="flex items-center justify-between w-full mb-1.5">
                                    <span className="text-slate-800 font-extrabold tracking-tight text-[15px] group-hover:text-indigo-800 transition-colors z-10">
                                        {route.from}
                                    </span>
                                    <span className="text-lg bg-white/90 w-8 h-8 flex items-center justify-center rounded-full shadow-sm group-hover:scale-110 border border-slate-50 transition-all duration-300 z-10 shrink-0">
                                        🚌
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest z-10 group-hover:text-indigo-500 transition-colors">
                                    <span>To</span>
                                    <span className="text-slate-600">{route.to}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className="relative z-10 bg-white/50 backdrop-blur-xl border-t border-slate-200/60 mt-6">
                <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20">
                    <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-500 mb-3">Why TransEase?</p>
                    <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-800 mb-10 tracking-tight">
                        Everything you need for a smooth journey
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="group bg-white/80 border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-[0_8px_24px_rgba(79,70,229,0.1)] hover:border-indigo-200 transition-all duration-300"
                            >
                                <div className="text-3xl mb-4">{f.icon}</div>
                                <h3 className="text-base font-extrabold text-slate-800 mb-1.5 group-hover:text-indigo-700 transition-colors">{f.title}</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <footer className="text-center text-slate-400 font-medium text-xs py-8 mt-2 relative z-10">
                © 2026 TransEase. All rights reserved.
            </footer>
        </div>
    );
}