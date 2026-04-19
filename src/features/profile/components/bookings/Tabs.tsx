// Inside BookingModal.tsx or separate files

export function InfoTab({ booking }: { booking: any }) {
  return (
    <div className="space-y-8">
      {/* Owner Info */}
      <div>
        <h3 className="font-semibold mb-3 text-lg">Owner Info</h3>
        <div className="flex items-center gap-4 bg-gray-50 p-5 rounded-2xl">
          <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0">
            {booking.owner.avatar}
          </div>
          <div>
            <p className="font-semibold text-lg">{booking.owner.name}</p>
            <p className="text-gray-600 mt-0.5">{booking.owner.phone}</p>
          </div>
        </div>
      </div>

      {/* Rent Period */}
      <div>
        <h3 className="font-semibold mb-3 text-lg">Rent Period</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-xs text-gray-500">Start Date</p>
            <p className="font-medium mt-1">{booking.rentPeriod.startDate}</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-xs text-gray-500">End Date</p>
            <p className="font-medium mt-1">{booking.rentPeriod.endDate}</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-xs text-gray-500">Check-in Time</p>
            <p className="font-medium mt-1">{booking.rentPeriod.checkin}</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-xs text-gray-500">Check-out Time</p>
            <p className="font-medium mt-1">{booking.rentPeriod.checkout}</p>
          </div>
        </div>
      </div>

      {/* Services Selected */}
      <div>
        <h3 className="font-semibold mb-3 text-lg">Services Selected</h3>
        <div className="space-y-3">
          {booking.services.map((service: any, i: number) => (
            <div key={i} className="flex justify-between items-center bg-gray-50 px-5 py-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-blue-600">↓</span>
                <span>{service.name}</span>
              </div>
              <span className="font-semibold">{service.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";

export function PaymentTab({ booking }: { booking: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4 text-lg">Rent Info</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-xs text-gray-500">Rent Type</p>
            <p className="font-medium mt-1.5">{booking.payment.rentType}</p>
          </div>
          <div className="bg-gray-50 p-5 rounded-2xl">
            <p className="text-xs text-gray-500">Amount</p>
            <p className="font-medium mt-1.5 text-lg">{booking.payment.amount}</p>
          </div>
        </div>

        <div className="mt-4 bg-gray-50 p-5 rounded-2xl">
          <p className="text-xs text-gray-500">Insurance</p>
          <p className="font-medium mt-1.5">{booking.payment.insurance}</p>
        </div>
      </div>

      <Button size="lg" className="w-full h-14 text-base font-semibold rounded-2xl">
        Download Invoice
      </Button>
    </div>
  );
}