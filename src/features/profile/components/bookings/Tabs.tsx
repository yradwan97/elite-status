import { useTranslation } from 'react-i18next';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { Reservation } from '@/features/properties/reservation/api/reservationApi';
import { CalendarDays, Clock, ShieldCheck, Banknote, FileText, Wrench } from 'lucide-react';

const NS = 'Account.Bookings';

/* ── Shared field box ──────────────────────────────────────── */
function FieldBox({
  icon,
  label,
  value,
  wide = false,
  isRTL = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  wide?: boolean;
  isRTL?: boolean;
}) {
  return (
    <div className={`border border-gray-200 rounded-2xl p-4 ${wide ? 'col-span-2' : ''}`}>
      <p className={`text-xs text-gray-400 flex items-center gap-1.5 mb-1.5 ${isRTL ? 'flex-row text-right' : 'flex-row-reverse text-left'}`}>
        {icon}
        <>{label}</>
      </p>
      <p className={`text-sm font-semibold text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
        {value}
      </p>
    </div>
  );
}

/* ── Info Tab ──────────────────────────────────────────────── */
export function InfoTab({ booking, isRTL }: { booking: Reservation; isRTL: boolean }) {
  const { t } = useTranslation();

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB').replace(/\//g, '\\');

  const ownerName  = `${booking.user.firstName} ${booking.user.lastName}`;
  const ownerPhone = booking.user.mobileNumber;
  const ownerImage = booking.user.image;

  return (
    <div className="space-y-8">
      <section>
        <h4 className={`text-sm font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(`${NS}.modal.ownerInfo`)}
        </h4>
        <div className={`border border-gray-200 rounded-2xl p-4 flex items-center gap-4 ${isRTL ? 'flex-row' : 'flex-row-reverse justify-start'}`}>
          {ownerImage ? (
            <OptimizedImage src={ownerImage} alt={ownerName} className="w-14 h-14 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#1a2550] text-white flex items-center justify-center text-xl font-bold shrink-0">
              {booking.user.firstName[0]}
            </div>
          )}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="font-semibold text-gray-900">{ownerName}</p>
            <p className="text-sm text-gray-500 mt-0.5">{ownerPhone}</p>
          </div>
        </div>
      </section>

      <section>
        <h4 className={`text-sm font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(`${NS}.modal.rentPeriod`)}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <FieldBox icon={<CalendarDays className="w-3.5 h-3.5" />} label={t(`${NS}.modal.startDate`)} value={fmt(booking.startDate)} isRTL={isRTL} />
          <FieldBox icon={<CalendarDays className="w-3.5 h-3.5" />} label={t(`${NS}.modal.endDate`)}   value={fmt(booking.endDate)}   isRTL={isRTL} />
          <FieldBox icon={<Clock className="w-3.5 h-3.5" />}        label={t(`${NS}.modal.checkin`)}   value="10:00 AM"               isRTL={isRTL} />
          <FieldBox icon={<Clock className="w-3.5 h-3.5" />}        label={t(`${NS}.modal.checkout`)}  value="2:00 PM"                isRTL={isRTL} />
        </div>
      </section>

      {booking.services.length > 0 && (
        <section>
          <h4 className={`text-sm font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t(`${NS}.modal.servicesSelected`)}
          </h4>
          <div className="space-y-2">
            {booking.services.map((svc) => (
              <div key={svc._id} className={`border border-gray-200 rounded-2xl px-4 py-3 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className={`flex items-center gap-2 text-sm text-gray-700 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Wrench className="w-4 h-4 text-[#1a2550]" />
                  {svc.name}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {svc.price} {t(`${NS}.currency`)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Payment Tab ───────────────────────────────────────────── */
export function PaymentTab({ booking, isRTL }: {
  booking: Reservation;
  isRTL: boolean;
}) {
  const { t } = useTranslation();

  const rentTypeLabel: Record<string, string> = {
    WHOLE_WEEK: t(`${NS}.rentType.wholeWeek`),
    WEEKDAYS:   t(`${NS}.rentType.weekdays`),
    WEEKENDS:   t(`${NS}.rentType.weekends`),
    DAILY:      t(`${NS}.rentType.daily`),
  };

  return (
    <div className="space-y-8">
      <section>
        <h4 className={`text-sm font-semibold text-gray-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t(`${NS}.modal.rentInfo`)}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <FieldBox icon={<Banknote className="w-3.5 h-3.5" />}    label={t(`${NS}.modal.rentType`)}  value={rentTypeLabel[booking.reservationType] ?? booking.reservationType} isRTL={isRTL} />
          <FieldBox icon={<Banknote className="w-3.5 h-3.5" />}    label={t(`${NS}.modal.amount`)}    value={`${booking.reservationPrice} ${t(`${NS}.currency`)}`}             isRTL={isRTL} />
          <FieldBox icon={<ShieldCheck className="w-3.5 h-3.5" />} label={t(`${NS}.modal.insurance`)} value={`${booking.insurance} ${t(`${NS}.currency`)}`} wide              isRTL={isRTL} />
        </div>
      </section>

      <a
        href={booking.invoice}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#1a2550] text-white rounded-2xl font-medium text-sm hover:bg-[#232f63] transition-colors"
      >
        <FileText className="w-4 h-4" />
        {t(`${NS}.modal.downloadInvoice`)}
      </a>
    </div>
  );
}