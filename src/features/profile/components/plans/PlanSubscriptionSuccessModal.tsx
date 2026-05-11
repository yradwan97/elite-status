import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CheckCircle2 } from 'lucide-react';

interface PlanSubscriptionSuccessModalProps {
  open: boolean;
  onClose: () => void;
  planName?: string;
}

export function PlanSubscriptionSuccessModal({
  open,
  onClose,
  planName,
}: PlanSubscriptionSuccessModalProps) {
  const { t } = useTranslation();
  const circleRef = useRef<SVGCircleElement>(null);

  // Animate the check circle stroke on open
  useEffect(() => {
    if (open && circleRef.current) {
      circleRef.current.style.strokeDashoffset = '283';
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (circleRef.current) {
            circleRef.current.style.transition = 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)';
            circleRef.current.style.strokeDashoffset = '0';
          }
        }, 100);
      });
    }
  }, [open]);

  const handleGoHome = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">

        {/* Top accent band */}
        <div className="h-1.5 w-full bg-gradient-to-r from-turquoise to-navy" />

        <div className="px-8 pt-8 pb-10 flex flex-col items-center text-center gap-6">

          {/* Animated check */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-turquoise/10 scale-125 animate-pulse" />
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              <circle
                ref={circleRef}
                cx="50" cy="50" r="45"
                stroke="#2DC3C1"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset="283"
                fill="none"
              />
              <CheckCircle2
                className="absolute"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </svg>
            <CheckCircle2
              className="text-turquoise"
              style={{ position: 'absolute', width: 44, height: 44 }}
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-2">
            <h2
              className="text-navy font-alex font-semibold text-2xl leading-tight"
            >
              {t('Account.PricePlan.Success.title') ?? 'Subscription Confirmed!'}
            </h2>

            {planName && (
              <p className="text-turquoise font-semibold text-base">
                {planName}
              </p>
            )}

            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto mt-1">
              {t('Account.PricePlan.Success.subtitle') ??
                'You\'re all set. Your plan is now active and you can start enjoying all its benefits.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
            
            <button
              onClick={handleGoHome}
              className="font-alex flex-1 px-6 py-3 bg-navy text-white rounded-xl font-medium text-sm hover:opacity-90 cursor-pointer"
            >
              {t('General.close')}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}