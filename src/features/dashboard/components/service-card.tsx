import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

export interface Service {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon | string; // supports lucide icon or image URL
  onBook: () => void
}

interface ServiceCardProps {
  service: Service;
  className?: string;
}

export default function ServiceCard({ service, className }: ServiceCardProps) {
  const isImageIcon = typeof service.icon === "string";
  const { t } = useTranslation()

  return (
    <div className={cn(
      "group flex flex-col gap-4 bg-gray-100 border border-gray-300 rounded-2xl p-8 h-full hover:shadow-md hover:border-navy/20 transition-all duration-200",
      className
    )}>
      {/* Icon */}
      <div className="w-16 h-16 rounded-2xl  flex items-center justify-center group-hover:bg-navy/10 transition-colors">
        {isImageIcon ? (
          <OptimizedImage src={service.icon as string} alt={service.title} className="w-10 h-10 object-contain" />
        ) : (
          (() => {
            const Icon = service.icon as LucideIcon;
            return <Icon className="w-8 h-8 text-navy" strokeWidth={1.5} />;
          })()
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-base font-semibold text-navy">{service.title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
      </div>

      {/* CTA */}
      <button
        onClick={service.onBook}
        className="self-start bg-navy text-white text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
      >
        {t("Dashboard.Services.bookNow") ?? "Book Now"}
      </button>
    </div>
  );
}