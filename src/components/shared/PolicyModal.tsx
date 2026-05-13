import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { usePolicies } from '@/common/api/hooks/usePolicies';
import type { PoliciesData } from '@/common/api/commonApi';

type PolicyKey = keyof Pick<PoliciesData, 'termsAndConditions' | 'privacyPolicy' | 'refundPolicy'>;

interface PolicyModalProps {
  open: boolean;
  onClose: () => void;
  policyKey: PolicyKey;
}

export function PolicyModal({ open, onClose, policyKey }: PolicyModalProps) {
  const { i18n, t } = useTranslation();
  const { policies } = usePolicies();

  const raw = policies?.[policyKey]?.[i18n.language as 'en' | 'ar'] ?? '';
  const sanitized = DOMPurify.sanitize(raw);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="
          fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[calc(100vw-32px)] sm:max-w-2xl
          max-h-[85dvh] overflow-y-auto
          p-5
        "
        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      >
        <DialogHeader>
          <DialogTitle className="text-navy">{t(`Auth.${policyKey}`)}</DialogTitle>
        </DialogHeader>
        <div
          className="prose prose-sm max-w-none text-gray-700 mt-4"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </DialogContent>
    </Dialog>
  );
}