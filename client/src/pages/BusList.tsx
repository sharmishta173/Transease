import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FilterSidebar from "../components/FilterSidebar";
import BusCard from "../components/BusCard";
import Pagination from "../components/Pagination";
import { fetchBuses } from "../api";
import type { Bus } from "../types";

interface Filters {
    seatType: string[];
    isAC: string;
    departureSlot: string[];
}

const defaultFilters: Filters = {
    seatType: [],
    isAC: "",
    departureSlot: [],
};

const POPULAR_CITIES = ["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Delhi", "Pune"];

export default function BusList() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const departureCity = searchParams.get("departureCity") || "";
    const arrivalCity = searchParams.get("arrivalCity") || "";
    const date = searchParams.get("date") || "";

    const hasSearchParams = Boolean(departureCity && arrivalCity && date);

    const [buses, setBuses] = useState<Bus[]>([]);
    const [filters, setFilters] = useState<Filters>(defaultFilters);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBuses, setTotalBuses] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    // Inline search state (shown when no params are present)
    const today = new Date().toISOString().split("T")[0];
    const [inlineForm, setInlineForm] = useState({ departureCity: "", arrivalCity: "", date: "" });
    const [inlineError, setInlineError] = useState("");

    const loadBuses = useCallback(async (currentPage: number, currentFilters: Filters) => {
        if (!hasSearchParams) return;

        setLoading(true);
        setError("");

        try {
            const filterParams: Record<string, string | number> = {
                page: currentPage,
                pageSize: 10,
            };
            if (currentFilters.seatType.length === 1) filterParams.seatType = currentFilters.seatType[0];
            if (currentFilters.isAC !== "") filterParams.isAC = currentFilters.isAC;
            if (currentFilters.departureSlot.length === 1) filterParams.departureSlot = currentFilters.departureSlot[0];

            const res = await fetchBuses({ departureCity, arrivalCity, date }, filterParams);

            setBuses(res.buses);
            setTotalPages(res.totalPages);
            setTotalBuses(res.totalBuses);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [hasSearchParams, departureCity, arrivalCity, date]);

    useEffect(() => {
        loadBuses(page, filters);
    }, [page, filters, loadBuses]);

    const handleFilterChange = useCallback((newFilters: Filters) => {
        setFilters(newFilters);
        setPage(1);
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters(defaultFilters);
        setPage(1);
    }, []);

    const handleInlineSearch = () => {
        const { departureCity: from, arrivalCity: to, date: d } = inlineForm;
        if (!from.trim() || !to.trim() || !d) {
            setInlineError("Please fill in all fields.");
            return;
        }
        if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
            setInlineError("Departure and arrival cities can't be the same.");
            return;
        }
        navigate(`/buses?departureCity=${from}&arrivalCity=${to}&date=${d}`);
    };

    return (
        <div className="min-h-screen relative isolate overflow-hidden text-slate-800">
            <Navbar />

            {!hasSearchParams ? (
                /* No search params — show inline search prompt */
                <div className="max-w-xl mx-auto px-4 py-20 text-center">
                    <p className="text-5xl mb-6">🔍</p>
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Search for Buses</h1>
                    <p className="text-slate-500 text-sm font-medium mb-8">Enter your journey details to find available buses.</p>
                    <div className="bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-6 rounded-3xl text-left flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">From</label>
                                <input
                                    type="text"
                                    list="inline-departure-cities"
                                    placeholder="e.g. Bangalore"
                                    value={inlineForm.departureCity}
                                    onChange={(e) => setInlineForm((f) => ({ ...f, departureCity: e.target.value }))}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-slate-800"
                                />
                                <datalist id="inline-departure-cities">
                                    {POPULAR_CITIES.map((c) => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">To</label>
                                <input
                                    type="text"
                                    list="inline-arrival-cities"
                                    placeholder="e.g. Chennai"
                                    value={inlineForm.arrivalCity}
                                    onChange={(e) => setInlineForm((f) => ({ ...f, arrivalCity: e.target.value }))}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-slate-800"
                                />
                                <datalist id="inline-arrival-cities">
                                    {POPULAR_CITIES.map((c) => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-1.5">Date of Travel</label>
                            <input
                                type="date"
                                min={today}
                                value={inlineForm.date}
                                onChange={(e) => setInlineForm((f) => ({ ...f, date: e.target.value }))}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-slate-800"
                            />
                        </div>
                        {inlineError && <p className="text-rose-500 text-sm font-medium">{inlineError}</p>}
                        <button
                            onClick={handleInlineSearch}
                            className="w-full mt-1 bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-semibold py-3 rounded-xl text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Search Buses
                        </button>
                    </div>
                </div>
            ) : (
                /* Has search params — show bus list */
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="mb-8 flex items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Available Buses</h1>
                            <p className="text-slate-500 font-medium text-sm mt-2">
                                {departureCity} → {arrivalCity}&nbsp;·&nbsp;
                                {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "short", month: "short", day: "numeric", year: "numeric",
                                })}
                                {!loading && (
                                    <span className="ml-2 text-indigo-600 font-bold">({totalBuses} buses found)</span>
                                )}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsMobileFiltersOpen(true)}
                            className="md:hidden flex items-center gap-2 bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:bg-indigo-50 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition shrink-0"
                        >
                            <span>⚙️</span> Filters
                        </button>
                    </div>

                    <div className="flex gap-8">
                        <div className="w-64 shrink-0 hidden md:block">
                            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
                        </div>

                        <div className="flex-1">
                            {loading && (
                                <div className="flex flex-col gap-5">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200 h-40 animate-pulse shadow-sm" />
                                    ))}
                                </div>
                            )}

                            {!loading && error && (
                                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center shadow-sm">
                                    <p className="text-rose-600 font-semibold">{error}</p>
                                    <button onClick={() => loadBuses(page, filters)} className="mt-3 text-sm text-indigo-600 font-medium hover:underline">
                                        Try again
                                    </button>
                                </div>
                            )}

                            {!loading && !error && buses.length === 0 && (
                                <div className="bg-white/80 backdrop-blur-md text-slate-800 rounded-3xl border border-slate-200 shadow-sm p-14 text-center">
                                    <p className="text-5xl mb-4">🚏</p>
                                    <p className="text-slate-800 font-bold text-xl">No buses found</p>
                                    <p className="text-slate-500 text-base mt-2 font-medium">Try adjusting your filters or search for a different date.</p>
                                    <button onClick={handleClearFilters} className="mt-6 text-sm bg-indigo-50 text-indigo-600 font-semibold px-6 py-2 rounded-full border border-indigo-100 hover:bg-indigo-100 transition">
                                        Clear filters
                                    </button>
                                </div>
                            )}

                            {!loading && !error && buses.length > 0 && (
                                <div className="flex flex-col gap-6">
                                    {buses.map((bus) => (
                                        <BusCard key={bus._id} bus={bus} searchParams={{ departureCity, arrivalCity, date }} />
                                    ))}
                                </div>
                            )}

                            <div className="mt-8">
                                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile filter drawer — only relevant when bus list is shown */}
            {hasSearchParams && isMobileFiltersOpen && (
                <div className="fixed inset-0 z-[100] flex md:hidden">
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setIsMobileFiltersOpen(false)}
                    />
                    <div className="relative ml-auto w-4/5 max-w-[340px] bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="flex items-center justify-between p-6 bg-white border-b border-slate-100 sticky top-0 z-10">
                            <h2 className="text-lg font-bold text-slate-800">Filter By</h2>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="p-2 -mr-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
                                aria-label="Close filters"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 flex-1 bg-slate-50/50">
                            <FilterSidebar filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
                        </div>
                        <div className="p-6 bg-white border-t border-slate-100 sticky bottom-0 z-10 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-md text-white font-bold hover:shadow-lg hover:-translate-y-0.5 py-3.5 rounded-xl transition duration-200 text-sm"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="text-center text-slate-400 font-medium text-xs py-10 mt-6">
                © 2026 TransEase. All rights reserved.
            </footer>
        </div>
    );
}