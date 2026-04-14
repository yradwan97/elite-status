import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    current,
    total,
    onPageChange,
}: {
    current: number;
    total: number;
    onPageChange: (p: number) => void;
}) {
    if (total <= 1) return null;

    const pages: (number | '…')[] = [];

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
    } else {
        pages.push(1);
        if (current > 3) pages.push('…');
        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
        if (current < total - 2) pages.push('…');
        pages.push(total);
    }

    const btn = (label: React.ReactNode, page: number | null, active = false, disabled = false) => (
        <button
            key={String(label)}
            onClick={() => page !== null && onPageChange(page)}
            disabled={disabled}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
                ${active ? 'bg-navy text-white' : 'text-gray-600 hover:bg-gray-100'}
                ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
            `}
        >
            {label}
        </button>
    );

    return (
        <div className="flex items-center justify-center gap-1 mt-10">
            {btn(<ChevronLeft className="w-4 h-4" />, current - 1, false, current === 1)}
            {pages.map((p, i) =>
                p === '…'
                    ? <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400">…</span>
                    : btn(p, p, p === current)
            )}
            {btn(<ChevronRight className="w-4 h-4" />, current + 1, false, current === total)}
        </div>
    );
}