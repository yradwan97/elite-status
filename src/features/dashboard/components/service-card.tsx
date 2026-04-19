import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { OwnerService } from "../owner-services/api/servicesApi";
import i18next from "i18next";
import { useInfo } from "@/common/api/hooks/useInfo";


interface ServiceCardProps {
  service: OwnerService;
  className?: string;
}

export default function ServiceCard({ service, className }: ServiceCardProps) {
  const { t } = useTranslation()
  const isArabic = i18next.language === 'ar';
  const {info} = useInfo();

  const handleBookService = () => {
      if (!info || !info.ownerServices) return;
      // const phoneNumber = info.ownerServices;
      const phoneNumber = 201032315996;
      const message = t("Dashboard.Services.whatsappMessage", { title: isArabic ? service?.titleAr : service?.titleEn });
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
    }

  return (
    <div className={cn(
      "group flex flex-col gap-4 bg-gray-100 border border-gray-300 rounded-2xl p-8 h-full hover:shadow-md hover:border-navy/20 transition-all duration-200",
      className
    )}>
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl  flex items-center justify-center group-hover:bg-navy/10 transition-colors">
        <OptimizedImage src={service.icon} alt={service.titleEn} className="w-8 h-8 object-contain" />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-base font-semibold text-navy">{isArabic ? service.titleAr : service.titleEn}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{isArabic ? service.descriptionAr : service.descriptionEn}</p>
      </div>

      {/* CTA */}
      <button
        onClick={handleBookService}
        className="self-start bg-navy text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
      >
        {t("Dashboard.Services.bookNow") ?? "Book Now"}
      </button>
    </div>
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
        {/* Title */}
        <div className="h-5 bg-gray-300 rounded-lg w-3/4" />
        
        {/* Description - multiple lines */}
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