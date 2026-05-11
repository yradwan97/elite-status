import { Button } from "@/components/ui/button";
import { adjustPriceForOffer, cn, hasOffer } from "@/lib/utils";
import { PricingPlan } from "../types/types";
import { useTranslation } from "react-i18next";
import { Switch } from "@/components/ui/switch";
import { Property } from "../../api/propertiesApi";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info } from 'lucide-react';
interface PricingStepProps {
  plans: PricingPlan[];
  property: Property
  selectedPlanKey: string | null;
  onPlanSelect: (key: string, price: number) => void;
  onNext: () => void;
  isRTL: boolean;
}

export function PricingStep({
  plans,
  selectedPlanKey,
  onPlanSelect,
  onNext,
  isRTL,
  property
}: PricingStepProps) {
  const { t } = useTranslation();

  const hasActiveOffer = hasOffer(property)


  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-navy text-center mb-6">
        {t("Properties.Reservation.pricing.title")}
      </h2>

      <div className="space-y-3">
        {plans.map((plan) => (
          <div
            key={plan.key}
            // onClick={() => onPlanSelect(plan.key, plan.price)}
            className={cn(
              "w-full flex items-center justify-between rounded-2xl p-4 border transition-all text-left",
              selectedPlanKey === plan.key
                ? "border-navy bg-navy/5"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <div className={cn("flex flex-col", isRTL && "items-start")}>
              <p className={cn("font-semibold text-navy", isRTL && "text-right")}>
                {t(plan.labelKey)}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">{t(plan.subtitleKey)}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-1 text-md text-turquoise hover:opacity-70 transition-opacity">
                    <Info className="w-3.5 h-3.5" />
                    {t("Properties.Reservation.info.info")}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 text-md text-gray-600 flex flex-col gap-1.5">
                  <p className="text-md" key={plan.key}>{plan.info}</p>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col items-end gap-3 shrink-0">
              {hasActiveOffer ? (
                <span className="flex items-center gap-2">
                  <span className="text-gray-400 line-through text-sm">{plan.price} {t("General.kwd")}</span>
                  <span className="text-navy font-bold text-base">{adjustPriceForOffer(plan.price, property)} {t("General.kwd")}</span>
                </span>
              ) : (
                <span className="text-navy font-bold text-base">{plan.price} {t("General.kwd")}</span>
              )}
              <Switch dir="ltr" className="shrink-0" checked={selectedPlanKey === plan.key} onCheckedChange={() => onPlanSelect(plan.key, plan.price)} />
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-full mt-8 bg-navy hover:bg-[#243760] text-white rounded-xl h-11 font-semibold"
        disabled={!selectedPlanKey}
        onClick={onNext}
      >
        {t("Properties.Reservation.next")}
      </Button>
    </div>
  );
}