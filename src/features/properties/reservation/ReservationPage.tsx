// src/pages/reservation/ReservationPage.tsx
import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProperty } from "../api/hooks/useProperty";
import { PageTitle } from "@/components/shared/PageTitle";

import { StepBar } from "./components/StepBar";
import { PricingStep } from "./components/PricingStep";
import { CalendarStep } from "./components/CalendarStep";
import { ServicesStep } from "./components/ServicesStep";
import { ConfirmationStep } from "./components/ConfirmationStep";

import type { Step, BookingState, PricingPlan } from "./types/types";
import { Button } from "@/components/ui/button";

const STEPS: Step[] = ["pricing", "calendar", "services", "confirmation"];

export default function ReservationPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = i18next.language === "ar";

  const { property, isLoading, error } = useProperty(id);

  const [currentStep, setCurrentStep] = useState<Step>("pricing");
  const [booking, setBooking] = useState<BookingState>({
    planKey: null,
    planPrice: 0,
    startDate: null,
    endDate: null,
    acceptedTerms: false,
    selectedServices: [],
  });

  const goNext = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) setCurrentStep(STEPS[idx + 1]);
  }, [currentStep]);

  const goBack = useCallback(() => {
    const idx = STEPS.indexOf(currentStep);
    if (idx === 0) {
      navigate(`/properties/${id}`);
    } else {
      setCurrentStep(STEPS[idx - 1]);
    }
  }, [currentStep, id, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">{t("Properties.Details.error")}</p>
        <Button onClick={() => navigate(-1)}>{t("Properties.Details.retry")}</Button>
      </div>
    );
  }

  const title = isRTL ? property.titleAr : property.titleEn;

  const plans: PricingPlan[] = [
    {
      key: "Weekdays",
      labelKey: "Properties.Reservation.plan.weekdays",
      subtitleKey: "Properties.Reservation.plan.weekdaysSub",
      price: property.weekdaysPrice ?? 0,
    },
    {
      key: "Weekend",
      labelKey: "Properties.Reservation.plan.weekend",
      subtitleKey: "Properties.Reservation.plan.weekendSub",
      price: property.weekendPrice ?? 0,
    },
    {
      key: "Whole Week",
      labelKey: "Properties.Reservation.plan.wholeWeek",
      subtitleKey: "Properties.Reservation.plan.wholeWeekSub",
      price: property.wholeWeekPrice ?? 0,
    },
    {
      key: "Daily (With Stay)",
      labelKey: "Properties.Reservation.plan.dailyStay",
      subtitleKey: "Properties.Reservation.plan.dailyStaySub",
      price: property.dailyPrice ?? 0,
    },
    {
      key: "Daily (Day Use)",
      labelKey: "Properties.Reservation.plan.dayUse",
      subtitleKey: "Properties.Reservation.plan.dayUseSub",
      price: property.dayUsePrice ?? 0,
    },
  ].filter((p) => p.price > 0);

//   const extraServices: ExtraService[] = property.extraServices ?? [];

  return (
    <>
      <PageTitle titleKey="" fallback={title} />

      <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-white font-sans">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 pt-5 pb-2">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <button onClick={() => navigate("/")} className="hover:text-navy transition-colors">
              {t("Properties.Details.breadcrumb.home")}
            </button>
            <ChevronRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
            <button
              onClick={() => navigate(`/properties/${id}`)}
              className="hover:text-navy transition-colors"
            >
              {t("Properties.Reservation.breadcrumb.details")}
            </button>
            <ChevronRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
            <span className="text-navy font-medium">
              {t("Properties.Reservation.breadcrumb.reservation")}
            </span>
          </nav>
        </div>

        <div className="max-w-6xl mx-auto px-4 pt-2 pb-6">
          <h1 className="text-2xl font-bold text-navy leading-tight">{title}</h1>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <StepBar current={currentStep} />
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-16">
          {currentStep === "pricing" && (
            <PricingStep
              plans={plans}
              selectedPlanKey={booking.planKey}
              onPlanSelect={(key, price) =>
                setBooking((b) => ({ ...b, planKey: key, planPrice: price }))
              }
              onNext={goNext}
              isRTL={isRTL}
            />
          )}

          {currentStep === "calendar" && (
            <CalendarStep
              selectedPlan={booking.planKey}
              planPrice={booking.planPrice}
              startDate={booking.startDate}
              endDate={booking.endDate}
              acceptedTerms={booking.acceptedTerms}
              onDateChange={(s, e) => setBooking((b) => ({ ...b, startDate: s, endDate: e }))}
              onTermsChange={(v) => setBooking((b) => ({ ...b, acceptedTerms: v }))}
              onNext={goNext}
              onBack={goBack}
              isRTL={isRTL}
            />
          )}

          {currentStep === "services" && (
            <ServicesStep
              services={[]}
              selectedServices={booking.selectedServices}
              onToggleService={(sid) =>
                setBooking((b) => ({
                  ...b,
                  selectedServices: b.selectedServices.includes(sid)
                    ? b.selectedServices.filter((x) => x !== sid)
                    : [...b.selectedServices, sid],
                }))
              }
              onNext={goNext}
              onBack={goBack}
              isRTL={isRTL}
            />
          )}

          {currentStep === "confirmation" && (
            <ConfirmationStep
              property={property}
              booking={booking}
              plans={plans}
              services={[]}
              onBack={goBack}
              onPay={() => console.log("Pay pressed", booking)}
              isRTL={isRTL}
            />
          )}
        </div>
      </div>
    </>
  );
}