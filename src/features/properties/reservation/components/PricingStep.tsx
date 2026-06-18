import { Button } from "@/components/ui/button";
import { adjustReservationPriceForOffer, cn } from "@/lib/utils";
import { BookingState, PricingPlan } from "../types/types";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Property } from "../../api/propertiesApi";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface PricingStepProps {
  plans: PricingPlan[];
  property: Property
  booking: BookingState
  onPlanSelect: (key: string, price: number | null, eventId?: string) => void;
  onNext: () => void;
  isRTL: boolean;
}

export function PricingStep({
  plans,
  booking,
  onPlanSelect,
  onNext,
  isRTL,
  property
}: PricingStepProps) {
  const { t } = useTranslation();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(isRTL ? "ar-KW" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const activePropertyEvents = (property.events || []).filter(({ event }) => {
    const start = new Date(event.startDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return start >= today;
  })

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-navy text-center mb-6">
        {t("Properties.Reservation.pricing.title")}
      </h2>

      <div className="space-y-3">
        {plans.map((plan) => (
          plan.price ? (
            // — Normal plan card —
            <div
              key={plan.key}
              className={cn(
                "w-full flex items-center justify-between rounded-2xl p-4 border transition-all text-left",
                booking.planKey === plan.key
                  ? "border-navy bg-navy/5"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className={cn("flex flex-col", isRTL && "items-start")}>
                <p className={cn("font-semibold text-navy", isRTL && "text-right")}>
                  {t(plan.labelKey)}
                </p>
                {plan.subtitleKey && (
                  <p className="text-sm text-gray-400 mt-0.5">{t(plan.subtitleKey)}</p>
                )}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-md text-turquoise hover:opacity-70 transition-opacity">
                      <Info className="w-3.5 h-3.5" />
                      {t("Properties.Reservation.info.info")}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 text-md text-gray-600 flex flex-col gap-1.5">
                    <p className="text-md">{plan.info}</p>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <span className="text-navy font-bold text-base">
                    {plan.price} {t("General.kwd")}
                  </span>
                <Switch
                  dir="ltr"
                  className="shrink-0"
                  checked={booking.planKey === plan.key}
                  onCheckedChange={() => onPlanSelect(plan.key, plan.price)}
                />
              </div>
            </div>
          ) : activePropertyEvents.length > 0 ? (
            // — Events plan card (collapsible) —
            <Collapsible key={plan.key}>
              <div
                className={cn(
                  "w-full rounded-2xl border transition-all text-left",
                  "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {/* Header row — mirrors normal plan layout */}
                <div className="flex items-center justify-between p-4">
                  <div className={cn("flex flex-col", isRTL && "items-start")}>
                    <p className={cn("font-semibold text-navy", isRTL && "text-right")}>
                      {t(plan.labelKey)}
                    </p>
                    {plan.subtitleKey && (
                      <p className="text-sm text-gray-400 mt-0.5">{t(plan.subtitleKey)}</p>
                    )}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="flex items-center gap-1 text-md text-turquoise hover:opacity-70 transition-opacity">
                          <Info className="w-3.5 h-3.5" />
                          {t("Properties.Reservation.info.info")}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 text-md text-gray-600 flex flex-col gap-1.5">
                        <p className="text-md">{plan.info}</p>
                      </PopoverContent>
                    </Popover>
                  </div>

                  <CollapsibleTrigger asChild>
                    <button className="group flex items-center gap-1 text-sm text-turquoise hover:opacity-70 transition-opacity shrink-0">
                      {t("Properties.Reservation.pricing.viewEvents", "View Events")}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </button>
                  </CollapsibleTrigger>
                </div>

                {/* Expanded events list */}
                <CollapsibleContent>
                  <div className="border-t border-gray-100">
                    {activePropertyEvents?.length > 0 ? (
                      <ul className="p-3 space-y-2">
                        {activePropertyEvents
                          .map(({ _id, event, price }) => {
                            const offerPrice = adjustReservationPriceForOffer(price, property, new Date(event.startDate), new Date(event.endDate))
                            const hasMatchingActiveOffer = price !== offerPrice
                            return (
                              <li
                                key={_id}
                                className={cn(
                                  "flex items-center justify-between rounded-2xl p-4 border transition-all",
                                  booking.eventId === _id
                                    ? "border-navy bg-navy/5"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                )}
                              >
                                <div className={cn("flex flex-col", isRTL && "items-start")}>
                                  <p className={cn("font-semibold text-navy text-sm", isRTL && "text-right")}>
                                    {isRTL ? event.nameAr : event.nameEn}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-0.5">
                                    {formatDate(event.startDate)} – {formatDate(event.endDate)}
                                  </p>
                                </div>

                                <div className="flex flex-col items-end gap-3 shrink-0">
                                  {hasMatchingActiveOffer ? (
                                    <span className="flex items-center gap-2">
                                      <span className="text-gray-400 line-through text-sm">
                                        {price} {t("General.kwd")}
                                      </span>
                                      <span className="text-navy font-bold text-base">
                                        {offerPrice} {t("General.kwd")}
                                      </span>
                                    </span>
                                  ) : (
                                    <span className="text-navy font-bold text-base">
                                      {price} {t("General.kwd")}
                                    </span>
                                  )}
                                  <Switch
                                    dir="ltr"
                                    className="shrink-0"
                                    checked={booking.eventId === _id}
                                    onCheckedChange={() => onPlanSelect("EVENTS", price, _id)}
                                  />
                                </div>
                              </li>
                            )
                          })}
                      </ul>
                    ) : (
                      <p className="py-4 text-sm text-gray-400 text-center">
                        {t("Properties.Reservation.pricing.noEvents", "No events available")}
                      </p>
                    )}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ) : null
        ))}
      </div>

      <Button
        className="w-full mt-8 bg-navy hover:bg-[#243760] text-white rounded-xl h-11 font-semibold"
        disabled={!booking.planKey}
        onClick={onNext}
      >
        {t("Properties.Reservation.next")}
      </Button>
    </div>
  );
}