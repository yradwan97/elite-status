import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/OptimizedImage";

export interface Plan {
  key: string;
  name: string;
  price: number;
  tagline: string;
  badge?: { label: string; className: string };
  featured?: boolean;
  icon?: string;
  features: { label: string; included: boolean }[];
}

export default function PlanCard({ plan }: { plan: Plan }) {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col h-full pt-6">

      {/* Badge */}
      {plan.badge ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <span className={cn("text-xs font-medium px-4 py-1.5 rounded-full whitespace-nowrap", plan.badge.className)}>
            {plan.badge.label}
          </span>
        </div>
      ) : null}

      {/* Card */}
      <div className={cn(
        "relative flex flex-col h-full rounded-2xl p-6 border",
        plan.featured ? "bg-navy border-navy" : "bg-white border-gray-200"
      )}>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {plan.icon && (
            <OptimizedImage src={plan.icon} alt={`${plan.name} icon`} className="w-14 h-14 object-contain" />
          )}
        </div>

        {/* Name */}
        <p className={cn("text-center font-medium text-base", plan.featured ? "text-white" : "text-gray-900")}>
          {plan.name}
        </p>

        {/* Billing */}
        <p className={cn("text-center text-xs mt-1", plan.featured ? "text-white/50" : "text-gray-400")}>
          {t("Dashboard.Pricing.billedAnnually") ?? "Billed annually."}
        </p>

        {/* Price */}
        <p className={cn("text-center text-3xl font-semibold mt-4", plan.featured ? "text-white" : "text-navy")}>
          {plan.price} <span className="text-xl">KWD / YR</span>
        </p>

        {/* Tagline */}
        <p className={cn("text-center text-sm mt-1 mb-5", plan.featured ? "text-white/50" : "text-gray-400")}>
          {plan.tagline}
        </p>

        <hr className={cn("mb-5", plan.featured ? "border-white/10" : "border-gray-100")} />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className={cn(
                "mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                feature.included ? "bg-emerald-500" : "bg-rose-500"
              )}>
                {feature.included
                  ? <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  : <X className="w-3 h-3 text-white" strokeWidth={3} />
                }
              </span>
              <span className={cn(
                "text-xs leading-relaxed",
                feature.included
                  ? plan.featured ? "text-white/90" : "text-gray-700"
                  : plan.featured ? "text-white/20" : "text-gray-300"
              )}>
                {feature.label}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button className={cn(
          "mt-6 w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90",
          plan.featured ? "bg-amber-500 text-white" : "bg-navy text-white"
        )}>
          {t("Dashboard.Pricing.getStarted") ?? "Get Started"}
        </button>

      </div>
    </div>
  );
}