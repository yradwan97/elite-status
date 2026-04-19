import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BookingCard from './bookings/BookingCard';           // We'll create this
import BookingModal from './bookings/BookingModal';         // We'll create this

export default function AccountBooking() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'payment'>('info');

  const bookings = [
    {
      id: 1,
      title: "Chalet In Khiran - Sea View",
      location: "Raw 3, Khiran, Kuwait",
      image: "https://picsum.photos/id/1015/600/340",
      status: "Active",
      statusColor: "text-green-600 bg-green-100",
      owner: {
        name: "Abdallah Ahmed",
        phone: "+965-22234567",
        avatar: "A",
      },
      rentPeriod: {
        startDate: "12/4/2026",
        endDate: "16/4/2026",
        checkin: "10:00 AM",
        checkout: "2:00 PM",
      },
      services: [
        { name: "Service Name", amount: "15 kwd" },
        { name: "Service Name", amount: "15 kwd" },
        { name: "Service Name", amount: "15 kwd" },
      ],
      payment: {
        rentType: "Weekdays",
        amount: "400 KWD",
        insurance: "200 KWD",
      },
    },
    // Add more bookings as needed
    {
      id: 2,
      title: "Chalet In Khiran - Sea View",
      location: "Raw 3, Khiran, Kuwait",
      image: "https://picsum.photos/id/1016/600/340",
      status: "Ended",
      statusColor: "text-red-600 bg-red-100",
      owner: {
        name: "Abdallah Ahmed",
        phone: "+965-22234567",
        avatar: "A",
      },
      rentPeriod: {
        startDate: "12/4/2026",
        endDate: "16/4/2026",
        checkin: "10:00 AM",
        checkout: "2:00 PM",
      },
      services: [
        { name: "Service Name", amount: "15 kwd" },
        { name: "Service Name", amount: "15 kwd" },
        { name: "Service Name", amount: "15 kwd" },
      ],
      payment: {
        rentType: "Weekdays",
        amount: "400 KWD",
        insurance: "200 KWD",
      },
    },
  ];

  const openModal = (booking: any) => {
    setSelectedBooking(booking);
    setActiveTab('info'); // reset to info tab
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-2xl font-semibold mb-8">{t('My Booking')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onClick={() => openModal(booking)}
          />
        ))}
      </div>

      {/* Booking Detail Modal */}
      <BookingModal
        isOpen={!!selectedBooking}
        onClose={closeModal}
        booking={selectedBooking}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRTL={isRTL}
      />
    </div>
  );
}