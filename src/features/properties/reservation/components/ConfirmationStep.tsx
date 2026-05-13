import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { adjustReservationPriceForOffer, cn, formatTimeTo12Hour, hasOffer } from "@/lib/utils";
import { BookingState, PricingPlan, ExtraService } from "../types/types";
import { useTranslation } from "react-i18next";
import { Property } from "../../api/propertiesApi";
import i18next from "i18next";
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';

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

import { ReactNode } from 'react';

function SummaryRow({ icon, label, value }: { icon: string; label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col p-4 rounded-lg bg-[#f9f9f9] gap-2">
      <div className="flex items-center gap-2">
        <OptimizedImage src={icon} className="size-5" alt={`${label}-icon`} />
        <p className="text-xs text-gray-400">{label}</p>
      </div>
      <div className="text-sm font-semibold text-navy mt-0.5">
        {value}
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



const getDiscountedPrice = (price: number, discountPercentage: number): number => {
  return price * (discountPercentage / 100)
}

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

  const isDepositPrice = (price: number): number => {
    if (booking.paymentOption === "50") {
      return price / 2
    }
    return price
  }

  const user = useSelector(selectUser)
  const userPlan = user?.plan
  
  const rentAmount = isDepositPrice(adjustReservationPriceForOffer(booking.planPrice, property))
  const selectedServicesList = services.filter((s) => booking.services.map(s => s._id).includes(s._id));
  const servicesTotal = isDepositPrice(selectedServicesList.reduce((sum, s) => sum + s.price, 0))
  const insuranceAmount = isDepositPrice(property.insurance);

  const subtotal = rentAmount + servicesTotal + insuranceAmount;

  const discount = (booking.usePlan && userPlan) ? (
    getDiscountedPrice(rentAmount, userPlan.reservationDiscount) + 
    getDiscountedPrice(servicesTotal, userPlan.extraServicesDiscount) + 
    getDiscountedPrice(insuranceAmount, userPlan.insuranceDiscount)
  ) : 0;
  const netAmount = subtotal - discount;
  const language = i18next.language


  

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

  // const hasActiveOffer = true
  const hasActiveOffer = hasOffer(property, booking.startDate?.toISOString(), booking.endDate?.toISOString())

  const rentAmountValue = hasActiveOffer ? <span className="flex items-center gap-2">
    <span className="text-gray-400 line-through text-sm">{booking.planPrice} {t("General.kwd")}</span>
    <span className="text-navy font-bold text-base">{adjustReservationPriceForOffer(booking.planPrice, property, booking.startDate, booking.endDate)} {t("General.kwd")}</span>
  </span> : <span className="text-navy font-bold text-base">{booking.planPrice} {t("General.kwd")}</span>

  

  const selectedPlan = plans.find((p) => p.key === booking.planKey);
  const planLabel = selectedPlan ? t(selectedPlan.labelKey) : booking.planKey ?? "-";

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";
  const mapEmbedUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${property.lat},${property.long}&zoom=14&size=600x220&markers=color:red%7C${property.lat},${property.long}&key=${GOOGLE_MAPS_API_KEY}`;
  //   const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${property.lat},${property.long}`;

  return (
    <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-center gap-6">
      {/* LEFT — Booking Summary */}
      <div className="border border-gray-200 w-full sm:w-1/2 rounded-2xl shadow-xl p-5 space-y-5 bg-white">
        <SummaryRow
          icon={calendarIcon}
          label={t("Properties.Reservation.confirmation.dates")}
          value={formatBookingDates()}
        />

        <SummaryRow
          icon={clockIcon}
          label={t("Properties.Reservation.confirmation.time")}
          value={`${formatTimeTo12Hour(language, selectedPlan?.checkin)} - ${formatTimeTo12Hour(language, selectedPlan?.checkout)}`}
        />

        <SummaryRow
          icon={rentTypeIcon}
          label={t("Properties.Reservation.confirmation.rentType")}
          value={planLabel}
        />

        <SummaryRow
          icon={moneyIcon}
          label={t("Properties.Reservation.confirmation.rentAmount")}
          value={rentAmountValue}
        />

        {insuranceAmount > 0 && (
          <SummaryRow
            icon={insuranceIcon}
            label={t("Properties.Reservation.confirmation.insurance")}
            value={`${property.insurance} ${t("General.kwd")}`}
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
      <div className="space-y-4 w-full sm:w-1/2">
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center gap-1 text-md text-turquoise hover:opacity-70 transition-opacity">
                        <Info className="w-3.5 h-3.5" />
                        {t("Properties.Reservation.info.info")}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 text-md text-gray-600 flex flex-col gap-1.5">
                      <p className="text-md" key={opt}>{t(`Properties.Reservation.info.${opt}`)}</p>
                    </PopoverContent>
                  </Popover>
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
            value={`${rentAmount} ${t("General.kwd")}`}
          />
          <div className="h-px bg-gray-100" />

          {insuranceAmount > 0 && (
            <>
              <PriceLine
                label={t("Properties.Reservation.confirmation.insurance")}
                value={`${insuranceAmount} ${t("General.kwd")}`}
              />
              <div className="h-px bg-gray-100" />
            </>
          )}

          {selectedServicesList.map((s, i) => (
            <>
              <PriceLine
                key={s._id}
                label={isRTL ? s.titleAr : s.titleEn}
                value={`${isDepositPrice(s.price)} ${t("General.kwd")}`}
              />
              {i < selectedServicesList.length - 1 && <div className="h-px bg-gray-100 last:hidden" />}
            </>
          ))}

          {selectedServicesList.length > 0 && <div className="h-px bg-gray-100" />}

          <PriceLine
            label={t("Properties.Reservation.confirmation.total")}
            value={`${subtotal} ${t("General.kwd")}`}
            strong
          />
        </div>


        {/* discount from package subscription */}
        {userPlan && <div className="border border-gray-200 shadow-lg rounded-2xl p-4 bg-white space-y-3">
          <div className="flex items-center justify-between rounded-xl px-3 py-2">
            <div className="flex gap-2 items-center">
              <OptimizedImage src={planIcon} className="size-6" alt="plan-icon" />
              <div className="flex flex-col gap-1">
                <p className="text-lg text-gray-400">
                  {t("Properties.Reservation.confirmation.packageDiscount")}
                </p>
                  <p className="text-sm font-semibold text-navy">
                    {isRTL ? userPlan.titleAr : userPlan.titleEn}
                  </p>
              </div>
            </div>
            <Checkbox
              checked={booking.usePlan}
              onCheckedChange={(checked) => onPlanSelectionChange(checked === true)}
              className="size-5 border-2 border-navy data-[state=checked]:bg-navy data-[state=checked]:border-navy"
            />
          </div>
        </div>}

        <div className="border border-gray-200 shadow-lg rounded-2xl p-4 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg text-navy">
              {t("Properties.Reservation.confirmation.net")}
            </span>
            <span className="font-bold text-xl text-turquoise">{netAmount} {t("General.kwd")}</span>
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