import logo from "@/assets/elite-status-logo.png";
import cards from "@/assets/cards.svg";
import { SocialIcon } from 'react-social-icons';
import { useTranslation } from "react-i18next";
import { OptimizedImage } from "../shared/OptimizedImage";
import { useInfo } from "@/common/api/hooks/useInfo";
import { useState } from "react";
import { PolicyModal } from "../shared/PolicyModal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useIsMobile } from "@/hooks/use-mobile";
import i18next from "i18next";

type OpenModal = 'refundPolicy' | 'privacyPolicy' | 'termsAndConditions' | null;

export function Footer() {
  const { t } = useTranslation();
  const { info } = useInfo();
  const [openModal, setOpenModal] = useState<OpenModal>(null);
  const isMobile = useIsMobile();
  const isArabic  = i18next.language === 'ar';

  return (
    <>
      {isMobile ?
        <footer className="bg-[#0A1229] relative text-white rounded-3xl mx-6 my-3 py-4 overflow-hidden border border-white/5">
          <Accordion dir={isArabic ? "rtl" : "ltr" } type="single" collapsible >
            <AccordionItem value="policies">
              <AccordionTrigger dir={isArabic ? "rtl" : "ltr" } className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-alex font-medium text-white">
                {t("Footer.policies")}
              </AccordionTrigger>
              <AccordionContent style={{"--radix-accordion-content-height": "120px"}as React.CSSProperties} className="px-4 py-2 flex flex-col gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenModal('refundPolicy') }}
                  className="text-[#8E9DA4] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ letterSpacing: '3%', fontSize: "16px" }}
                >
                  {t("Auth.refundPolicy")}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setOpenModal('privacyPolicy') }}
                  className="text-[#8E9DA4] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ letterSpacing: '3%', fontSize: "16px" }}
                >
                  {t("Auth.privacyPolicy")}
                </button>

                <button
                  onClick={(e) => { e.stopPropagation(); setOpenModal('termsAndConditions') }}
                  className="text-[#8E9DA4] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                  style={{ letterSpacing: '3%', fontSize: "16px" }}
                >
                  {t("Auth.termsAndConditions")}
                </button>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support" style={{"--radix-accordion-content-height": "120px"}as React.CSSProperties}>
              <AccordionTrigger dir={isArabic ? "rtl" : "ltr" } className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-alex font-medium text-white">
                {t("Footer.Support")}
              </AccordionTrigger>
              <AccordionContent dir={isArabic ? "rtl" : "ltr" } style={{"--radix-accordion-content-height": "120px"}as React.CSSProperties} className="px-4 py-2 flex flex-col gap-3">
                {info?.socialMedia?.whatsapp && (<div
                  className="text-[#8E9DA4] hover:underline cursor-pointer flex flex-row gap-2"
                  style={{ letterSpacing: '3%', fontSize: "16px" }}
                >
                  <label>{t("Footer.whatsapp")}</label>
                  <span>{info?.socialMedia?.whatsapp}</span>
                </div>)}

                {info?.contact && (<div
                  className="text-[#8E9DA4] hover:underline cursor-pointer flex flex-row gap-2"
                  style={{ letterSpacing: '3%', fontSize: "16px" }}
                >
                  <label>{t("Footer.phone")}</label>
                  <span>{info?.contact}</span>
                </div>)}

                {info?.email && (<div
                  className="text-[#8E9DA4] hover:underline cursor-pointer flex flex-row gap-2"
                  style={{ letterSpacing: '3%', fontSize: "16px" }}
                >
                  <label>{t("Footer.email")}</label>
                  <span>{info?.email}</span>
                </div>)}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="followUs">
              <AccordionTrigger dir={isArabic ? "rtl" : "ltr" } className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-alex font-medium text-white">
                {t("Footer.followUs")}
              </AccordionTrigger>
              <AccordionContent className="px-4 py-2 flex justify-center mb-4">
                <div className="flex gap-6">
                  {info?.socialMedia?.whatsapp && (
                    <SocialIcon url={`https://wa.me/${info.socialMedia.whatsapp}`} target="_blank" style={{ height: 40, width: 40 }} network="whatsapp" bgColor="inherit" fgColor="#fff" />
                  )}
                  {/* {info?.socialMedia?.facebook && (
                  <SocialIcon url={info.socialMedia.facebook} target="_blank" style={{ height: 40, width: 40 }} network="facebook" bgColor="inherit" fgColor="#fff" />
                )} */}
                  {info?.socialMedia?.youtube && (
                    <SocialIcon url={info.socialMedia.youtube} target="_blank" style={{ height: 40, width: 40 }} network="youtube" bgColor="inherit" fgColor="#fff" />
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <OptimizedImage
            src={cards}
            alt="Elite Status"
            className="mx-auto mb-4 flex object-contain w-auto"
          />
          <div className="bg-black/40 border-t translate-y-2.5 border-white/10 h-11.25 py-4 text-center text-sm text-white/60">
          {t("Footer.copyright", { year: new Date().getFullYear() })}
        </div>

        </footer>
        :
        <footer className="bg-[#0A1229] text-white rounded-3xl mx-6 h-78.5 overflow-hidden border border-white/5">
          <div className="h-62.5 px-8 py-8">
            <section dir={isArabic ? "rtl" : "ltr"} className="h-full">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center text-center gap-12 md:gap-8">
  
                <div className="flex flex-col items-center gap-5">
                  <OptimizedImage
                    src={logo}
                    alt="Elite Status"
                    className="h-37 object-contain"
                  />
                </div>
  
                <div className="flex flex-col items-start mx-auto gap-5">
                  <p style={{ letterSpacing: '3%', fontSize: "24px" }} className="font-alex font-medium text-white capitalize">
                    {t("Footer.policies")}
                  </p>
  
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenModal('refundPolicy') }}
                    className="text-[#8E9DA4] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                    style={{ letterSpacing: '3%', fontSize: "16px" }}
                  >
                    {t("Auth.refundPolicy")}
                  </button>
  
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenModal('privacyPolicy') }}
                    className="text-[#8E9DA4] hover:underline cursor-pointer bg-transparent border-none p-0 font-inherit"
                    style={{ letterSpacing: '3%', fontSize: "16px" }}
                  >
                    {t("Auth.privacyPolicy")}
                  </button>
  
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpenModal('termsAndConditions') }}
                    className="text-[#8E9DA4] hover:underline text-start cursor-pointer bg-transparent border-none p-0 font-inherit"
                    style={{ letterSpacing: '3%', fontSize: "16px" }}
                  >
                    {t("Auth.termsAndConditions")}
                  </button>
  
                </div>
  
                <div className="flex flex-col items-start mx-auto gap-5">
                  <p style={{ letterSpacing: '3%', fontSize: "24px" }} className="font-alex font-medium text-white capitalize">
                    {t("Footer.Support")}
                  </p>
  
                  {info?.socialMedia?.whatsapp && (<div
                    className="text-[#8E9DA4]  flex flex-row gap-2"
                    style={{ letterSpacing: '3%', fontSize: "16px" }}
                  >
                    <label>{t("Footer.whatsapp")}</label>
                    <span>{info?.socialMedia?.whatsapp}</span>
                  </div>)}
  
                  {info?.contact && (<div
                    className="text-[#8E9DA4]  flex flex-row gap-2"
                    style={{ letterSpacing: '3%', fontSize: "16px" }}
                  >
                    <label>{t("Footer.phone")}</label>
                    <span>{info?.contact}</span>
                  </div>)}
  
                  {info?.email && (<div
                    className="text-[#8E9DA4] text-start text-wrap line-clamp-1 flex flex-row gap-2"
                    style={{ letterSpacing: '3%', fontSize: "16px" }}
                  >
                    <label>{t("Footer.email")}</label>
                    <span>{info?.email}</span>
                  </div>)}
  
                </div>
  
                <div className="flex flex-col items-start mx-auto gap-6">
                  <p style={{ letterSpacing: '3%', fontSize: "24px" }} className="font-alex font-medium text-white capitalize">
                    {t("Footer.followUs")}
                  </p>
                  <div className="flex gap-6">
                    {info?.socialMedia?.whatsapp && (
                      <SocialIcon url={`https://wa.me/${info.socialMedia.whatsapp}`} target="_blank" style={{ height: 40, width: 40 }} network="whatsapp" bgColor="inherit" fgColor="#fff" />
                    )}
                    {/* {info?.socialMedia?.facebook && (
                    <SocialIcon url={info.socialMedia.facebook} target="_blank" style={{ height: 40, width: 40 }} network="facebook" bgColor="inherit" fgColor="#fff" />
                  )} */}
                    {info?.socialMedia?.facebook && (
                      <SocialIcon url={info.socialMedia.facebook} target="_blank" style={{ height: 40, width: 40 }} network="youtube" bgColor="inherit" fgColor="#fff" />
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
                  <OptimizedImage
                    src={cards}
                    alt="Elite Status"
                    className="sm:h-5.75 sm:w-30 flex object-contain w-auto"
                  />
                </div>
  
              </div>
            </section>
          </div>

          {/* Bottom Bar */}
          <div className="bg-black/40 border-t border-white/10 py-5 text-center text-sm text-white/60">
            {t("Footer.copyright", { year: new Date().getFullYear() })}
          </div>
        </footer>}

      <PolicyModal
        open={openModal === 'refundPolicy'}
        onClose={() => setOpenModal(null)}
        policyKey="refundPolicy"
      />
      <PolicyModal
        open={openModal === 'privacyPolicy'}
        onClose={() => setOpenModal(null)}
        policyKey="privacyPolicy"
      />
      <PolicyModal
        open={openModal === 'termsAndConditions'}
        onClose={() => setOpenModal(null)}
        policyKey="termsAndConditions"
      />
    </>
  );
}