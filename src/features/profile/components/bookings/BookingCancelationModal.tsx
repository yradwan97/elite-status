// CancelReservationModal.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

const NS = 'Account.Bookings';

type Step = 'reason' | 'confirm';

interface CancelReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isRTL: boolean;
}

export default function CancelReservationModal({
  isOpen,
  onClose,
  onSubmit,
  isRTL,
}: CancelReservationModalProps) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');
  const [step, setStep] = useState<Step>('reason');

  const handleClose = () => {
    setReason('');
    setStep('reason');
    onClose();
  };

  const handleNext = () => {
    if (!reason.trim()) return;
    setStep('confirm');
  };

  const handleBack = () => {
    setStep('reason');
  };

  const handleConfirm = () => {
    onSubmit(reason.trim());
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-sm p-0 rounded-3xl overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
        showCloseButton={false}
      >
        {step === 'reason' ? (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className={`text-base font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(`${NS}.cancel.title`)}
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-5 space-y-4">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={t(`${NS}.cancel.placeholder`)}
                rows={4}
                className={`w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
              />
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {t(`${NS}.cancel.dismiss`)}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!reason.trim()}
                  className="flex-1 py-3 rounded-2xl bg-[#1a2550] text-white text-sm font-medium hover:bg-[#232f63] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t(`${NS}.cancel.next`)}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className={`text-base font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t(`${NS}.cancel.confirmTitle`)}
              </DialogTitle>
            </DialogHeader>

            <div className="px-6 py-5 space-y-5">
              {/* Warning */}
              <div className={`flex items-start gap-3 bg-orange-50 border border-red-100 rounded-2xl px-4 py-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <p className={`text-sm text-orange-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t(`${NS}.cancel.confirmWarning`)}
                </p>
              </div>

              {/* Reason preview */}
              <div className={`text-sm text-gray-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-xs text-gray-400 mb-1">{t(`${NS}.cancel.reasonLabel`)}</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                  {reason}
                </p>
              </div>

              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {t(`${NS}.cancel.back`)}
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  {t(`${NS}.cancel.confirm`)}
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}