import { PageTitle } from '@/components/shared/PageTitle'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import bgImage from "@/assets/plans-bg.png"
import { OptimizedImage } from '@/components/shared/OptimizedImage'
import planIcon from "@/assets/planIcon.png"
import { cn } from '@/lib/utils'
import i18next from '@/i18n'
import greenCheckIcon from "@/assets/green-check.png"
import DOMPurify from 'dompurify';
import { useSubscribeToPlan } from '../profile/api/hooks/useSubscribeToPlan'
import { toast } from 'sonner'
import { SubscribeConfirmDialog } from '../dashboard/components/plan-card'
import { usePlan } from '../profile/api/hooks/usePlan'

const PlanPageSkeleton = () => (
  <div className="min-h-[60dvh] bg-white mx-10 mt-8.5 overflow-y-hidden flex flex-col gap-8.5 animate-pulse">
    {/* Hero banner */}
    <div className="w-full h-76 rounded-[12px] bg-gray-200" />

    {/* Plan info card */}
    <div className="w-full h-41 flex rounded-[10px] p-5 gap-6.25 shadow-lg items-center bg-[#f9f9f9]">
      <div className="size-20 rounded-full bg-gray-200 shrink-0" />
      <div className="flex flex-col gap-3 flex-1">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-4 w-32 rounded bg-gray-200 mt-2" />
      </div>
    </div>

    {/* Features card */}
    <div className="w-full flex flex-col rounded-[10px] p-5 shadow-lg bg-[#f9f9f9] gap-3">
      <div className="h-5 w-36 rounded bg-gray-200 mt-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-5 rounded-full bg-gray-200 shrink-0" />
            <div className="h-3 rounded bg-gray-200 w-full" />
          </div>
        ))}
      </div>
    </div>

    {/* Policy card */}
    <div className="w-full flex flex-col rounded-[10px] p-5 shadow-lg bg-[#f9f9f9] gap-3">
      <div className="h-5 w-28 rounded bg-gray-200 mt-4" />
      <div className="flex flex-col gap-2 mt-3">
        <div className="h-3 rounded bg-gray-200 w-full" />
        <div className="h-3 rounded bg-gray-200 w-5/6" />
        <div className="h-3 rounded bg-gray-200 w-4/6" />
      </div>
    </div>

    {/* Subscribe button */}
    <div className="w-full mb-19">
      <div className="w-full h-12 rounded-[8px] bg-gray-200" />
    </div>
  </div>
)

const PlanPage = () => {
  const { id } = useParams()
  const { t } = useTranslation();
  const { plan, isLoading } = usePlan(id as string)
  const navigate = useNavigate()
  const isArabic = i18next.language === "ar";
  const [dialogOpen, setDialogOpen] = useState(false);

  const features = isArabic ? plan?.featuresAr : plan?.featuresEn

  const subscribeToPlanMutation = useSubscribeToPlan()

  if (isLoading) {
    return (
      <>
        <PageTitle titleKey="Plans.pageTitle" fallback="Elite Status" />
        <PlanPageSkeleton />
      </>
    )
  }

  if (!plan) {
    return (
      <>
        <PageTitle titleKey="Plans.pageTitle" fallback="Elite Status" />
        <div className="min-h-[60dvh] bg-white flex items-center justify-center">
          <p className="text-gray-500 text-lg">{t("Plans.notFound") ?? "Plan not found."}</p>
        </div>
      </>
    )
  }

  const sanitized = DOMPurify.sanitize(plan.terms, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "u", "span", "ul", "ol", "li", "h1", "h2", "h3"],
    ALLOWED_ATTR: ["style", "class"],
  });

  const onConfirmSubscribe = async () => {
    setDialogOpen(false);
    try {
      const html = await subscribeToPlanMutation.mutateAsync(plan._id);

      const paymentWindow = window.open("",);

      if (!paymentWindow) {
        toast.error(t("General.popupBlocked"));
        return;
      }

      const blob = new Blob([html], { type: "text/html" });
      const blobUrl = URL.createObjectURL(blob);

      paymentWindow.location.href = blobUrl;

      let cleanedUp = false;

      const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        clearInterval(popupWatcher);
        URL.revokeObjectURL(blobUrl);
      };

      paymentWindow.addEventListener("load", cleanup);

      const popupWatcher = setInterval(() => {
        if (paymentWindow.closed) {
          cleanup();
          navigate("/account", { state: { page: "price-plan" } });
        }
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <PageTitle titleKey="Plans.pageTitle" fallback="Elite Status" />
      <div className="min-h-[60dvh] bg-white mx-10 mt-8.5 overflow-y-hidden flex flex-col gap-8.5">
        <div className="relative w-full h-76 overflow-hidden rounded-[12px]">
          <div className="absolute inset-0 bg-cover bg-center bg-blue-950"
            style={{ backgroundImage: `url('${bgImage}')` }}></div>
          <div className="absolute inset-0 bg-linear-to-r from-[#4A606B]/90 via-[#2E3C5E]/85 to-navy/82"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 gap-5">
            <h2 style={{ lineHeight: "105%", letterSpacing: "4%", fontSize: "48px" }} className="font-semibold text-white font-alex">
              {t("Plans.title")}
            </h2>
            <p style={{ lineHeight: "100%", fontSize: "16px", letterSpacing: "2%" }} className="text-white">
              {t("Plans.description")}
            </p>
          </div>
        </div>

        <div dir={isArabic ? "rtl" : "ltr"} className="w-full h-41 flex rounded-[10px] p-5 gap-6.25 shadow-lg justify-start items-center bg-[#f9f9f9]">
          <OptimizedImage src={planIcon} alt="Plan Icon" className='size-20' />
          <div className="flex flex-col items-start gap-2.5">
            <h3 style={{ letterSpacing: "4%", fontSize: "32px" }} className="font-semibold font-alex text-gray-800">
              {plan.titleEn}
            </h3>
            <p style={{ lineHeight: "100%", fontSize: "16px", letterSpacing: "2%" }} className={cn("font-normal mt-4", "text-navy")}>
              {plan.price} {t("General.kwd")} / {t("General.year")}
            </p>
          </div>
        </div>

        <div dir={isArabic ? "rtl" : "ltr"} className="w-full flex flex-col rounded-[10px] p-5 shadow-lg justify-start items-start bg-[#f9f9f9]">
          <p style={{ lineHeight: "100%", fontSize: "18px", letterSpacing: "2%" }} className={cn("font-normal mt-4", "text-navy")}>
            {t('Plans.planFeatures')}
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 w-full gap-3 flex-1 mt-3">
            {features?.map((feature, i) => (
              <li key={i} className="flex items-center justify-start gap-[5.5px]">
                <OptimizedImage src={greenCheckIcon} className="size-5" alt="green-checkmark" />
                <span style={{ lineHeight: "100%", fontSize: "12px", letterSpacing: "0%" }} className={cn("text-xs leading-relaxed")}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div dir={isArabic ? "rtl" : "ltr"} className="w-full flex flex-col rounded-[10px] p-5 shadow-lg justify-start items-start bg-[#f9f9f9]">
          <p style={{ lineHeight: "100%", fontSize: "18px", letterSpacing: "2%" }} className={cn("font-normal mt-4", "text-navy")}>
            {t('Plans.policy')}
          </p>
          <p style={{ lineHeight: "100%", fontSize: "16px", letterSpacing: "2%" }} className={cn("text-xs leading-relaxed mt-3")}>
            {sanitized}
          </p>
        </div>

        <div className="w-full mb-19">
          <button onClick={() => setDialogOpen(true)} type="button" className="w-full h-12 rounded-[8px] bg-navy hover:bg-navy/80 cursor-pointer transition-colors text-white font-medium">
            {t("Plans.subscribe")}
          </button>
        </div>
      </div>

      <SubscribeConfirmDialog
        open={dialogOpen}
        planName={isArabic ? plan.titleAr : plan.titleEn}
        onConfirm={onConfirmSubscribe}
        onCancel={() => setDialogOpen(false)}
      />
    </>
  )
}

export default PlanPage