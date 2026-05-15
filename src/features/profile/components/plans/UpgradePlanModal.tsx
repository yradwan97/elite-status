import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { X } from "lucide-react";
import PlanCard, { PlanCardSkeleton } from '@/features/dashboard/components/plan-card';
import { Plan, usePlans } from "../../api/hooks/usePlans";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/authSlice";
import noFavourites from '@/assets/no-favourites.png';
import { OptimizedImage } from "@/components/shared/OptimizedImage";
import { isPlanActive } from "@/lib/utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradePlanModal({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const isArabic = i18next.language === "ar";
  const { plans, isLoading } = usePlans()
  const user = useSelector(selectUser)
  const hasActivePlan = isPlanActive(user?.plan)
  const planIdx = hasActivePlan ? plans.indexOf(plans.find((p) => p._id === user?.plan?._id) as Plan) : 0
  const remainingPlans = hasActivePlan ? plans.slice(planIdx < plans.length ? planIdx + 1 : plans.length) : [...plans]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="md:min-w-xl lg:max-w-5xl min-w-sm max-h-[90vh] overflow-y-auto rounded-3xl p-0 bg-gray-50"
      >
        {/* Close button */}
        <DialogClose asChild>
          <button
            className={`absolute top-5 ${isArabic ? "left-5" : "right-5"
              } z-10 h-9 w-9 rounded-full bg-white border cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors`}
          >
            <X className="w-4 h-4 text-navy" />
          </button>
        </DialogClose>

        {/* Plans Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div
            className={`flex items-center justify-between mb-10 ${isArabic ? "flex-row-reverse" : ""}`}
          >
            <h2
              className={`text-3xl font-bold w-1/2 text-navy ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("Dashboard.Pricing.title", "Choose Your Plan")}
            </h2>


          </div>
          <section className="flex-1 min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => <PlanCardSkeleton key={i} />)
              ) :
                remainingPlans.length > 0 ? remainingPlans.map((plan) => (
                  <PlanCard isUpgrade key={plan._id} plan={plan} />
                )) : <div className="col-span-3 text-center py-20 text-gray-400">
                  <OptimizedImage src={noFavourites} alt="No favourites" className="mx-auto my-6 w-44 h-44 opacity-70 object-contain" />
                  <p className="text-lg font-medium">{t('Dashboard.Pricing.noPlans')}</p>
                </div>}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}