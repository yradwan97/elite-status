// src/pages/reservation/components/CalendarStep.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import type { DateRange } from "react-day-picker";
import { PricingPlan } from "../types/types";

interface CalendarStepProps {
  selectedPlan: PricingPlan | null;
  startDate: Date | undefined;
  endDate: Date | undefined;
  acceptedTerms: boolean;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  onTermsChange: (accepted: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}

export function CalendarStep({
  selectedPlan,
  startDate,
  endDate,
  acceptedTerms,
  onDateChange,
  onTermsChange,
  onNext,
  onBack,
}: CalendarStepProps) {
  const { t } = useTranslation();

  const isDayUse = selectedPlan?.key === "dayUse";

  // =========================
  // BASE DATE
  // =========================
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // =========================
  // STATE
  // =========================
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    isDayUse ? startDate : undefined
  );

  const [range, setRange] = useState<DateRange | undefined>(
    !isDayUse && startDate
      ? { from: startDate, to: endDate }
      : undefined
  );

  // =========================
  // CLEAR HANDLER
  // =========================
  const handleClearDates = () => {
    setSelectedDate(undefined);
    setRange(undefined);
    onDateChange(undefined, undefined);
  };

  const hasSelection = !!selectedDate || !!range?.from || !!range?.to;

  // =========================
  // DISABLED DAYS
  // =========================
  const disabled = useMemo(() => {
    if (!selectedPlan) return { before: today };

    const base = { before: today };

    switch (selectedPlan.key) {
      case "weekdays":
        return [base, { dayOfWeek: [4, 5, 6] }];

      case "weekends":
        return [base, { dayOfWeek: [0, 1, 2, 3] }];

      // IMPORTANT: no restriction for wholeWeek
      case "wholeWeek":
        return base;

      default:
        return base;
    }
  }, [selectedPlan, today]);

  // =========================
  // HANDLE SELECT
  // =========================
  const handleSelect = (value: Date | DateRange | undefined) => {
    if (!selectedPlan) return;

    // =====================
    // SINGLE MODE
    // =====================
    if (isDayUse) {
      const date = value as Date | undefined;

      setSelectedDate(date);
      onDateChange(date, date);
      return;
    }

    // =====================
    // RANGE MODE
    // =====================
    const newRange = value as DateRange | undefined;

    const finalFrom = newRange?.from;
    let finalTo = newRange?.to;

    // =====================
    // WHOLE WEEK LOGIC
    // =====================
    if (selectedPlan.key === "wholeWeek") {

      if (finalFrom && finalTo) {
        const diffDays =
          Math.floor(
            (finalTo.getTime() - finalFrom.getTime()) /
            (1000 * 60 * 60 * 24)
          ) + 1;

        if (diffDays < 7 || diffDays % 7 !== 0) {
          finalTo = undefined;
        }
      }
    }

    setRange({
      from: finalFrom,
      to: finalTo,
    });

    onDateChange(finalFrom, finalTo);
  };

  // =========================
  // VALIDATION
  // =========================
  const isValidSelection = useMemo(() => {
    if (!selectedPlan) return false;

    if (isDayUse) return !!selectedDate;

    if (!range?.from || !range?.to) return false;

    if (selectedPlan.key === "wholeWeek") {
      const diffDays =
        Math.floor(
          (range.to.getTime() - range.from.getTime()) /
          (1000 * 60 * 60 * 24)
        ) + 1;

      return diffDays >= 7 && diffDays % 7 === 0;
    }

    return true;
  }, [selectedPlan, selectedDate, range, isDayUse]);

  // =========================
  // UI
  // =========================
  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 mb-6">
        <div>
          <p className="font-semibold text-navy">
            {selectedPlan?.labelKey ? t(selectedPlan.labelKey) : ""}
          </p>
          <p className="text-sm text-gray-400">
            {t("Properties.Reservation.calendar.selectDates")}
          </p>
          <span className="text-xs text-navy hover:underline cursor-pointer">
            {t("Properties.Reservation.info")}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-navy text-base">
            {selectedPlan?.price} KWD
          </span>

          {/* CLEAR BUTTON */}
          <button
            type="button"
            onClick={handleClearDates}
            disabled={!hasSelection}
            className="text-sm text-red-500 hover:text-red-600 underline disabled:opacity-40"
          >
            {t("General.clear")}
          </button>
        </div>
      </div>

      {/* CALENDAR */}
      <div className="rounded-2xl flex justify-center border border-gray-200 bg-white p-8">
        {isDayUse ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            weekStartsOn={0}
            disabled={disabled}
            className="w-3/4 max-w-md rounded-lg"
          />
        ) : (
          <Calendar
            mode="range"
            selected={range}
            onSelect={handleSelect}
            weekStartsOn={0}
            disabled={disabled}
            excludeDisabled
            className="w-3/4 max-w-md rounded-lg"
          />
        )}
      </div>

      {/* TERMS */}
      <label className="flex items-start gap-3 mt-8 cursor-pointer group">
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
          <span className="text-blue-700 hover:underline cursor-pointer">
            {t("Properties.Reservation.calendar.refundPolicy")}
          </span>
          ,{" "}
          <span className="text-blue-700 hover:underline cursor-pointer">
            {t("Properties.Reservation.calendar.cancellationPolicy")}
          </span>{" "}
          {t("Properties.Reservation.calendar.and")}{" "}
          <span className="text-blue-700 hover:underline cursor-pointer">
            {t("Properties.Reservation.calendar.terms")}
          </span>
        </span>
      </label>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-10">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onBack}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("Properties.Reservation.back")}
        </Button>

        <Button
          className="flex-1 bg-navy hover:bg-[#243760] text-white h-12 font-semibold rounded-xl"
          disabled={!isValidSelection || !acceptedTerms}
          onClick={onNext}
        >
          {t("Properties.Reservation.next")}
        </Button>
      </div>
    </div>
  );
}