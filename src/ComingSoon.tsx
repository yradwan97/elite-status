import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { Clock } from "lucide-react";

export default function ComingSoon() {
    const { t } = useTranslation();
    const isRTL = i18next.language === "ar";

    return (
        <div
            dir={isRTL ? "rtl" : "ltr"}
            className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white px-6 text-center"
        >
            <div className="flex size-20 items-center justify-center rounded-full bg-navy/5">
                <Clock className="size-10 text-navy" />
            </div>
            <h1 className="text-3xl font-bold text-navy">
                {t("General.comingSoon.title", "Coming Soon")}
            </h1>
            <p className="max-w-md text-gray-500">
                {t(
                    "General.comingSoon.message",
                    "We're working on something great. Please check back shortly."
                )}
            </p>
        </div>
    );
}