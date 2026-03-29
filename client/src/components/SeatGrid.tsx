import React from "react";
import type { Seat } from "../types";

interface Props {
    seats: Seat[];
    selectedSeats: number[];
    lockedSeats: number[];
    onSeatClick: (seatNumber: number) => void;
}

type SeatStatus = "available" | "selected" | "booked" | "locked";

const getSeatStatus = (
    seat: Seat,
    selectedSeats: number[],
    lockedSeats: number[]
): SeatStatus => {
    if (!seat.isAvailable) return "booked";
    if (lockedSeats.includes(seat.seatNumber)) return "locked";
    if (selectedSeats.includes(seat.seatNumber)) return "selected";
    return "available";
};

const seatStyles: Record<SeatStatus, string> = {
    available:
        "bg-white border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 shadow-sm cursor-pointer hover:shadow-md",
    selected:
        "bg-indigo-600 shadow-md border-indigo-600 text-white cursor-pointer hover:bg-indigo-700",
    booked:
        "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-70",
    locked:
        "bg-amber-50 border-amber-200 text-amber-600 shadow-inner cursor-not-allowed",
};

export default React.memo(function SeatGrid({
    seats,
    selectedSeats,
    lockedSeats,
    onSeatClick,
}: Props) {
    const lowerDeckSeats = seats.filter(
        (s) => !s.sleeperLevel || s.sleeperLevel === "lower"
    );
    const upperDeckSeats = seats.filter((s) => s.sleeperLevel === "upper");

    const maxCol = Math.max(...seats.map((s) => s.column));

    const renderDeck = (deckSeats: Seat[], label: string) => {
        if (deckSeats.length === 0) return null;

        const rows = deckSeats.reduce((acc, seat) => {
            if (!acc[seat.row]) acc[seat.row] = [];
            acc[seat.row].push(seat);
            return acc;
        }, {} as Record<number, Seat[]>);

        return (
            <div className="mb-8">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight mb-4 uppercase">{label}</h3>
                
                {label === "Lower Deck" || label === "Main Deck" ? (
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>🚪</span>
                            <span>Door</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <span>Driver</span>
                            <span>🚌</span>
                        </div>
                    </div>
                ) : null}

                <div className="border border-slate-200 rounded-3xl p-6 bg-slate-50/50 shadow-inner overflow-x-auto">
                    <div className="flex flex-col gap-3 min-w-max">
                        {Object.entries(rows).map(([rowNum, rowSeats]) => {
                            const sorted = [...rowSeats].sort(
                                (a, b) => a.column - b.column
                            );

                            return (
                                <div key={rowNum} className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 w-6 text-right shrink-0">
                                        {rowNum}
                                    </span>

                                    <div className="flex gap-3 flex-1">
                                        {sorted.map((seat, idx) => {
                                            const status = getSeatStatus(
                                                seat,
                                                selectedSeats,
                                                lockedSeats
                                            );
                                            
                                            const needsAisle = (maxCol === 4 || maxCol === 3) && idx === 2;
                                            const isSleeper = seat.seatType === "sleeper";

                                            return (
                                                <div
                                                    key={seat.seatNumber}
                                                    className="flex items-center gap-3"
                                                >
                                                    {needsAisle && <div className="w-10" />}
                                                    <button
                                                        onClick={() => {
                                                            if (
                                                                status === "available" ||
                                                                status === "selected"
                                                            ) {
                                                                onSeatClick(seat.seatNumber);
                                                            }
                                                        }}
                                                        disabled={
                                                            status === "booked" ||
                                                            status === "locked"
                                                        }
                                                        title={
                                                            status === "booked"
                                                                ? "Already booked"
                                                                : status === "locked"
                                                                ? "Temporarily locked"
                                                                : `Seat ${seat.seatNumber}${
                                                                      seat.sleeperLevel
                                                                          ? ` (${seat.sleeperLevel})`
                                                                          : ""
                                                                  }`
                                                        }
                                                        className={`flex items-center justify-center font-bold transition-all duration-200 border-2 ${
                                                            isSleeper
                                                                ? "w-11 h-24 rounded-xl text-sm"
                                                                : "w-11 h-11 rounded-xl text-xs"
                                                        } ${seatStyles[status]}`}
                                                    >
                                                        {isSleeper ? (
                                                            <div className="flex flex-col items-center gap-1.5">
                                                                <span className="text-lg opacity-80">🛏️</span>
                                                                <span className="text-[10px] uppercase tracking-wider">{seat.seatNumber}</span>
                                                            </div>
                                                        ) : (
                                                            seat.seatNumber
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderDeck(lowerDeckSeats, upperDeckSeats.length > 0 ? "Lower Deck" : "Main Deck")}
            {renderDeck(upperDeckSeats, "Upper Deck")}

            {/* legend */}
            <div className="flex items-center gap-5 mt-6 flex-wrap pb-2">
                {[
                    { status: "available", label: "Available" },
                    { status: "selected", label: "Selected" },
                    { status: "booked", label: "Booked" },
                    { status: "locked", label: "Locked" },
                ].map(({ status, label }) => {
                    const baseStatusStyles = seatStyles[status as SeatStatus].split(" ").slice(0, 3).join(" ");
                    
                    return (
                        <div key={status} className="flex items-center gap-2">
                            <div
                                className={`w-5 h-5 rounded-md border-2 ${baseStatusStyles} shadow-sm`}
                            />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
});