interface BookingCardProps {
  booking: any;
  onClick: () => void;
}

export default function BookingCard({ booking, onClick }: BookingCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-white border rounded-3xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
    >
      <img
        src={booking.image}
        alt={booking.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <h3 className="font-semibold text-lg">{booking.title}</h3>
        <p className="text-gray-500 text-sm mt-2">📍 {booking.location}</p>

        <div className={`mt-6 inline-block px-5 py-1.5 rounded-full text-sm font-medium ${booking.statusColor}`}>
          {booking.status}
        </div>
      </div>
    </div>
  );
}