// src/pages/reservation/components/CalendarStep.tsx
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PricingPlan } from "../types/types";
import { useReservedDates } from "../api/hooks/useReservedDates";
import i18next from "i18next";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';
import { TermsCheckbox } from "./TermsCheckbox";

interface CalendarStepProps {
  selectedPlan: PricingPlan;
  startDate: Date | undefined;
  endDate: Date | undefined;
  acceptedTerms: boolean;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  onTermsChange: (accepted: boolean) => void;
  onNext: () => void;
  onBack: () => void;
  propertyId: string;
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Normalise a date to midnight local time so comparisons are day-accurate. */
function toMidnight(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/** Add `days` calendar days to `date`. */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** True if any day in [from, to] is reserved. */
function rangeHasReserved(from: Date, to: Date, reservedSet: Set<string>): boolean {
  const cur = new Date(from);
  while (cur <= to) {
    if (reservedSet.has(cur.toDateString())) return true;
    cur.setDate(cur.getDate() + 1);
  }
  return false;
}

// ─── component ───────────────────────────────────────────────────────────────

export function CalendarStep({
  selectedPlan,
  startDate,
  endDate,
  acceptedTerms,
  onDateChange,
  onTermsChange,
  onNext,
  onBack,
  propertyId,
}: CalendarStepProps) {
  const { t } = useTranslation();

  const { reservedDates } = useReservedDates(propertyId);
  const isRTL = i18next.language === "ar"

  // Pre-compute a Set<string> of reserved date strings for O(1) lookup
  const reservedSet = useMemo<Set<string>>(() => {
    const s = new Set<string>();
    type ReservationEntry = { startDate: string; endDate: string };
    (reservedDates ?? []).forEach((reservation: ReservationEntry) => {
      const start = toMidnight(new Date(reservation.startDate));
      const end = toMidnight(new Date(reservation.endDate));
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return;
      const cur = new Date(start);
      while (cur < end) {
        s.add(cur.toDateString());
        cur.setDate(cur.getDate() + 1);
      }
    });
    return s;
  }, [reservedDates]);

  const today = useMemo(() => toMidnight(new Date()), []);

  const planKey = selectedPlan?.key ?? "";

  // Derive mode from plan
  const isSingleMode = planKey === "DAY_USE" || planKey === "DAILY";

  // ─── local state ────────────────────────────────────────────────────────

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    isSingleMode ? startDate : undefined
  );

  const [rangeStart, setRangeStart] = useState<Date | undefined>(
    !isSingleMode ? startDate : undefined
  );
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(
    !isSingleMode ? endDate : undefined
  );

  const [reservedError, setReservedError] = useState<string | undefined>();

  // ─── derived: which days are "reserved" (for red colouring) ─────────────

  /**
   * react-day-picker accepts `modifiers` prop: Record<string, Matcher>.
   * We pass a custom "reserved" modifier so CalendarDayButton can colour them red.
   */
  const reservedMatcher = useMemo(() => {
    return (date: Date) => reservedSet.has(toMidnight(date).toDateString());
  }, [reservedSet]);

  // ─── disabled logic ──────────────────────────────────────────────────────

  /**
   * For range plans we only allow clicking on "start" days:
   *   WHOLE_WEEK / WEEK_DAYS  → Sundays  (dayOfWeek 0)
   *   WEEK_END                → Thursdays (dayOfWeek 4)
   *
   * Past dates are always disabled.
   * Reserved dates are disabled via the matcher below (but also coloured red).
   */
  const disabledMatcher = useMemo(() => {
    // Past dates always off
    const pastMatcher = { before: today };

    if (isSingleMode) {
      // All days selectable except past + reserved
      return [
        pastMatcher,
        reservedMatcher,
        (date: Date) => [4, 5, 6].includes(date.getDay()) //Thursday, Friday, Saturday disabled
      ];
    }

    switch (planKey) {
      case "WHOLE_WEEK":
      case "WEEK_DAYS":
        // Only Sundays are valid start days; disable all non-Sundays + past + reserved
        return [
          pastMatcher,
          reservedMatcher,
          (date: Date) => date.getDay() !== 0, // not Sunday
        ];

      case "WEEK_END":
        // Only Thursdays are valid start days
        return [
          pastMatcher,
          reservedMatcher,
          (date: Date) => date.getDay() !== 4, // not Thursday
        ];

      default:
        return [pastMatcher, reservedMatcher];
    }
  }, [planKey, isSingleMode, today, reservedMatcher]);

  // ─── handlers ────────────────────────────────────────────────────────────

  const handleClearDates = () => {
    setSelectedDate(undefined);
    setRangeStart(undefined);
    setRangeEnd(undefined);
    setReservedError(undefined);
    onDateChange(undefined, undefined);
  };

  const hasSelection = !!selectedDate || !!rangeStart;

  /**
   * Given a start date, compute the fixed end date based on the plan:
   *   WHOLE_WEEK → +6 days  (Sun → Sat)
   *   WEEK_DAYS  → +3 days  (Sun → Wed)
   *   WEEK_END   → +2 days  (Thu → Sat)
   */
  const computeEndDate = (start: Date): Date => {
    switch (planKey) {
      case "WHOLE_WEEK":
        return addDays(start, 6);
      case "WEEK_DAYS":
        return addDays(start, 3);
      case "WEEK_END":
        return addDays(start, 2);
      default:
        return start;
    }
  };

  const handleSelectSingle = (date: Date | undefined) => {
    setReservedError(undefined);
    setSelectedDate(date);
    onDateChange(date, date);
  };

  /**
   * For range plans, the user clicks a single start day and we auto-complete
   * the range to the fixed end date. We then validate against reservedDates.
   */
  const handleSelectRangeStart = (date: Date | undefined) => {
    setReservedError(undefined);

    if (!date) {
      setRangeStart(undefined);
      setRangeEnd(undefined);
      onDateChange(undefined, undefined);
      return;
    }

    const end = computeEndDate(date);

    // Check for reserved days in [date, end]
    if (rangeHasReserved(date, end, reservedSet)) {
      setRangeStart(undefined);
      setRangeEnd(undefined);
      onDateChange(undefined, undefined);

      switch (planKey) {
        case "WHOLE_WEEK":
          setReservedError(
            t("Properties.Reservation.calendar.reservedInWeekly")
          );
          break;
        default:
          setReservedError(
            t("Properties.Reservation.calendar.reservedDaysInRange")
          );
      }
      return;
    }

    setRangeStart(date);
    setRangeEnd(end);
    onDateChange(date, end);
  };

  // ─── validation ──────────────────────────────────────────────────────────

  const isValidSelection = useMemo(() => {
    if (!selectedPlan) return false;
    if (isSingleMode) return !!selectedDate;
    return !!rangeStart && !!rangeEnd;
  }, [selectedPlan, isSingleMode, selectedDate, rangeStart, rangeEnd]);



  // ─── UI ──────────────────────────────────────────────────────────────────

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
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1 text-md text-turquoise hover:opacity-70 transition-opacity">
                <Info className="w-3.5 h-3.5" />
                {t("Properties.Reservation.info.info")}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-md text-gray-600 flex flex-col gap-1.5">
              <p className="text-md" key={selectedPlan.key}>{selectedPlan.info}</p>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-bold text-navy text-base">
            {selectedPlan?.price} {t("General.kwd")}
          </span>

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

      {/* RESERVED ERROR */}
      {reservedError && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{reservedError}</span>
        </div>
      )}

      {/* CALENDAR */}
      <div className="rounded-2xl flex justify-center border border-gray-200 bg-white p-8">
        {isSingleMode ? (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelectSingle}
            weekStartsOn={0}
            disabled={disabledMatcher}
            modifiers={{ reserved: reservedMatcher }}
            className="w-3/4 max-w-md rounded-lg"
          />
        ) : (
          /**
           * We use mode="single" even for range plans so that onSelect always
           * receives exactly the clicked Date — no ambiguity from react-day-picker's
           * internal range state machine. The visual highlight is applied manually
           * via modifiers (range_start / range_middle / range_end).
           */
          <Calendar
            mode="single"
            selected={rangeStart}
            onSelect={(date) => handleSelectRangeStart(date)}
            weekStartsOn={0}
            disabled={disabledMatcher}
            modifiers={{
              reserved: reservedMatcher,
              range_start: rangeStart ?? false,
              range_end: rangeEnd ?? false,
              range_middle: rangeStart && rangeEnd
                ? (date: Date) => {
                  const d = toMidnight(date);
                  return d > toMidnight(rangeStart) && d < toMidnight(rangeEnd);
                }
                : false,
            }}
            className="w-3/4 max-w-md rounded-lg"
          />
        )}
      </div>

      {/* TERMS */}
      {/* <label className="flex items-start gap-3 mt-8 cursor-pointer group">
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
      </label> */}
      <TermsCheckbox acceptedTerms={acceptedTerms} onTermsChange={onTermsChange} />

      {/* ACTIONS */}
      <div className="flex gap-3 mt-10">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={onBack}
        >
          <ArrowLeft className={`w-4 h-4 mr-2 ${isRTL ? "rotate-180" : ""}`} />
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