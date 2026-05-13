import { useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { PolicyModal } from '@/components/shared/PolicyModal';


interface TermsCheckboxProps {
  acceptedTerms: boolean;
  onTermsChange: (value: boolean) => void;
}

type OpenModal = 'refundPolicy' | 'privacyPolicy' | 'termsAndConditions' | null;

export function TermsCheckbox({ acceptedTerms, onTermsChange }: TermsCheckboxProps) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<OpenModal>(null);

  return (
    <>
      <div className="flex items-start gap-3 mt-8 cursor-pointer">
        <div
          onClick={() => onTermsChange(!acceptedTerms)}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
            acceptedTerms ? "bg-navy border-navy" : "border-gray-300"
          )}
        >
          {acceptedTerms && <Check className="w-3 h-3 text-white" />}
        </div>

        <span className="text-sm font-alex text-gray-500 leading-relaxed">
          {t("Properties.Reservation.calendar.accept")}{" "}
          <button
            onClick={(e) => {e.stopPropagation(); setOpenModal('refundPolicy')}}
            className="text-[#657FF5] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-sm"
          >
            {t("Auth.refundPolicy")}
          </button>
          ,{" "}
          <button
            onClick={(e) => {e.stopPropagation(); setOpenModal('privacyPolicy')}}
            className="text-[#657FF5] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-sm"
          >
            {t("Auth.privacyPolicy")}
          </button>{" "}
          {t("Properties.Reservation.calendar.and")}{" "}
          <button
            onClick={(e) => {e.stopPropagation(); setOpenModal('termsAndConditions')}}
            className="text-[#657FF5] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit text-sm"
          >
            {t("Auth.termsAndConditions")}
          </button>
        </span>
      </div>

      <PolicyModal
        open={openModal === 'refundPolicy'}
        onClose={() => setOpenModal(null)}
        policyKey="refundPolicy"
      />
      <PolicyModal
        open={openModal === 'privacyPolicy'}
        onClose={() => setOpenModal(null)}
        policyKey="privacyPolicy"
      />
      <PolicyModal
        open={openModal === 'termsAndConditions'}
        onClose={() => setOpenModal(null)}
        policyKey="termsAndConditions"
      />
    </>
  );
}