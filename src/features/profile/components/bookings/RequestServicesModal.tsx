import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExtraService, useExtraServices } from '@/features/properties/reservation/api/hooks/useExtraServices';
import { cn } from '@/lib/utils';
import Pagination from '@/components/shared/Pagination';
import DOMPurify from 'dompurify';

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selected: ExtraService[]) => void;
  isRTL: boolean;
}

export default function RequestServiceModal({
  isOpen,
  onClose,
  onConfirm,
  isRTL,
}: RequestServiceModalProps) {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<ExtraService[]>([]);
  const { services, isLoading, pages } = useExtraServices(page);

  const toggle = (service: ExtraService) => {
    setSelected((prev) =>
      prev.some((s) => s._id === service._id)
        ? prev.filter((s) => s._id !== service._id)
        : [...prev, service]
    );
  };

  const handleConfirm = () => {
    onConfirm(selected);
    setSelected([]);
    setPage(1);
    onClose();
  };

  const handleClose = () => {
    setSelected([]);
    setPage(1);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md max-h-[90vh] overflow-hidden p-0 rounded-3xl"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-navy">
            {t('Account.Bookings.modal.requestService')}
          </DialogTitle>
          {selected.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              {selected.length} {t('Account.Bookings.modal.selected', 'selected')}
            </p>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-3 px-6 py-4 overflow-y-auto max-h-[55vh]">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full rounded-2xl bg-gray-100 animate-pulse h-20"
                />
              ))
            : services.map((service) => {
                const isSelected = selected.some((s) => s._id === service._id);
                const title = isRTL ? service.titleAr : service.titleEn;
                const description = isRTL ? service.descriptionAr : service.descriptionEn;
                const sanitized = DOMPurify.sanitize(description ?? '', {
                  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'ul', 'ol', 'li'],
                  ALLOWED_ATTR: ['style', 'class'],
                });

                return (
                  <button
                    key={service._id}
                    onClick={() => toggle(service)}
                    className={cn(
                      'w-full rounded-2xl text-start flex items-center justify-between px-5 py-4 border-2 transition-all',
                      isSelected
                        ? 'border-navy bg-navy/5'
                        : 'border-gray-100 bg-accent hover:bg-gray-100'
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-navy">{title}</p>
                      <p className="text-sm text-gray-400">
                        {service.price} {t('General.kwd')}
                      </p>
                      <p
                        className="text-xs text-gray-400 mt-0.5 line-clamp-1"
                        dangerouslySetInnerHTML={{ __html: sanitized }}
                      />
                    </div>

                    <div
                      className={cn(
                        'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ms-4 transition-colors',
                        isSelected ? 'bg-navy border-navy' : 'border-gray-300'
                      )}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
        </div>

        <div className="px-6 pb-2">
          <Pagination
            current={page}
            total={pages ?? 1}
            onPageChange={setPage}
          />
        </div>

        <div className="flex gap-3 px-6 pb-6 pt-2">
          <Button
            variant="ghost"
            className="flex-1 h-11 rounded-xl"
            onClick={handleClose}
          >
            {t('General.cancel', 'Cancel')}
          </Button>
          <Button
            className="flex-1 h-11 rounded-xl bg-navy hover:bg-[#243760] text-white font-semibold"
            disabled={selected.length === 0}
            onClick={handleConfirm}
          >
            {t('Account.Bookings.modal.confirmServices', 'Confirm')}
            {selected.length > 0 && ` (${selected.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}