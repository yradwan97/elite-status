// src/pages/reservation/ReservationPage.tsx
import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { ChevronRight } from "lucide-react";
import { cn, formatDate, scrollToTop } from "@/lib/utils";
import { useProperty } from "../api/hooks/useProperty";
import { PageTitle } from "@/components/shared/PageTitle";

import { StepBar } from "./components/StepBar";
import { PricingStep } from "./components/PricingStep";
import { CalendarStep } from "./components/CalendarStep";
import { ServicesStep } from "./components/ServicesStep";
import { ConfirmationStep } from "./components/ConfirmationStep";

import type { Step, BookingState, PricingPlan } from "./types/types";
import { Button } from "@/components/ui/button";
import useReservationMutation from "./api/hooks/useReservationMutation";
import { CreateReservationPayload } from "./api/reservationApi";
import { usePaymentMethods } from "./api/hooks/usePaymentMethods";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { queryClient } from "@/lib/query-client";
import { useReservationTypesInfo } from "./api/hooks/useReservationTypesInfo";

const STEPS: Step[] = ["pricing", "calendar", "services", "confirmation"];

export default function ReservationPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isRTL = i18next.language === "ar";
  

  const { property, isLoading, error } = useProperty(id);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { paymentMethods, isLoading: isPaymentMethodsLoading } =
    usePaymentMethods();

  const {typesInfo} = useReservationTypesInfo()

  console.log(typesInfo)

  const [currentStep, setCurrentStep] = useState<Step>("pricing");
  const [booking, setBooking] = useState<BookingState>({
    planKey: null,
    planPrice: 0,
    startDate: undefined,
    endDate: undefined,
    acceptedTerms: false,
    services: [],
    paymentMethod: "1",
    paymentOption: "50",
    usePlan: false
  });

  useEffect(() => {
    scrollToTop()
  }, [currentStep])

  const createReservation = useReservationMutation()

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
      key: "WEEK_DAYS" as const,
      labelKey: "Properties.Reservation.plan.weekdays",
      subtitleKey: "Properties.Reservation.plan.weekdaysSub",
      price: property.weekdaysPrice ?? 0,
    },
    {
      key: "WEEK_END" as const,
      labelKey: "Properties.Reservation.plan.weekend",
      subtitleKey: "Properties.Reservation.plan.weekendSub",
      price: property.weekendPrice ?? 0,
    },
    {
      key: "WHOLE_WEEK" as const,
      labelKey: "Properties.Reservation.plan.wholeWeek",
      subtitleKey: "Properties.Reservation.plan.wholeWeekSub",
      price: property.wholeWeekPrice ?? 0,
    },
    {
      key: "DAILY" as const,
      labelKey: "Properties.Reservation.plan.dailyStay",
      subtitleKey: "Properties.Reservation.plan.dailyStaySub",
      price: property.dailyPrice ?? 0,
    },
    {
      key: "DAY_USE" as const,
      labelKey: "Properties.Reservation.plan.dayUse",
      subtitleKey: "Properties.Reservation.plan.dayUseSub",
      price: property.dayUsePrice ?? 0,
    },
  ]
  .map((plan) => {
    const typeInfo = typesInfo.find(t => t.type === plan.key)
    return {
      ...plan,
      info: (isRTL ? typeInfo?.infoAr : typeInfo?.infoEn) ?? t("Properties.Reservation.info.info")
    }
  })
  .filter((p) => p.price > 0);

  const onPay = () => {
    setPaymentModalOpen(true);
  };

  const submitReservation = async (
    paymentMethodId: "1" | "2"
  ) => {
    if (!booking.startDate || !booking.planKey) {
      return;
    }

    const payload: CreateReservationPayload = {
      startDate: formatDate({date: booking.startDate, format: 'short'}),
      reservationType: booking.planKey,
      paymentMethod: paymentMethodId,
      deposit: booking.paymentOption === "50",
      services: booking.services.map(
        (service) => service._id
      ),
      property: id,
      usePlan: booking.usePlan
    };

    try {
      const html =
        await createReservation.mutateAsync(
          payload
        );

        queryClient.invalidateQueries({queryKey: ['discounted-reservations', 'reservations']})

      const paymentWindow = window.open(
        ""
      );

      if (!paymentWindow) {
        toast.error(
          t("General.popupBlocked")
        );

        return;
      }

      const blob = new Blob([html], {
        type: "text/html",
      });

      const blobUrl =
        URL.createObjectURL(blob);

      paymentWindow.location.href = blobUrl;

      let cleanedUp = false;

      const cleanup = () => {
        if (cleanedUp) return;

        cleanedUp = true;

        clearInterval(popupWatcher);

        URL.revokeObjectURL(blobUrl);
      };

      paymentWindow.addEventListener(
        "load",
        cleanup
      );

      const popupWatcher = setInterval(() => {
        if (paymentWindow.closed) {
          cleanup();

          navigate(
            "/account",
            { state: { page: "booking" } }
          );
        }
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

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
              property={property}
              plans={plans}
              selectedPlanKey={booking.planKey}
              onPlanSelect={(key, price) => {
                if (!booking.planKey || booking.planKey !== key) {
                  setBooking((b) => ({ ...b, planKey: key, planPrice: price }))
                } else if (booking.planKey === key) {
                  setBooking((b) => ({ ...b, planKey: null, planPrice: 0, startDate: undefined, endDate: undefined, acceptedTerms: false }))
                }
              }}
              onNext={goNext}
              isRTL={isRTL}
            />
          )}

          {currentStep === "calendar" && (
            <CalendarStep
              selectedPlan={plans.find((p) => p.key === booking.planKey) as PricingPlan}
              startDate={booking.startDate}
              endDate={booking.endDate}
              acceptedTerms={booking.acceptedTerms}
              onDateChange={(s, e) => setBooking((b) => ({ ...b, startDate: s, endDate: e }))}
              onTermsChange={(v) => setBooking((b) => ({ ...b, acceptedTerms: v }))}
              onNext={goNext}
              onBack={goBack}
              propertyId={id}
            />
          )}

          {currentStep === "services" && (
            <ServicesStep

              selectedServices={booking.services}
              onToggleService={(service) =>
                setBooking((b) => ({
                  ...b,
                  services: b.services.some(S => S._id === service._id)
                    ? b.services.filter((x) => x._id !== service._id)
                    : [...b.services, service],
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
              services={booking.services}
              onBack={goBack}
              onPay={onPay}
              isRTL={isRTL}
              onPaymentOptionChange={(value) =>
                setBooking((b) => ({
                  ...b,
                  paymentOption: value,
                }))
              }
              onPlanSelectionChange={(checked) =>
                setBooking((b) => ({
                  ...b,
                  usePlan: checked
                }))
              }
            />
          )}
        </div>
      </div>

      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {t("Properties.Reservation.confirmation.selectPaymentMethod")}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {isPaymentMethodsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy" />
              </div>
            ) : (
              paymentMethods?.map((method) => (
                <button
                  key={method.value}
                  onClick={() => {
                    setBooking((b) => ({
                      ...b,
                      paymentMethod: method.value,
                    }));

                    setPaymentModalOpen(false);

                    submitReservation(method.value);
                  }}
                  className="w-full border border-gray-200 hover:border-navy hover:bg-gray-50 transition-all rounded-xl p-4 flex items-center justify-between"
                >
                  <div className={cn("text-left", isRTL && "text-right")}>
                    <p className="font-semibold text-navy">
                      {method.name}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}