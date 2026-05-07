import { useTranslation } from "react-i18next";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white gap-4">
      <WifiOff className="w-16 h-16 text-gray-300" />
      <h2 className="text-xl font-bold text-navy">
        {t("Offline.title", "You're offline")}
      </h2>
      <p className="text-sm text-gray-400 text-center max-w-xs">
        {t("Offline.description", "Check your internet connection and try again.")}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-2.5 rounded-full bg-navy text-white text-sm font-medium hover:bg-[#243760] active:scale-95 transition-all"
      >
        {t("Offline.retry", "Retry")}
      </button>
    </div>
  );
}