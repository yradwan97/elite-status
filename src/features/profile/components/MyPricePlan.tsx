import { useTranslation } from 'react-i18next';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import planIcon from '@/assets/planIcon.png';
import i18next from 'i18next';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import UpgradePlanModal from './plans/UpgradePlanModal';
import { useDiscountedReservations } from '@/features/properties/reservation/api/hooks/useDiscountedReservations';
import Pagination from '@/components/shared/Pagination';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';

export default function AccountPricePlan() {
  const { t } = useTranslation();
  const isArabic = i18next.language === 'ar';
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const [page, setPage] = useState(1)
  const { reservations: trackingData, pages } = useDiscountedReservations(page)
  const user = useSelector(selectUser)

  return (
    <>
      <div className="max-w-5xl mx-auto text-navy start p-6 lg:p-8">
        <h1 className={`text-2xl ${isArabic ? 'text-right' : 'text-left'} font-semibold mb-8`}>
          {t("Account.PricePlan.Title")}
        </h1>

        {/* Current Plan */}
        <div className="bg-white border rounded-3xl p-8 mb-8">
          <div className={`flex w-full flex-col sm:justify-between  ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'} sm:items-center gap-6`}>
            {user?.plan ?
              <div className={`flex flex-col  items-center justify-between ${isArabic ? 'sm:flex-row-reverse' : 'sm:flex-row'} gap-4`}>
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white">
                  <OptimizedImage src={planIcon} alt="Plan Icon" />
                </div>
                <div>
                  <div className={`text-xl font-semibold text-navy text-center ${isArabic ? 'sm:text-end' : 'sm:text-start'}`}>{isArabic ? user?.plan?.titleAr : user?.plan?.titleEn}</div>
                  <div className={`flex flex-col text-md gap-3 ${isArabic ? 'sm:flex-row-reverse ' : 'sm:flex-row'} text-navy`}>
                    <span className="font-bold">{t("Account.PricePlan.SubscribedOn", { date: formatDate({ date: user.plan.subscriptionDate, locale: i18next.language }) })}</span>
                    <span className='hidden sm:block'>•</span>
                    <span className="font-bold">{t("Account.PricePlan.ExpiresOn", { date: formatDate({ date: user.plan.expirationDate, locale: i18next.language }) })}</span>
                  </div>
                </div>
              </div>
              :
              (<div className='font-alex font-medium text-xl'>{t("Dashboard.Pricing.notSubscribed")}</div>)}

            <button
              className="px-6 py-3 mx-auto sm:mx-0 bg-navy text-white cursor-pointer rounded-2xl font-medium flex items-center"
              onClick={() => setOpenUpgradeModal(true)}
            >
              {user?.plan ? t("Account.PricePlan.Upgrade") : t("Account.PricePlan.Subscribe")}
            </button>
          </div>
        </div>

        {/* Tracking Table */}
        <div className="bg-white border rounded-3xl overflow-hidden">
          <div className="px-8 py-6 border-b">
            <h2 className={`font-semibold ${isArabic ? 'text-right' : 'text-left'} text-lg`}>{t("Account.PricePlan.YourPlanTracking")}</h2>
          </div>

          <div className="hidden lg:block overflow-x-auto">
            {/* dir attribute ensures the table itself flips for RTL */}
            <table className="w-full" dir={isArabic ? 'rtl' : 'ltr'}>
              <thead>
                <tr className="bg-gray-50 border-b">
                  {/* text-start resolves to text-right in RTL, text-left in LTR */}
                  <th className="px-8 py-4 text-start font-medium">{t("Account.PricePlan.No")}</th>
                  <th className="px-8 py-4 text-start font-medium">{t("Account.PricePlan.Date")}</th>
                  <th className="px-8 py-4 text-start font-medium">{t("Account.PricePlan.Action")}</th>
                  <th className="px-8 py-4 text-start font-medium">{t("Account.PricePlan.TitleColumn")}</th>
                  <th className="px-8 py-4 text-start font-medium">{t("Account.PricePlan.Discount")}</th>
                  <th className="px-8 py-4 text-start font-medium">{t("Account.PricePlan.InvoiceLink")}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {trackingData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-8 py-5 font-medium">{`#${String(index + 1).padStart(3, "0")}`}</td>
                    <td className="px-8 py-5 text-gray-600">{formatDate({ date: row.createdAt, locale: i18next.language })}</td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {t("General.rent")}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium">
                      <a className='hover:underline' href={`/properties/${row.property._id}`} title={isArabic ? row.property.titleAr : row.property.titleEn}>
                        {isArabic ? row.property.titleAr : row.property.titleEn}
                      </a>
                    </td>
                    <td className="px-8 py-5 text-emerald-600 font-medium">{row.discount}</td>
                    <td className="px-8 py-5">
                      <a target='_blank' href={row.invoice} className="text-navy hover:underline">{row.trackId}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y">
            {trackingData.map((row, index) => (
              <div key={index} className="px-5 py-4 flex flex-col gap-2">
                <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs text-gray-400 font-medium">
                    {`#${String(index + 1).padStart(3, "0")}`}
                  </span>
                  <span className="px-3 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                    {t("General.rent")}
                  </span>
                </div>

                <a
                  href={`/properties/${row.property._id}`}
                  className={`font-semibold text-navy ${isArabic ? 'text-end' : ''} hover:underline text-sm`}
                >
                  {isArabic ? row.property.titleAr : row.property.titleEn}
                </a>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{formatDate({ date: row.createdAt, locale: i18next.language })}</span>
                  <div className={`flex gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <span className="text-navy font-medium">{t("Account.PricePlan.Discount")}</span>
                      <span className="text-navy font-medium">:</span>
                    </div>
                    <span className="text-emerald-600 font-medium">{row.discount}</span>
                  </div>
                </div>

                <a
                  target="_blank"
                  href={row.invoice}
                  className={`text-xs text-navy underline ${isArabic ? 'text-end' : ''} underline-offset-2`}
                >
                  {row.trackId}
                </a>
              </div>
            ))}
          </div>
        </div>
        <Pagination
          current={page}
          total={pages}
          onPageChange={setPage}
        />
      </div>
      {openUpgradeModal && (
        <UpgradePlanModal
          open={openUpgradeModal}
          onOpenChange={(open) => setOpenUpgradeModal(open)}
        />
      )}
    </>
  );
}