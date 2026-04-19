// src/features/account/pages/AccountPricePlan.tsx
import React from 'react';
import { Crown, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function AccountPricePlan() {
  const { t } = useTranslation();

  const trackingData = [
    { no: "#001", date: "6-1-2026", action: "Rent", title: "King Chalet in Khiran", discount: "120 KD", invoice: "#7366" },
    { no: "#002", date: "6-2-2026", action: "Rent", title: "Smart Villa", discount: "140 KD", invoice: "#3434" },
    { no: "#003", date: "3-4-2026", action: "Rent", title: "Sea View in Khiran", discount: "140 KD", invoice: "#7366" },
    { no: "#004", date: "9-4-2026", action: "Rent", title: "King Chalet", discount: "140 KD", invoice: "#2078" },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      <h1 className="text-2xl font-semibold mb-8">{t("Account.PricePlan.Title")}</h1>

      {/* Current Plan */}
      <div className="bg-white border rounded-3xl p-8 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xl font-semibold">{t("Account.PricePlan.GoldPlan")}</div>
              <div className="text-sm text-gray-500">Subscribed on 1-02-2025 • Expires on 1-02-2026</div>
            </div>
          </div>

          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium flex items-center gap-2">
            {t("Account.PricePlan.Upgrade")} <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tracking Table */}
      <div className="bg-white border rounded-3xl overflow-hidden">
        <div className="px-8 py-6 border-b">
          <h2 className="font-semibold text-lg">{t("Account.PricePlan.YourPlanTracking")}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-8 py-4 text-left font-medium">{t("Account.PricePlan.No")}</th>
                <th className="px-8 py-4 text-left font-medium">{t("Account.PricePlan.Date")}</th>
                <th className="px-8 py-4 text-left font-medium">{t("Account.PricePlan.Action")}</th>
                <th className="px-8 py-4 text-left font-medium">{t("Account.PricePlan.TitleColumn")}</th>
                <th className="px-8 py-4 text-left font-medium">{t("Account.PricePlan.Discount")}</th>
                <th className="px-8 py-4 text-left font-medium">{t("Account.PricePlan.InvoiceLink")}</th>
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
                    <a href="#" className="text-blue-600 hover:underline">{row.invoice}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}