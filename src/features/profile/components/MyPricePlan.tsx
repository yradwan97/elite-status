import { useTranslation } from 'react-i18next';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import planIcon from '@/assets/planIcon.png';
import i18next from 'i18next';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import UpgradePlanModal from './plans/UpgradePlanModal';

export default function AccountPricePlan() {
  const { t } = useTranslation();
  const isArabic = i18next.language === 'ar';
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const trackingData = [
    { no: "#001", date: "6-1-2026", action: "Rent", title: "King Chalet in Khiran", discount: "120 KD", invoice: "#7366" },
    { no: "#002", date: "6-2-2026", action: "Rent", title: "Smart Villa", discount: "140 KD", invoice: "#3434" },
    { no: "#003", date: "3-4-2026", action: "Rent", title: "Sea View in Khiran", discount: "140 KD", invoice: "#7366" },
    { no: "#004", date: "9-4-2026", action: "Rent", title: "King Chalet", discount: "140 KD", invoice: "#2078" },
  ];

  return (
    <>
      <div className="max-w-5xl mx-auto text-navy start p-6 lg:p-8">
        <h1 className={`text-2xl ${isArabic ? 'text-right' : 'text-left'} font-semibold mb-8`}>
          {t("Account.PricePlan.Title")}
        </h1>
  
        {/* Current Plan */}
        <div className="bg-white border rounded-3xl p-8 mb-8">
          <div className={`flex flex-col md:flex-row ${isArabic ? 'md:flex-row-reverse' : ''} justify-between items-start md:items-center gap-6`}>
            <div className={`flex items-center ${isArabic ? 'flex-row-reverse text-right' : ''} gap-4`}>
              <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white">
                <OptimizedImage src={planIcon} alt="Plan Icon" />
              </div>
              <div>
                <div className="text-xl font-semibold text-navy">{t("Account.PricePlan.GoldPlan")}</div>
                <div className={`text-md gap-3 ${isArabic ? 'flex-row-reverse' : ''} flex text-navy`}>
                  <span className="font-bold">{t("Account.PricePlan.SubscribedOn", {date: formatDate({ date: "2025-02-01", locale: i18next.language })})}</span> 
                  <>•</> 
                  <span className="font-bold">{t("Account.PricePlan.ExpiresOn", {date: formatDate({ date: "2026-02-01", locale: i18next.language })})}</span>
                  </div>
              </div>
            </div>
  
            <button 
              className="px-6 py-3 bg-navy text-white cursor-pointer rounded-2xl font-medium flex items-center gap-2"
              onClick={() => setOpenUpgradeModal(true)}
            >
              {t("Account.PricePlan.Upgrade")}
            </button>
          </div>
        </div>
  
        {/* Tracking Table */}
        <div className="bg-white border rounded-3xl overflow-hidden">
          <div className="px-8 py-6 border-b">
            <h2 className={`font-semibold ${isArabic ? 'text-right' : 'text-left'} text-lg`}>{t("Account.PricePlan.YourPlanTracking")}</h2>
          </div>
  
          <div className="overflow-x-auto">
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
                    <td className="px-8 py-5 font-medium">{row.no}</td>
                    <td className="px-8 py-5 text-gray-600">{row.date}</td>
                    <td className="px-8 py-5">
                      <span className="px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                        {row.action}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-medium">{row.title}</td>
                    <td className="px-8 py-5 text-emerald-600 font-medium">{row.discount}</td>
                    <td className="px-8 py-5">
                      <a href="#" className="text-navy hover:underline">{row.invoice}</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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