// AccountBooking.tsx

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BookingCard from './bookings/BookingCard';
import BookingModal from './bookings/BookingModal';
import { Reservation, ReservationStatus } from '@/features/properties/reservation/api/reservationApi';
import { useReservations } from '@/features/properties/reservation/api/hooks/useReservations';
import i18next from 'i18next';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import noReservations from "@/assets/no-favourites.png"
import Pagination from '@/components/shared/Pagination';

const STATUS_TABS: {
  labelKey: string;           // i18n key suffix
  value: ReservationStatus;
  statusKey: string;          // key for empty-state status label
}[] = [
  { labelKey: 'tabs.active',    value: 'ACTIVE',    statusKey: 'status.active'    },
  { labelKey: 'tabs.completed', value: 'COMPLETED', statusKey: 'status.completed' },
  { labelKey: 'tabs.canceled',  value: 'CANCELED',  statusKey: 'status.canceled'  },
];

export default function AccountBooking() {
  const { t } = useTranslation();
  const isRTL = i18next.language === "ar";

  const [statusFilter, setStatusFilter]       = useState<ReservationStatus>('ACTIVE');
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [activeTab, setActiveTab]             = useState<'info' | 'payment'>('info');
  const [page, setPage] = useState<number>(1)

  const { reservations, isLoading, error, refetch, pages } = useReservations(statusFilter, page);

  const activeTabMeta = STATUS_TABS.find((t) => t.value === statusFilter)!;

  const openModal = (booking: Reservation) => {
    setSelectedBooking(booking);
    setActiveTab('info');
  };

  const closeModal = () => setSelectedBooking(null);

  return (
    <div
      className="max-w-5xl mx-auto p-6 lg:p-8"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <h1 className="text-2xl font-semibold mb-6">
        {t(`Account.Bookings.title`)}
      </h1>

      {/* ── Status filter tabs ───────────────────────────────────── */}
      <div className="flex gap-0 mb-8 border-b border-gray-200">
        {STATUS_TABS.map((tab) => {
          const isActive = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={[
                'px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy',
                isActive
                  ? 'border-navy text-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {t(`Account.Bookings.${tab.labelKey}`)}
            </button>
          );
        })}
      </div>

      {/* ── Loading skeletons ────────────────────────────────────── */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-100 animate-pulse h-64"
            />
          ))}
        </div>
      )}

      {/* ── Error state ──────────────────────────────────────────── */}
      {!isLoading && error && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-navy text-white rounded-lg text-sm"
          >
            {t(`Account.Bookings.retry`)}
          </button>
        </div>
      )}

      {/* ── Empty state ──────────────────────────────────────────── */}
      {!isLoading && !error && reservations.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-gray-400">
          <OptimizedImage className='mx-auto my-6 w-44 h-44 opacity-70 object-contain' src={noReservations} alt="No Reservations" />
          <p className="text-lg font-medium">
            {t(`Account.Bookings.empty.title`)}
          </p>
          <p className="text-sm">
            {t(`Account.Bookings.empty.subtitle`, {
              status: t(`Account.Bookings.${activeTabMeta.statusKey}`),
            })}
          </p>
        </div>
      )}

      {/* ── Reservations grid ────────────────────────────────────── */}
      {!isLoading && !error && reservations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              isRTL={isRTL}
              onClick={() => openModal(booking)}
            />
          ))}
        </div>
      )}

      {/* ── Detail modal ─────────────────────────────────────────── */}
      <BookingModal
        isOpen={!!selectedBooking}
        onClose={closeModal}
        booking={selectedBooking}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRTL={isRTL}
      />


      <Pagination
        onPageChange={setPage}
        current={page}
        total={pages}
      />
    </div>
  );
}