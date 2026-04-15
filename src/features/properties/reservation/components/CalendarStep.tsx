// src/pages/reservation/components/CalendarStep.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface CalendarStepProps {
  selectedPlan: string | null;
  planPrice: number;
  startDate: Date | null;
  endDate: Date | null;
  acceptedTerms: boolean;
  onDateChange: (start: Date | null, end: Date | null) => void;
  onTermsChange: (accepted: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  isRTL: boolean;
}

export function CalendarStep({
  selectedPlan,
  planPrice,
  startDate,
  endDate,
  acceptedTerms,
  onDateChange,
  onTermsChange,
  onNext,
  onBack,
//   isRTL,
}: CalendarStepProps) {
  const { t } = useTranslation();

  const [viewDate, setViewDate] = useState(() => new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const isBetween = (d: Date, a: Date | null, b: Date | null) => {
    if (!a || !b) return false;
    const t = d.getTime();
    const [lo, hi] = a < b ? [a.getTime(), b.getTime()] : [b.getTime(), a.getTime()];
    return t > lo && t < hi;
  };

  const handleDayClick = (d: Date) => {
    if (d < today) return;

    if (!startDate || (startDate && endDate)) {
      onDateChange(d, null);
    } else {
      if (d < startDate) {
        onDateChange(d, startDate);
      } else {
        onDateChange(startDate, d);
      }
    }
  };

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const dayHeaders = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const effectiveEnd = endDate ?? hoverDate;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Selected Plan Banner */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 mb-6">
        <div>
          <p className="font-semibold text-navy">{selectedPlan}</p>
          <p className="text-sm text-gray-400">
            {t("Properties.Reservation.calendar.selectDates")}
          </p>
          <span className="text-xs text-blue-500 hover:underline cursor-pointer">
            {t("Properties.Reservation.info")}
          </span>
        </div>
        <span className="font-bold text-navy text-base">{planPrice} KWD</span>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 rotate-180 text-gray-500" />
          </button>
          <span className="font-semibold text-navy text-lg">{monthName}</span>
          <button
            onClick={nextMonth}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 mb-4">
          {dayHeaders.map((h) => (
            <div key={h} className="text-center text-xs text-gray-400 font-medium py-1">
              {t(`Properties.Reservation.calendar.days.${h.toLowerCase()}`)}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-y-2">
          {cells.map((d, i) => {
            if (!d) return <div key={`empty-${i}`} className="h-10" />;

            const isPast = d < today;
            const isStart = startDate && isSameDay(d, startDate);
            const isEnd = endDate && isSameDay(d, endDate);
            const isToday = isSameDay(d, today);
            const inRange = isBetween(d, startDate, effectiveEnd);

            return (
              <div
                key={d.toISOString()}
                onMouseEnter={() => !endDate && startDate && d > today && setHoverDate(d)}
                onMouseLeave={() => setHoverDate(null)}
                onClick={() => handleDayClick(d)}
                className={cn(
                  "relative flex items-center justify-center h-11 text-sm select-none rounded-xl transition-all",
                  isPast
                    ? "text-gray-300 cursor-not-allowed"
                    : "cursor-pointer hover:bg-gray-100",
                  inRange && !isPast && "bg-navy/10",
                  (isStart || isEnd) && "bg-navy text-white",
                  isToday && !isStart && !isEnd && "font-bold"
                )}
              >
                {isToday && !isStart && !isEnd && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-navy" />
                )}
                {d.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {/* Terms & Conditions */}
      <label className="flex items-start gap-3 mt-6 cursor-pointer group">
        <div
          onClick={() => onTermsChange(!acceptedTerms)}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
            acceptedTerms ? "bg-navy border-navy" : "border-gray-300"
          )}
        >
          {acceptedTerms && <Check className="w-3 h-3 text-white" />}
        </div>
        <span className="text-sm text-gray-500 leading-relaxed">
          {t("Properties.Reservation.calendar.accept")}{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            {t("Properties.Reservation.calendar.refundPolicy")}
          </span>
          ,{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            {t("Properties.Reservation.calendar.cancellationPolicy")}
          </span>{" "}
          {t("Properties.Reservation.calendar.and")}{" "}
          <span className="text-blue-500 hover:underline cursor-pointer">
            {t("Properties.Reservation.calendar.terms")}
          </span>
        </span>
      </label>

      {/* Navigation Buttons */}
      <div className="flex gap-3 mt-8">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-xl"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("Properties.Reservation.back")}
        </Button>

        <Button
          className="flex-1 bg-navy hover:bg-[#243760] text-white h-11 font-semibold rounded-xl"
          disabled={!startDate || !endDate || !acceptedTerms}
          onClick={onNext}
        >
          {t("Properties.Reservation.next")}
        </Button>
      </div>
    </div>
  );
}