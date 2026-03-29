import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { label: "Home", path: "/" },
        { label: "Routes", path: "/buses" },
    ];

    return (
        <nav className="bg-white/70 backdrop-blur-2xl border-b border-slate-200 sticky top-0 z-50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* logo */}
                <Link to="/" className="group flex items-center gap-2">
                    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_4px_16px_rgba(79,70,229,0.4)] transition-transform duration-300 group-hover:scale-110">
                        <defs>
                            <linearGradient id="bgGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#38bdf8" stopOpacity="0.2"/>
                                <stop offset="1" stopColor="#4f46e5" stopOpacity="0.2"/>
                            </linearGradient>
                            <linearGradient id="busGrad" x1="8" y1="4" x2="36" y2="40" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#f8fafc" />
                                <stop offset="1" stopColor="#cbd5e1" />
                            </linearGradient>
                        </defs>
                        
                        {/* 3D Glassy App Icon Container */}
                        <rect x="2" y="2" width="40" height="40" rx="12" fill="url(#bgGrad)" stroke="#4f46e5" strokeWidth="1.5" strokeOpacity="0.4" />
                        
                        {/* Premium Material Bus Icon */}
                        <g transform="translate(10, 10)">
                            {/* Base Bus Body */}
                            <path d="M4 16C4 16.88 4.39 17.67 5 18.22V20C5 20.55 5.45 21 6 21H7C7.55 21 8 20.55 8 20V19H16V20C16 20.55 16.45 21 17 21H18C18.55 21 19 20.55 19 20V18.22C19.61 17.67 20 16.88 20 16V6C20 2.5 16.42 2 12 2C7.58 2 4 2.5 4 6V16ZM7.5 17C6.67 17 6 16.33 6 15.5C6 14.67 6.67 14 7.5 14C8.33 14 9 14.67 9 15.5C9 16.33 8.33 17 7.5 17ZM16.5 17C15.67 17 15 16.33 15 15.5C15 14.67 15.67 14 16.5 14C17.33 14 18 14.67 18 15.5C18 16.33 17.33 17 16.5 17ZM18 11H6V6H18V11Z" fill="url(#busGrad)" />
                            
                            {/* Glowing Neon Accents */}
                            <circle cx="7.5" cy="15.5" r="1.5" fill="#4f46e5" className="animate-pulse" />
                            <circle cx="16.5" cy="15.5" r="1.5" fill="#4f46e5" className="animate-pulse" />
                            
                            {/* Windshield Glass Reflection */}
                            <rect x="6" y="6" width="12" height="5" fill="#4f46e5" fillOpacity="0.2" />
                            <path d="M 6 11 L 18 11" stroke="#4f46e5" strokeWidth="1" />
                        </g>

                        {/* Motion Lines */}
                        <path d="M 8 18 L 2 18" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                        <path d="M 6 26 L 2 26" stroke="#4f46e5" strokeWidth="1.5" strokeLinecap="round" className="opacity-80" />
                    </svg>
                    <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-br from-indigo-900 via-indigo-600 to-sky-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(79,70,229,0.3)] pr-1">
                        TransEase
                    </span>
                </Link>

                {/* desktop nav links */}
                <div className="hidden sm:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors duration-200 ${location.pathname === link.path
                                    ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5"
                                    : "text-slate-500 hover:text-indigo-600"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* mobile hamburger */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-slate-100 transition"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`} />
                    <span className={`block w-5 h-0.5 bg-slate-600 transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>

            {/* mobile dropdown menu */}
            {isMenuOpen && (
                <div className="sm:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-3 flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${location.pathname === link.path
                                    ? "text-indigo-600 bg-indigo-50"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
}