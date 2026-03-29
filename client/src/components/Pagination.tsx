interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: Props) {
    if (totalPages <= 1) return null;

    // Build a compact page list with ellipsis for mobile
    const getPageNumbers = () => {
        const delta = 1;
        const range: (number | "...")[] = [];
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(1);
        if (left > 2) range.push("...");
        for (let i = left; i <= right; i++) range.push(i);
        if (right < totalPages - 1) range.push("...");
        if (totalPages > 1) range.push(totalPages);
        return range;
    };

    return (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-8 flex-wrap">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
                ← Prev
            </button>

            {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold text-sm">…</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition-all duration-200 shadow-sm ${
                            page === currentPage
                                ? "bg-indigo-600 text-white border-transparent"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                        }`}
                    >
                        {page}
                    </button>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 sm:px-4 py-2 rounded-xl border border-slate-200 bg-white shadow-sm text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
                Next →
            </button>
        </div>
    );
}