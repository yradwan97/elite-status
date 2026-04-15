import i18next from "i18next";

export default function Counter({
    label,
    value,
    onChange,
}: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) {
    return (
        <div className={ `flex items-center justify-between py-3 border-b border-gray-100 last:border-0 ${i18next.language === 'ar' ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <div className={`flex items-center gap-2 ${i18next.language === 'ar' ? 'flex-row-reverse' : ''}`}>
                <button
                    onClick={() => onChange(Math.max(0, value - 1))}
                    className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    −
                </button>
                <span className="w-5 text-center text-sm font-semibold text-navy">{value}</span>
                <button
                    onClick={() => onChange(value + 1)}
                    className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    +
                </button>
            </div>
        </div>
    );
}