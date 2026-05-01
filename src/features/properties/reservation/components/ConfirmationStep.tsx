import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingState, PricingPlan, ExtraService } from "../types/types";
import { useTranslation } from "react-i18next";
import { Property } from "../../api/propertiesApi";
import i18next from "i18next";
import { useReservationPolicies } from "../api/hooks/useReservationPolicies";
import { useEffect } from "react";

interface ConfirmationStepProps {
  property: Property;
  booking: BookingState;
  plans: PricingPlan[];
  services: ExtraService[];
  onBack: () => void;
  onPay: () => void;
  isRTL: boolean;
  onPaymentOptionChange: (value: "50" | "100") => void;
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-base shrink-0 mt-0.5">{icon}</span>
      <div className="">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-navy mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function PriceLine({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm text-gray-600", bold && "font-semibold text-navy")}>
        {label}
      </span>
      <span
        className={cn(
          "text-sm",
          bold ? "font-bold text-navy px-3 py-0.5 bg-gray-100 rounded-lg" : "text-gray-700"
        )}
      >
        {value}
      </span>
    </div>
  );
}

const formatTimeTo12Hour = (language: string, time?: string): string => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const period = hours >= 12 ? (language === "ar" ? "مساء" : "PM") : (language === "ar" ? "صباحا" : "AM");
  const formattedHours = hours % 12 || 12;

  return `${formattedHours}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;
};

export function ConfirmationStep({
  property,
  booking,
  plans,
  services,
  onBack,
  onPay,
  isRTL,
  onPaymentOptionChange
}: ConfirmationStepProps) {
  const { t } = useTranslation();
  const paymentOption = booking.paymentOption;

  const selectedServicesList = services.filter((s) => booking.services.map(s => s._id).includes(s._id));
  const servicesTotal = selectedServicesList.reduce((sum, s) => sum + s.price, 0);
  const insurance = property.insurance ?? 0;
  const subtotal = booking.planPrice + servicesTotal;
  //   const discount = property.packageDiscount ?? 0;
  const netAmount = subtotal - 0;
  const payNow = paymentOption === "50" ? (netAmount / 2).toFixed(2) : netAmount;
  const language = i18next.language

  const {checkInTime, checkOutTime} = useReservationPolicies(booking.planKey)

  useEffect(() => {
    console.log(services)
  }, [services])

  const formatBookingDates = (): string => {
    const locale = language === "ar" ? "ar-KW" : "en-US";
    const { startDate, endDate, planKey } = booking

    if (!startDate) return "-";

    const formatOptions: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    const formatSingleDate = (date: Date): string =>
      date.toLocaleDateString(locale, formatOptions);

    // DAY_USE: Show only start date
    if (planKey === "DAY_USE") {
      return formatSingleDate(startDate);
    }

    // DAILY: Show range from startDate to startDate + 1 day
    if (planKey === "DAILY") {
      const nextDay = new Date(startDate);
      nextDay.setDate(nextDay.getDate() + 1);

      return `${formatSingleDate(startDate)} — ${formatSingleDate(nextDay)}`;
    }

    // WHOLE_WEEK / WEEK_DAYS / WEEK_END: Use startDate to endDate from booking
    if (
      planKey === "WHOLE_WEEK" ||
      planKey === "WEEK_DAYS" ||
      planKey === "WEEK_END"
    ) {
      if (!endDate) return formatSingleDate(startDate); // fallback

      return `${formatSingleDate(startDate)} — ${formatSingleDate(endDate)}`;
    }

    // Default fallback (if planKey is unknown)
    if (endDate) {
      return `${formatSingleDate(startDate)} — ${formatSingleDate(endDate)}`;
    }

    return formatSingleDate(startDate);
  };

  const selectedPlan = plans.find((p) => p.key === booking.planKey);
  const planLabel = selectedPlan ? t(selectedPlan.labelKey) : booking.planKey ?? "-";

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
  const mapEmbedUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${property.lat},${property.long}&zoom=14&size=600x220&markers=color:red%7C${property.lat},${property.long}&key=${GOOGLE_MAPS_API_KEY}`;
  //   const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.long}`;

  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      {/* LEFT — Booking Summary */}
      <div className="border border-gray-200 rounded-2xl p-5 space-y-5 bg-white">
        <SummaryRow
          icon="📅"
          label={t("Properties.Reservation.confirmation.dates")}
          value={formatBookingDates()}
        />
        <div className="h-px bg-gray-100" />

        <SummaryRow
          icon="🕙"
          label={t("Properties.Reservation.confirmation.time")}
          value={`${formatTimeTo12Hour(language, checkInTime)} - ${formatTimeTo12Hour(language, checkOutTime)}`}
        />
        <div className="h-px bg-gray-100" />

        <SummaryRow
          icon="🏷️"
          label={t("Properties.Reservation.confirmation.rentType")}
          value={planLabel}
        />
        <div className="h-px bg-gray-100" />

        <SummaryRow
          icon="💰"
          label={t("Properties.Reservation.confirmation.rentAmount")}
          value={`${booking.planPrice} KWD`}
        />
        <div className="h-px bg-gray-100" />

        <SummaryRow
          icon="🛡️"
          label={t("Properties.Reservation.confirmation.insurance")}
          value={`${insurance} KWD`}
        />
        <div className="h-px bg-gray-100" />

        {/* Location Map */}
        <div>
          <p className="text-xs text-gray-400 mb-2">
            {t("Properties.Reservation.confirmation.location")}
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-100">
            {GOOGLE_MAPS_API_KEY ? (
              <img src={mapEmbedUrl} alt="map" className="w-full h-40 object-cover" />
            ) : (
              <iframe
                title="map"
                width="100%"
                height="160"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${property.lat},${property.long}&z=14&output=embed`}
              />
            )}
          </div>
        </div>
      </div>

      {/* RIGHT — Payment & Breakdown */}
      <div className="space-y-4">
        {/* Payment Option */}
        <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
          {(["50", "100"] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => onPaymentOptionChange(opt)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                paymentOption === opt ? "border-navy bg-navy/5" : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <div className={cn("text-left", isRTL && "text-right")}>
                <p className="font-semibold text-navy text-sm">
                  {opt === "50"
                    ? t("Properties.Reservation.confirmation.deposit")
                    : t("Properties.Reservation.confirmation.total")}
                </p>
                <span className="text-xs text-navy">
                  {t("Properties.Reservation.info")}
                </span>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  paymentOption === opt ? "border-navy bg-navy" : "border-gray-300"
                )}
              >
                {paymentOption === opt && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="border border-gray-200 rounded-2xl p-4 bg-white space-y-3">
          <PriceLine
            label={t("Properties.Reservation.confirmation.chalet")}
            value={`${booking.planPrice} KWD`}
          />

          {insurance > 0 && (
            <PriceLine
              label={t("Properties.Reservation.confirmation.insurance")}
              value={`${insurance} KWD`}
            />
          )}
{/* TODO: fix onToggleService in reservationPage to sync selected services to main booking state and render here */}
          {selectedServicesList.map((s) => (
            <PriceLine
              key={s._id}
              label={isRTL ? s.titleAr : s.titleEn}
              value={`${s.price} KWD`}
            />
          ))}

          <div className="h-px bg-gray-100" />

          <PriceLine
            label={t("Properties.Reservation.confirmation.total")}
            value={`${subtotal} KWD`}
            bold
          />

          {/* {discount > 0 && (
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
              <div>
                <p className="text-xs text-gray-400">
                  {t("Properties.Reservation.confirmation.packageDiscount")}
                </p>
                <p className="text-sm font-semibold text-navy">
                  {t("Properties.Reservation.confirmation.goldPackage")}
                </p>
              </div>
              <div className="w-5 h-5 rounded border-2 border-navy flex items-center justify-center">
                <Check className="w-3 h-3 text-navy" />
              </div>
            </div>
          )} */}

          <div className="h-px bg-gray-100" />

          <div className="flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              {t("Properties.Reservation.confirmation.net")}
            </span>
            <span className="font-bold text-xl text-navy">{netAmount} KWD</span>
          </div>

          <Button
            className="w-full bg-navy hover:bg-[#243760] text-white rounded-xl h-11 font-semibold mt-2"
            onClick={onPay}
          >
            {t("Properties.Reservation.confirmation.pay")}
            {paymentOption === "50" && ` (${payNow} KWD)`}
          </Button>
        </div>

        <Button
          variant="ghost"
          className="w-full text-gray-500 hover:text-navy"
          onClick={onBack}
        >
          <ArrowLeft className={`w-4 h-4 mr-2 ${isRTL ? "rotate-180" : ""}`} />
          {t("Properties.Reservation.back")}
        </Button>
      </div>
    </div>
  );
}