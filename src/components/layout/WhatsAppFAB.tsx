import { useInfo } from "@/common/api/hooks/useInfo";
import { useIsMobile } from "@/hooks/use-mobile";
import i18next from "i18next";
import { SocialIcon } from "react-social-icons";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useTranslation } from "react-i18next";

export function WhatsAppFAB() {
  const { info } = useInfo();
  const isArabic = i18next.language === "ar";
  const isMobile = useIsMobile();
  const {t} = useTranslation()

  if (!info?.whatsappContact) return null;

  const icon = (
    <SocialIcon
      url={`https://wa.me/${info.whatsappContact}`}
      target="_blank"
      rel="noopener noreferrer"
      network="whatsapp"
      bgColor="transparent"
      fgColor="#25D366"
      style={{ height: 52, width: 52 }}
      className={`fixed! rounded-2xl bottom-6 z-50 shadow-xl! bg-white hover:scale-110 active:scale-95 transition-all duration-200 ${
        isArabic ? "left-6" : "right-6"
      }`}
    />
  );

  if (isMobile) return icon;

  return (
    <HoverCard openDelay={100} closeDelay={100}>
      <HoverCardTrigger asChild>
        {icon}
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        align={isArabic ? "start" : "end"}
        className="w-auto px-3 py-2 text-sm font-medium text-gray-700"
      >
        {t("General.chatWithUs")}
      </HoverCardContent>
    </HoverCard>
  );
}