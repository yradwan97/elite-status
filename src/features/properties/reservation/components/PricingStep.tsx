import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PricingPlan } from "../types/types";
import { useTranslation } from "react-i18next";

interface PricingStepProps {
  plans: PricingPlan[];
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
}: PricingStepProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-navy text-center mb-6">
        {t("Properties.Reservation.pricing.title")}
      </h2>

      <div className="space-y-3">
        {plans.map((plan) => (
          <button
            key={plan.key}
            onClick={() => onPlanSelect(plan.key, plan.price)}
            className={cn(
              "w-full flex items-center justify-between rounded-2xl p-4 border transition-all text-left",
              selectedPlanKey === plan.key
                ? "border-navy bg-navy/5"
                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
            )}
          >
            <div>
              <p className={cn("font-semibold text-navy", isRTL && "text-right")}>
                {t(plan.labelKey)}
              </p>
              <p className="text-sm text-gray-400 mt-0.5">{t(plan.subtitleKey)}</p>
              <span className="text-xs text-blue-500 hover:underline cursor-pointer mt-1 block">
                {t("Properties.Reservation.info")}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-navy font-bold text-base">{plan.price} KWD</span>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  selectedPlanKey === plan.key ? "border-navy bg-navy" : "border-gray-300 bg-white"
                )}
              >
                {selectedPlanKey === plan.key && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </button>
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