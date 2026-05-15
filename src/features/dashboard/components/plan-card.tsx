import { useTranslation } from "react-i18next";
import { checkLoggedIn, cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { Plan } from "@/features/profile/api/hooks/usePlans";
import i18next from "i18next";
import { useState } from "react";

import silverPlanIcon from '@/assets/silver-plan-icon.png';
import goldPlanIcon from '@/assets/gold-plan-icon.png';
import platinumPlanIcon from '@/assets/platinum-plan-icon.png';
import diamondPlanIcon from '@/assets/diamond-plan-icon.png';
import greenCheckIcon from "@/assets/green-check.png"
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSubscribeToPlan } from "@/features/profile/api/hooks/useSubscribeToPlan";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const PLAN_FALLBACK_ICONS: Record<string, string> = {
  "Silver Plan": silverPlanIcon,
  "Gold Plan": goldPlanIcon,
  "Platinum Plan": platinumPlanIcon,
  "Diamond Plan": diamondPlanIcon,
};



const PLAN_BADGES: Record<string, { label: string; className: string }> = {
  "Gold Plan": { label: "Dashboard.Pricing.goldBadge", className: `${i18next.language === "ar" ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-[#E0A911] to-navy text-amber-50` },
  "Platinum Plan": { label: "Dashboard.Pricing.platinumBadge", className: `${i18next.language === "ar" ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-[#F92D59] to-navy text-rose-50` },
  "Diamond Plan": { label: "Dashboard.Pricing.diamondBadge", className: `${i18next.language === "ar" ? 'bg-linear-to-l' : 'bg-linear-to-r'} from-turquoise to-navy text-teal-50` },
};

function SubscribeConfirmDialog({
  open,
  planName,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  planName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation();
  const isArabic = i18next.language === "ar";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 className="text-base font-semibold text-gray-900">
          {t("Dashboard.Pricing.confirmTitle") ?? "Confirm Subscription"}
        </h2>

        {/* Body */}
        <p className="text-sm text-gray-500 leading-relaxed">
          {t("Dashboard.Pricing.confirmBody", { plan: planName }) ??
            `You are about to subscribe to the ${planName}. Do you wish to proceed?`}
        </p>

        {/* Actions */}
        <div className={cn("flex  gap-3 mt-2", isArabic ? "flex-row-reverse" : "flex-row")}>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {t("General.cancel") ?? "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-navy text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t("Dashboard.Pricing.confirm") ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlanCard({ plan, isUpgrade = false }: { plan: Plan, isUpgrade?: boolean }) {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const isArabic = i18next.language === "ar";
  const user = useSelector((state: RootState) => state.auth.user);
  const [dialogOpen, setDialogOpen] = useState(false);

  const isFeatured = plan.titleEn === "Platinum Plan";
  const features = isArabic ? plan.featuresAr ?? [] : plan.featuresEn ?? [];
  const icon = plan.icon ?? PLAN_FALLBACK_ICONS[plan.titleEn];
  const badge = PLAN_BADGES[plan.titleEn];
  const planName = isArabic ? plan.titleAr : plan.titleEn;

  const subscribeToPlanMutation = useSubscribeToPlan()

  const onConfirmSubscribe = async () => {
    setDialogOpen(false);
    try {
      const html =
        await subscribeToPlanMutation.mutateAsync(
          plan._id
        );

      const paymentWindow = window.open(
        "",
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
            { state: { page: "price-plan" } }
          );
        }
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative flex flex-col shadow-xl rounded-full h-full pt-6">

      <SubscribeConfirmDialog
        open={dialogOpen}
        planName={planName}
        onConfirm={onConfirmSubscribe}
        onCancel={() => setDialogOpen(false)}
      />

      {/* Badge */}
      {badge && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
          <span style={{fontSize: "20px"}} className={cn("font-alex font-medium px-4 py-1.5 rounded-full whitespace-nowrap", badge.className)}>
            {t(badge.label)}
          </span>
        </div>
      )}

      {/* Card */}
      <div className={cn(
        "relative flex flex-col h-full rounded-2xl p-6 border",
        isFeatured ? "bg-navy border-navy" : "bg-white border-gray-200"
      )}>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {icon && (
            <OptimizedImage src={icon} alt={`${plan.titleEn} icon`} className="w-14 h-14 object-contain" />
          )}
        </div>

        {/* Name */}
        <p style={{fontSize: "20px"}} className={cn("text-center font-alex font-medium text-base", isFeatured ? "text-white" : "text-navy")}>
          {planName}
        </p>

        {/* Billing */}
        <p className={cn("text-center text-xs mt-1", isFeatured ? "text-[#FEFEFE]" : "text-[#4A606B]")}>
          {t("Dashboard.Pricing.billedAnnually") ?? "Billed annually."}
        </p>

        {/* Price */}
        <p className={cn("text-center text-3xl font-semibold mt-4", isFeatured ? "text-white" : "text-navy")}>
          {plan.price} <span className="text-xl">{t("General.kwd")} / {t("General.year")}</span>
        </p>

        <hr className={cn("my-8", isFeatured ? "border-white/10" : "border-gray-100")} />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start justify-start gap-2.5">
              <OptimizedImage src={greenCheckIcon} className="size-5" alt="green-checkmark" />
              <span className={cn(
                "text-xs leading-relaxed",
                isFeatured ? "text-white/90" : "text-gray-700"
              )}>
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => {
            if (checkLoggedIn(user)) setDialogOpen(true)
          }}
          className={cn(
            "mt-6 w-full py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-90",
            isFeatured ? "bg-[#CEA926] text-white" : "bg-navy text-white"
          )}
        >
          {isUpgrade ? t("General.upgrade") : t("Dashboard.Pricing.getStarted")}
        </button>

      </div>
    </div>
  );
}

export function PlanCardSkeleton({ isFeatured = false }: { isFeatured?: boolean }) {
  return (
    <div className="relative flex flex-col h-full pt-6">
      <div className={cn(
        "relative flex flex-col h-full rounded-2xl p-6 border",
        isFeatured ? "bg-navy border-navy" : "bg-white border-gray-200"
      )}>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={cn(
            "w-14 h-14 rounded-full animate-pulse",
            isFeatured ? "bg-white/20" : "bg-gray-200"
          )} />
        </div>

        {/* Name */}
        <div className="flex justify-center mb-2">
          <div className={cn(
            "h-4 w-24 rounded animate-pulse",
            isFeatured ? "bg-white/20" : "bg-gray-200"
          )} />
        </div>

        {/* Billing */}
        <div className="flex justify-center mb-4">
          <div className={cn(
            "h-3 w-20 rounded animate-pulse",
            isFeatured ? "bg-white/10" : "bg-gray-100"
          )} />
        </div>

        {/* Price */}
        <div className="flex justify-center items-baseline gap-2 mb-5">
          <div className={cn(
            "h-8 w-16 rounded animate-pulse",
            isFeatured ? "bg-white/20" : "bg-gray-200"
          )} />
          <div className={cn(
            "h-5 w-20 rounded animate-pulse",
            isFeatured ? "bg-white/10" : "bg-gray-100"
          )} />
        </div>

        <hr className={cn("mb-5", isFeatured ? "border-white/10" : "border-gray-100")} />

        {/* Features */}
        <ul className="flex flex-col gap-3 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <div className={cn(
                "mt-0.5 h-3 rounded animate-pulse",
                isFeatured ? "bg-white/20" : "bg-gray-200",
                i % 3 === 0 ? "w-full" : i % 3 === 1 ? "w-4/5" : "w-3/5"
              )} />
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className={cn(
          "mt-6 w-full h-11 rounded-xl animate-pulse",
          isFeatured ? "bg-amber-500/40" : "bg-navy/20"
        )} />

      </div>
    </div>
  );
}