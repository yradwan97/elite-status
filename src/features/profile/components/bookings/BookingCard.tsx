import { useTranslation } from 'react-i18next';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { Reservation } from '@/features/properties/reservation/api/reservationApi';

const STATUS_STYLES: Record<string, string> = {
  ACTIVE:    'text-green-600',
  COMPLETED: 'text-gray-400',
  CANCELED:  'text-red-500',
};

interface BookingCardProps {
  booking:  Reservation;
  isRTL:    boolean;
  onClick:  () => void;
}

export default function BookingCard({ booking, isRTL, onClick }: BookingCardProps) {
  const { t } = useTranslation();

  const title   = isRTL ? booking.property.titleAr : booking.property.titleEn;
  const image   = booking.property.images[0] ?? '';
  const address = booking.property.address;
  const status  = t(`Account.Bookings.statusLabel.${booking.status}`);

  return (
    <div
      onClick={onClick}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <OptimizedImage
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="font-semibold text-base text-gray-900 leading-snug">{title}</h3>
        <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
          <span>📍</span>
          {address}
        </p>
        <p className={`mt-4 text-sm font-semibold ${STATUS_STYLES[booking.status]}`}>
          {status}
        </p>
      </div>
    </div>
  );
}