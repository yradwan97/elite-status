import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { OwnerService } from "../owner-services/api/servicesApi";
import i18next from "i18next";
import { useInfo } from "@/common/api/hooks/useInfo";
import DOMPurify from "dompurify";
import { useState } from "react";
import { X } from "lucide-react";

interface ServiceCardProps {
  service: OwnerService;
  className?: string;
}

export default function ServiceCard({ service, className }: ServiceCardProps) {
  const { t } = useTranslation();
  const isArabic = i18next.language === "ar";
  const { info } = useInfo();
  const [showModal, setShowModal] = useState(false);

  const description = isArabic ? service.descriptionAr : service.descriptionEn;

  const sanitizedDescription = DOMPurify.sanitize(description ?? "", {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "span", "ul", "ol", "li", "h1", "h2", "h3"],
    ALLOWED_ATTR: ["style", "class"],
  });

  const handleBookService = () => {
    if (!info || !info.ownerServices) return;
    const phoneNumber = info.ownerServices;
    const message = t("Dashboard.Services.whatsappMessage", {
      title: isArabic ? service?.titleAr : service?.titleEn,
    });
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <div
        className={cn(
          "group flex flex-col gap-4 bg-gray-100 border border-gray-300 shadow-lg rounded-2xl p-8 h-[249.75px] w-79 hover:shadow-md hover:border-navy/20 transition-all duration-200",
          className
        )}
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors">
          <OptimizedImage
            src={service.icon}
            alt={service.titleEn}
            className="size-16 rounded-2xl object-cover"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-base font-semibold text-navy">
            {isArabic ? service.titleAr : service.titleEn}
          </h3>
          <p
            className="text-sm text-gray-500 leading-relaxed line-clamp-1 cursor-pointer hover:underline hover:text-gray-700 transition-colors"
            dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            onClick={() => setShowModal(true)}
            title={t("Dashboard.Services.readMore") ?? "Click to read more"}
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleBookService}
          className="self-start bg-navy w-23.25 h-9.25 cursor-pointer text-white text-sm font-medium p-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          {t("Dashboard.Services.bookNow") ?? "Book Now"}
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4 relative"
            onClick={(e) => e.stopPropagation()}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-navy">
                {isArabic ? service.titleAr : service.titleEn}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200" />

            {/* Full Description */}
            <div
              className="text-sm text-gray-600 leading-relaxed max-h-72 overflow-y-auto pr-1"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />

            {/* Book Now inside modal too */}
            <button
              onClick={() => {
                setShowModal(false);
                handleBookService();
              }}
              className="self-start bg-navy cursor-pointer text-white text-sm font-medium px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity mt-1"
            >
              {t("Dashboard.Services.bookNow") ?? "Book Now"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface ServiceCardSkeletonProps {
  className?: string;
}

export function ServiceCardSkeleton({ className }: ServiceCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 bg-gray-100 border border-gray-200 rounded-2xl p-8 h-full animate-pulse",
        className
      )}
    >
      {/* Icon Skeleton */}
      <div className="w-16 h-16 rounded-2xl bg-gray-300 flex items-center justify-center">
        <div className="w-8 h-8 bg-gray-400 rounded-xl" />
      </div>

      {/* Text Content Skeleton */}
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-5 bg-gray-300 rounded-lg w-3/4" />
        <div className="space-y-2 mt-1">
          <div className="h-3.5 bg-gray-300 rounded w-full" />
          <div className="h-3.5 bg-gray-300 rounded w-5/6" />
          <div className="h-3.5 bg-gray-300 rounded w-4/5" />
        </div>
      </div>

      {/* Button Skeleton */}
      <div className="self-start h-11 bg-gray-300 rounded-full w-32 mt-2" />
    </div>
  );
}