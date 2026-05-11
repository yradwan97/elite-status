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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradePlanModal({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const isArabic = i18next.language === "ar";
  const { plans, isLoading } = usePlans()
  const user = useSelector(selectUser)
  const planIdx = plans.indexOf(plans.find((p) => p.titleEn === user?.plan?.titleEn) as Plan)
  const remainingPlans = user?.plan ? plans.slice(planIdx < plans.length ? planIdx + 1 : plans.length ) : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="md:min-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 bg-gray-50"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {isLoading ? (
              Array.from({length: 4}).map((_,i) => <PlanCardSkeleton key={i} />)
            ) : 
            remainingPlans.map((plan) => (
              <PlanCard isUpgrade key={plan._id} plan={plan} />
            ))}
          </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}