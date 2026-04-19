import { Mail, Phone } from "lucide-react";
import logo from "@/assets/elite-status-logo.png";
import { SocialIcon } from 'react-social-icons';
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "../shared/OptimizedImage";
import { useInfo } from "@/common/api/hooks/useInfo";

export function Footer() {
  const { t } = useTranslation();
  const { info } = useInfo();
  console.log(info)

  return (
    <footer className="bg-[#0A1229] text-white rounded-3xl mx-6 my-10 overflow-hidden border border-white/5">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center text-center gap-12 md:gap-8">

          {/* Left - Email */}
          <div className="flex flex-col items-center gap-5">
            {info?.email && (
              <>
                <div className="border border-white/30 rounded-full p-5">
                  <Mail size={26} strokeWidth={1.8} />
                </div>

                <p className="text-lg tracking-wide text-white/90">
                  {info?.email || ''}
                </p>
              </>
            )}
          </div>

          {/* Center - Logo + Social */}
          <div className="flex flex-col items-center gap-6">
            <OptimizedImage
              src={logo}
              alt="Elite Status"
              className="h-28 object-contain"
            />

            <div className="w-64 h-px bg-white/20 my-2" />

            <p className="text-sm tracking-widest text-white/70 uppercase">
              {t("Footer.socialMediaLinks")}
            </p>

            <div className="flex gap-6">
              {info?.socialMedia?.whatsapp && (
                <SocialIcon url={`https://wa.me/${info.socialMedia.whatsapp}`} target="_blank" style={{ height: 40, width: 40 }} network="whatsapp" bgColor="inherit" fgColor="#fff" />
              )}
              {info?.socialMedia?.facebook && (
                <SocialIcon url={info.socialMedia.facebook} target="_blank" style={{ height: 40, width: 40 }} network="facebook" bgColor="inherit" fgColor="#fff" />
              )}
              {info?.socialMedia?.tiktok && (
                <SocialIcon url={info.socialMedia.tiktok} target="_blank" style={{ height: 40, width: 40 }} network="tiktok" bgColor="inherit" fgColor="#fff" />
              )}
              {info?.socialMedia?.instagram && (
                <SocialIcon url={info.socialMedia.instagram} target="_blank" style={{ height: 40, width: 40 }} network="instagram" bgColor="inherit" fgColor="#fff" />
              )}
              {info?.socialMedia?.snapchat && (
                <SocialIcon url={info.socialMedia.snapchat} target="_blank" style={{ height: 40, width: 40 }} network="snapchat" bgColor="inherit" fgColor="#fff" />
              )}
            </div>
          </div>

          {/* Right - Phone */}
          <div className="flex flex-col items-center gap-5">
            <div className="border border-white/30 rounded-full p-5">
              <Phone size={26} strokeWidth={1.8} />
            </div>
            <p className="text-lg tracking-wide text-white/90">
              +965-22234567
            </p>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black/40 border-t border-white/10 py-5 text-center text-sm text-white/60">
        {t("Footer.copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}