import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DOMPurify from 'dompurify';
import { useTranslation } from 'react-i18next';
import { usePolicies } from '@/common/api/hooks/usePolicies';

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsModal({ open, onClose }: TermsModalProps) {
  const { i18n, t } = useTranslation();
  const { policies } = usePolicies();

  const raw = policies?.termsAndConditions?.[i18n.language as 'en' | 'ar'] ?? '';
  const sanitized = DOMPurify.sanitize(raw);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] p-5 overflow-y-auto" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className="text-navy">
            {t('Auth.termsAndConditions') ?? 'Terms & Conditions'}
          </DialogTitle>
        </DialogHeader>
        <div
          className="prose prose-sm max-w-none text-gray-700 mt-4"
          dangerouslySetInnerHTML={{ __html: sanitized }}
        />
      </DialogContent>
    </Dialog>
  );
}