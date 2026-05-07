import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingState, PricingPlan, ExtraService } from "../types/types";
import { useTranslation } from "react-i18next";
import { Property } from "../../api/propertiesApi";
import i18next from "i18next";
import { useReservationPolicies } from "../api/hooks/useReservationPolicies";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import planIcon from "@/assets/plan-icon.png"
import locationIcon from "@/assets/location-icon.png"
import insuranceIcon from "@/assets/insurance-icon.png"
import clockIcon from "@/assets/clock-icon.png"
import calendarIcon from "@/assets/calendar-icon.png"
import moneyIcon from "@/assets/money-icon.png"
import rentTypeIcon from "@/assets/rent-type-icon.png"
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import { Checkbox } from "@/components/ui/checkbox";

interface ConfirmationStepProps {
  property: Property;
  booking: BookingState;
  plans: PricingPlan[];
  services: ExtraService[];
  onBack: () => void;
  onPay: () => void;
  isRTL: boolean;
  onPaymentOptionChange: (value: "50" | "100") => void;
  onPlanSelectionChange: (checked: boolean) => void
}

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col p-4 rounded-lg bg-[#f9f9f9] gap-2">
      <div className="flex items-center gap-2">
        <OptimizedImage src={icon} className="size-5" alt={`${label}-icon`} />
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <div className="">
        <p className="text-sm font-semibold text-navy mt-0.5">{value}</p>
      </div>
    </div>
  );
}

function PriceLine({ label, value, bold = true, strong = false }: { label: string; value: string; bold?: boolean, strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-lg text-navy", bold && "font-semibold text-navy")}>
        {label}
      </span>
      <span
        className={cn(
          "text-sm",
          strong ? "font-bold text-navy px-3 py-0.5 bg-gray-100 rounded-lg" : "font-bold text-navy"
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
  onPaymentOptionChange,
  onPlanSelectionChange
}: ConfirmationStepProps) {
  const { t } = useTranslation();
  const paymentOption = booking.paymentOption;

  const selectedServicesList = services.filter((s) => booking.services.map(s => s._id).includes(s._id));
  const servicesTotal = selectedServicesList.reduce((sum, s) => sum + s.price, 0);
  const insurance = property.insurance ?? 0;
  const subtotal = booking.planPrice + servicesTotal;
  const discount = 0;
  const netAmount = subtotal - discount;
  const language = i18next.language

  const user = useSelector(selectUser)

  const { checkInTime, checkOutTime } = useReservationPolicies(booking.planKey)

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

  const isDepositPrice = (price: number): number => {
    if (booking.paymentOption === "50") {
      return price / 2
    }
    return price
  }

  const selectedPlan = plans.find((p) => p.key === booking.planKey);
  const planLabel = selectedPlan ? t(selectedPlan.labelKey) : booking.planKey ?? "-";

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
  const mapEmbedUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${property.lat},${property.long}&zoom=14&size=600x220&markers=color:red%7C${property.lat},${property.long}&key=${GOOGLE_MAPS_API_KEY}`;
  //   const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.long}`;

  return (
    <div className="w-full max-w-7xl flex justify-center gap-6">
      {/* LEFT — Booking Summary */}
      <div className="border border-gray-200 w-1/2 rounded-2xl shadow-xl p-5 space-y-5 bg-white">
        <SummaryRow
          icon={calendarIcon}
          label={t("Properties.Reservation.confirmation.dates")}
          value={formatBookingDates()}
        />

        <SummaryRow
          icon={clockIcon}
          label={t("Properties.Reservation.confirmation.time")}
          value={`${formatTimeTo12Hour(language, checkInTime)} - ${formatTimeTo12Hour(language, checkOutTime)}`}
        />

        <SummaryRow
          icon={rentTypeIcon}
          label={t("Properties.Reservation.confirmation.rentType")}
          value={planLabel}
        />

        <SummaryRow
          icon={moneyIcon}
          label={t("Properties.Reservation.confirmation.rentAmount")}
          value={`${booking.planPrice} ${t("General.kwd")}`}
        />

        {insurance > 0 && (
          <SummaryRow
            icon={insuranceIcon}
            label={t("Properties.Reservation.confirmation.insurance")}
            value={`${insurance} ${t("General.kwd")}`}
          />
        )}

        {/* Location Map */}
        <div className="rounded-lg shadow-lg bg-[#f9f9f9] p-4">
          <div className="flex items-center gap-2 ">
            <OptimizedImage src={locationIcon} className="size-5 mb-2" alt="location-icon" />
            <p className="text-xs text-gray-400 mb-2">
              {t("Properties.Reservation.confirmation.location")}
            </p>
          </div>
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
      <div className="space-y-4 w-1/2">
        {/* Payment Option */}
        <div className="border border-gray-200 shadow-lg rounded-2xl p-3 h-37 space-y-2 bg-white">
          {(["50", "100"] as const).map((opt) => (
            <>
              <button
                key={opt}
                onClick={() => onPaymentOptionChange(opt)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-1 rounded-xl transition-all",
                )}
              >
                <div className={cn("text-left", isRTL && "text-right")}>
                  <p className="font-semibold text-navy text-sm">
                    {opt === "50"
                      ? t("Properties.Reservation.confirmation.deposit")
                      : t("Properties.Reservation.confirmation.totalPayment")}
                  </p>
                  <span className="text-xs text-navy">
                    {t("Properties.Reservation.info")}
                  </span>
                </div>
                <div
                  className={cn(
                    "size-4 rounded-full border-2 flex items-center justify-center",
                    paymentOption === opt ? "border-navy " : "border-gray-300"
                  )}
                >
                  {paymentOption === opt && <div className="w-2 h-2 rounded-full bg-turquoise" />}
                </div>
              </button>
              <div className="h-px w-4/5 self-center mx-auto bg-gray-100 last:hidden" />
            </>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="border border-gray-200 shadow-lg rounded-2xl p-4 bg-white space-y-3">
          <PriceLine
            label={t("Properties.Reservation.confirmation.chalet")}
            value={`${isDepositPrice(booking.planPrice)} ${t("General.kwd")}`}
          />
          <div className="h-px bg-gray-100" />

          {insurance > 0 && (
            <>
              <PriceLine
                label={t("Properties.Reservation.confirmation.insurance")}
                value={`${insurance} ${t("General.kwd")}`}
              />
              <div className="h-px bg-gray-100" />
            </>
          )}

          {selectedServicesList.map((s) => (
            <>
              <PriceLine
                key={s._id}
                label={isRTL ? s.titleAr : s.titleEn}
                value={`${isDepositPrice(s.price)} ${t("General.kwd")}`}
              />
              {selectedServicesList.length > 1 && <div className="h-px bg-gray-100 last:hidden" />}
            </>
          ))}

          {selectedServicesList.length > 0 && <div className="h-px bg-gray-100" />}

          <PriceLine
            label={t("Properties.Reservation.confirmation.total")}
            value={`${isDepositPrice(subtotal)} ${t("General.kwd")}`}
            strong
          />
        </div>


        {/* discount from package subscription */}
        <div className="border border-gray-200 shadow-lg rounded-2xl p-4 bg-white space-y-3">
          <div className="flex items-center justify-between rounded-xl px-3 py-2">
            <div className="flex gap-2 items-center">
              <OptimizedImage src={planIcon} className="size-6" alt="plan-icon" />
              <div className="flex flex-col gap-1">
                <p className="text-lg text-gray-400">
                  {t("Properties.Reservation.confirmation.packageDiscount")}
                </p>
                {user?.plan && (
                  <p className="text-sm font-semibold text-navy">
                    {isRTL ? user.plan.titleAr : user.plan.titleEn}
                  </p>
                )}
              </div>
            </div>
            <Checkbox
              checked={booking.usePlan}
              onCheckedChange={(checked) => onPlanSelectionChange(checked === true)}
              className="size-5 border-2 border-navy data-[state=checked]:bg-navy data-[state=checked]:border-navy"
            />
          </div>
        </div>

        <div className="border border-gray-200 shadow-lg rounded-2xl p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg text-navy">
              {t("Properties.Reservation.confirmation.net")}
            </span>
            <span className="font-bold text-xl text-turquoise">{isDepositPrice(netAmount)} {t("General.kwd")}</span>
          </div>

          <Button
            className="w-full bg-navy hover:bg-[#243760] text-white rounded-xl h-11 font-semibold mt-2"
            onClick={onPay}
          >
            {t("Properties.Reservation.confirmation.pay")}
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