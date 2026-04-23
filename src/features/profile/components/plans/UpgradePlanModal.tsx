import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { X } from "lucide-react";
import PlanCard, { Plan } from '@/features/dashboard/components/plan-card';
import silverPlanIcon from '@/assets/silver-plan-icon.png';
import goldPlanIcon from '@/assets/gold-plan-icon.png';
import platinumPlanIcon from '@/assets/platinum-plan-icon.png';
import diamondPlanIcon from '@/assets/diamond-plan-icon.png';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockPlans: Plan[] = [
  {
    key: "silver",
    name: "Silver Plan",
    price: 25,
    tagline: "Simple Stay, Smart Choice.",
    icon: silverPlanIcon,
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "--", included: false },
      { label: "--", included: false },
      { label: "--", included: false },
    ],
  },
  {
    key: "gold",
    name: "Gold Plan",
    price: 50,
    tagline: "More comfort, more style.",
    badge: { label: "Best ROI", className: "bg-amber-600 text-amber-50" },
    icon: goldPlanIcon,
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "--", included: false },
      { label: "--", included: false },
    ],
  },
  {
    key: "platinum",
    name: "Platinum Plan",
    price: 100,
    tagline: "Luxury without limits.",
    icon: platinumPlanIcon,
    badge: { label: "Most Popular", className: "bg-rose-600 text-rose-50" },
    featured: true,
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "--", included: false },
    ],
  },
  {
    key: "diamond",
    name: "Diamond Plan",
    price: 200,
    tagline: "Stay productive, stay ahead.",
    icon: diamondPlanIcon,
    badge: { label: "Enterprise", className: "bg-teal-600 text-teal-50" },
    features: [
      { label: "5% discount on any booking for 6 months from the date of subscription", included: true },
      { label: "Pay 50% of the insurance value for any booking within a 6-month period", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
      { label: "Enter a prize draw that takes place every 6 months", included: true },
    ],
  },
];

export default function UpgradePlanModal({ open, onOpenChange }: Props) {
  const { t } = useTranslation();
  const isArabic = i18next.language === "ar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
      showCloseButton={false}
        className="min-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl p-0 bg-gray-50"
      >
        {/* Close button */}
        <DialogClose asChild>
          <button
            className={`absolute top-5 ${
              isArabic ? "left-5" : "right-5"
            } z-10 h-9 w-9 rounded-full bg-white border cursor-pointer flex items-center justify-center hover:bg-gray-100 transition-colors`}
          >
            <X className="w-4 h-4 text-navy" />
          </button>
        </DialogClose>

        {/* Plans Section */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div
            className={`flex items-center justify-between mb-10 ${
              isArabic ? "flex-row-reverse" : ""
            }`}
          >
            <h2
              className={`text-3xl font-bold w-1/2 text-navy ${
                isArabic ? "text-right" : "text-left"
              }`}
            >
              {t("Dashboard.Pricing.title", "Choose Your Plan")}
            </h2>

            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {mockPlans.map((plan) => (
              <PlanCard key={plan.key} plan={plan} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}