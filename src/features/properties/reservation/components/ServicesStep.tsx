import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useExtraServices } from "../api/hooks/useExtraServices";
import { useState } from "react";
import Pagination from "@/components/shared/Pagination";
import { ExtraService } from "../types/types";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import DOMPurify from "dompurify";

interface ServicesStepProps {
  selectedServices: ExtraService[];
  onToggleService: (service: ExtraService) => void;
  onNext: () => void;
  onBack: () => void;
  isRTL: boolean;
}

export function ServicesStep({
  selectedServices,
  onToggleService,
  onNext,
  onBack,
  isRTL,
}: ServicesStepProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1)
  const { services, pages, isLoading } = useExtraServices(page)

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-lg font-bold text-navy text-center mb-6">
        {t("Properties.Reservation.services.title")}
      </h2>

      <div className="flex flex-col h-[40vh] gap-y-4 overflow-auto bg-white mb-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
            <div key={index}>
              <div className="w-full rounded-2xl shadow-md flex items-center justify-between px-5 py-4 bg-accent animate-pulse">
                <div className="flex-1">
                  <div className="h-4 w-40 bg-gray-200 rounded mb-3" />
                  <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                  <div className="h-3 w-24 bg-gray-200 rounded" />
                </div>

                <div className="w-5 h-5 rounded border-2 border-gray-200 shrink-0 bg-gray-200" />
              </div>

              {index < 5 && (
                <div className="h-px bg-gray-100 mx-5" />
              )}
            </div>
          ))
          : services.map((service, index) => {
            const isSelected = selectedServices.some((s: ExtraService) => s._id === service._id);
            const title = isRTL ? service.titleAr : service.titleEn;
            const description = isRTL ? service.descriptionAr : service.descriptionEn;
            const sanitizedDescription = DOMPurify.sanitize(description ?? "", {
              ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "span", "ul", "ol", "li", "h1", "h2", "h3"],
              ALLOWED_ATTR: ["style", "class"],
            });

            return (
              <div key={index}>
                <button
                  onClick={() => onToggleService(service)}
                  className="w-full rounded-2xl shadow-md text-start flex items-center bg-accent justify-between px-5 py-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <OptimizedImage className="size-26" src={service.icon} alt="Service" />
                    <div>
                      <p className="font-semibold text-navy">{title}</p>

                      <p className="text-sm text-gray-400">
                        {service.price} KWD
                      </p>

                      <p className="text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: sanitizedDescription }}/>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0",
                      isSelected
                        ? "bg-navy border-navy"
                        : "border-gray-300"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </button>

                {index < services.length - 1 && (
                  <div className="h-px bg-gray-100 mx-5" />
                )}
              </div>
            );
          })}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <Pagination
          current={page}
          total={pages ?? 1}
          onPageChange={setPage}
        />
      </div>


      <div className="flex gap-3 mt-10">
        <Button
          variant="ghost"
          className="flex-1 h-12 rounded-xl"
          onClick={onBack}
        >
          <ArrowLeft className={`w-4 h-4 mr-2 ${isRTL ? "rotate-180" : ""}`} />
          {t("Properties.Reservation.back")}
        </Button>
        <Button
          className="flex-1 bg-navy hover:bg-[#243760] text-white h-12 font-semibold rounded-xl"
          onClick={onNext}
        >
          {t("Properties.Reservation.next")}
        </Button>

      </div>
    </div>
  );
}