import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreVertical } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CancelReservationPayload, RequestExtraServicesPayload, Reservation } from '@/features/properties/reservation/api/reservationApi';
import { InfoTab, PaymentTab } from './Tabs';
import reservationCancelIcon from "@/assets/reservation-cancel.png"
import requestServiceIcon from "@/assets/request-service-reservation.png"
import CancelReservationModal from './BookingCancelationModal';
import useCancelReservationMutation from '@/features/properties/reservation/api/hooks/useCancelReservationMutation';
import { toast } from 'sonner';
import { ExtraService } from '@/features/properties/reservation/api/hooks/useExtraServices';
import RequestServiceModal from './RequestServicesModal';
import useRequestExtraServicesMutation from '@/features/properties/reservation/api/hooks/useRequestExtraServicesMutation';

const NS = 'Account.Bookings';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'text-green-600',
  COMPLETED: 'text-gray-400',
  CANCELED: 'text-red-500',
};

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Reservation | null;
  activeTab: 'info' | 'payment';
  setActiveTab: (tab: 'info' | 'payment') => void;
  isRTL: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  booking,
  activeTab,
  setActiveTab,
  isRTL,
}: BookingModalProps) {
  const { t } = useTranslation();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false)

  const cancelReservationMutation = useCancelReservationMutation()
  const requestServicesMutation = useRequestExtraServicesMutation()

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!booking) return null;

  const title = isRTL ? booking.property.titleAr : booking.property.titleEn;
  const status = t(`${NS}.statusLabel.${booking.status}`);

  const handleCancel = () => {
    setMenuOpen(false);
    setCancelModalOpen(true);
  };
  const handleCancelSubmit = (reason: string) => {
    console.log('Cancel reason:', reason);
    if (!reason || reason.trim().length === 0) {
      toast.warning("Account.Bookings.cancel.reasonNotEmpty")
      return
    }
    const payload: CancelReservationPayload = {
      reservation: booking._id,
      reason
    }

    cancelReservationMutation.mutate(payload, {
      onSuccess: () => {
        setCancelModalOpen(false)
      }
    })

  };
  const handleRequestService = () => {
    setMenuOpen(false);
    setServiceModalOpen(true);
  };

  // 4. add handler
  const handleServicesConfirmed = async (services: ExtraService[]) => {
    console.log('Selected extra services:', services);
    const payload: RequestExtraServicesPayload = {
      reservation: booking._id,
      services: services.map(s => s._id)
    }

    await requestServicesMutation.mutateAsync(payload, {
      onSuccess: () => {
        onClose()
      }
    })
  };

  const triggers = [
    <TabsTrigger
      key="info"
      value="info"
      className="rounded-lg data-[state=active]:bg-navy data-[state=active]:text-white font-medium transition-colors"
    >
      {t(`${NS}.modal.info`)}
    </TabsTrigger>,
    <TabsTrigger
      key="payment"
      value="payment"
      className="rounded-lg data-[state=active]:bg-navy data-[state=active]:text-white font-medium transition-colors"
    >
      {t(`${NS}.modal.payment`)}
    </TabsTrigger>,
  ];



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[95vh] overflow-hidden p-0 rounded-3xl"
        dir={isRTL ? 'rtl' : 'ltr'}
        showCloseButton={false}
      >
        {/* ── Header ───────────────────────────────────────────── */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-start justify-between gap-2">
            <div>
              <DialogTitle className="text-lg font-semibold text-gray-900 leading-snug">
                {title}
              </DialogTitle>
              <p className={`mt-1 text-sm font-semibold ${STATUS_STYLES[booking.status]}`}>
                {status}
              </p>
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label={t(`${NS}.modal.menu`)}
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>

              {menuOpen && (
                <div
                  className={`absolute top-8 ${isRTL ? 'left-0' : 'right-0'} z-50 bg-white border border-gray-100 rounded-2xl shadow-lg py-1 min-w-50`}
                >
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {/* cancel icon */}
                    <img src={reservationCancelIcon} />
                    {t(`${NS}.modal.cancelReservation`)}
                  </button>
                  <button
                    onClick={handleRequestService}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {/* service icon */}
                    <img src={requestServiceIcon} />
                    {t(`${NS}.modal.requestService`)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* ── Tabs ─────────────────────────────────────────────── */}
        <div className="px-6 overflow-auto max-h-[calc(95vh-120px)]">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'info' | 'payment')}
          >
            <TabsList className="w-full grid grid-cols-2 border bg-white rounded-lg mt-2 p-2 h-15!">
              {isRTL ? triggers.reverse() : triggers}
            </TabsList>

            <TabsContent value="info" className="mt-6 pb-6 space-y-8">
              <InfoTab booking={booking} isRTL={isRTL} />
            </TabsContent>

            <TabsContent value="payment" className="mt-6 pb-6">
              <PaymentTab booking={booking} isRTL={isRTL} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      <CancelReservationModal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        onSubmit={handleCancelSubmit}
        isRTL={isRTL}
      />
      <RequestServiceModal
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        onConfirm={(selected) => handleServicesConfirmed(selected)}
        isRTL={isRTL}
      />
    </Dialog>
  );
}