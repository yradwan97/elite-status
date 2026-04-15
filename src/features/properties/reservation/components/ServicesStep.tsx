import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExtraService } from "../types/types";
import { useTranslation } from "react-i18next";

interface ServicesStepProps {
  services: ExtraService[];
  selectedServices: string[];
  onToggleService: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
  isRTL: boolean;
}

export function ServicesStep({
  services,
  selectedServices,
  onToggleService,
  onNext,
  onBack,
  isRTL,
}: ServicesStepProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-navy text-center mb-6">
        {t("Properties.Reservation.services.title")}
      </h2>

      <div className="rounded-2xl border border-blue-200 overflow-hidden bg-white">
        {services.map((service, index) => {
          const isSelected = selectedServices.includes(service._id);
          const title = isRTL ? service.titleAr : service.titleEn;

          return (
            <div key={service._id}>
              <button
                onClick={() => onToggleService(service._id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div>
                  <p className="font-semibold text-navy">{title}</p>
                  <p className="text-sm text-gray-400">{service.price} KWD</p>
                  <span className="text-xs text-blue-500 hover:underline cursor-pointer">
                    {t("Properties.Reservation.info")}
                  </span>
                </div>

                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0",
                    isSelected ? "bg-navy border-navy" : "border-gray-300"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
              {index < services.length - 1 && <div className="h-px bg-gray-100 mx-5" />}
            </div>
          );
        })}

        <Button
          className="w-full bg-navy hover:bg-[#243760] rounded-none h-12 text-base font-semibold"
          onClick={onNext}
        >
          {t("Properties.Reservation.next")}
        </Button>
      </div>

      <Button
        variant="ghost"
        className="w-full mt-3 text-gray-500 hover:text-navy"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t("Properties.Reservation.back")}
      </Button>
    </div>
  );
}