import { useEffect, useState } from 'react';
import { Menu, Phone, User, LogOut, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import logo from '@/assets/elite-status-white-logo.png';
import { SocialIcon } from 'react-social-icons';
import { useTranslation } from "react-i18next";
import { RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@/store/slices/language-slice';
import { clearCredentials, selectUser } from '@/store/slices/authSlice';
import AuthModal from '@/features/auth/AuthModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { OptimizedImage } from '../shared/OptimizedImage';
import { useInfo } from '@/common/api/hooks/useInfo';

export function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const user = useSelector(selectUser);
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const location = useLocation()

  const {info} = useInfo();

  useEffect(function adjustLanguage() {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  useEffect(() => {
    if (location.state?.openLoginModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthOpen(true)
      navigate("/", {
        replace: true,
        state: {}
      })
    }
  }, [location, navigate])

  const changeLanguage = (lang: 'en' | 'ar') => {
    dispatch(setLanguage(lang));
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    dispatch(clearCredentials());
    setPopoverOpen(false);
  };

  const handleProfile = () => {
    navigate('/account');
    setPopoverOpen(false);
  };

  const isArabic = i18n.language === 'ar';

  const goToHome = () => {
    navigate('/');
  }

  return (
    <>
      <header className={`sticky top-0 z-50 w-full bg-white border-b shadow-sm`}>
        <div className="max-w-7xl mx-auto">

          <div className={`flex h-16 items-center justify-between px-6 ${isArabic ? 'flex-row-reverse' : ''}`}>

            {/* Left Side */}
            <div className={`flex items-center gap-8 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>

                <SheetContent side={isArabic ? "right" : "left"} className="pt-8">
                  <div className="flex flex-col gap-8">
                    <OptimizedImage src={logo} alt="Elite Status" className="h-26 object-contain mx-auto" />

                    <nav className="flex flex-col gap-6 text-lg font-medium text-center">
                      <a href="/" className="text-navy font-semibold transition-colors">{t("Dashboard.home")}</a>
                      <a href="/properties" className="text-navy font-semibold transition-colors">{t("Dashboard.chalets")}</a>
                      <a href="/pricing" className="text-navy font-semibold transition-colors">{t("Dashboard.pricingPlan")}</a>
                      <a href="/owner-services" className="text-navy font-semibold transition-colors">{t("Dashboard.ownerServices")}</a>
                      <a href="/contact" className="text-navy font-semibold transition-colors">{t("Dashboard.contactUs")}</a>
                    </nav>

                    <div className="pt-8 border-t">
                      <p className="font-bold text-xl text-navy mb-4 text-center">{t("Dashboard.followUsOn")}</p>
                      <div className="flex gap-5 justify-center">
                        {info?.socialMedia?.whatsapp && (
                          <SocialIcon url={`https://wa.me/${info.socialMedia.whatsapp}`} target="_blank" style={{ height: 38, width: 38, border: '2px solid #000', borderRadius: '100%' }} network="whatsapp" bgColor="#fff" borderRadius='100%' fgColor="#2DC3C1" />
                        )}
                        {info?.socialMedia?.facebook && (
                          <SocialIcon url={info.socialMedia.facebook} target="_blank" style={{ height: 38, width: 38, border: '2px solid #000', borderRadius: '100%' }} network="facebook" bgColor="#fff" fgColor="#000" />
                        )}
                        {info?.socialMedia?.tiktok && (
                          <SocialIcon url={info.socialMedia.tiktok} target="_blank" style={{ height: 38, width: 38, border: '2px solid #000', borderRadius: '100%' }} network="tiktok" bgColor="#fff" fgColor="#2DC3C1" />
                        )}
                        {info?.socialMedia?.instagram && (
                          <SocialIcon url={info.socialMedia.instagram} target="_blank" style={{ height: 38, width: 38, border: '2px solid #000', borderRadius: '100%' }} network="instagram" bgColor="#fff" fgColor="#000" />
                        )}
                        {info?.socialMedia?.snapchat && (
                          <SocialIcon url={info.socialMedia.snapchat} target="_blank" style={{ height: 38, width: 38, border: '2px solid #000', borderRadius: '100%' }} network="snapchat" bgColor="#fff" fgColor="#2DC3C1" />
                        )}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Phone (Desktop) */}
              <a href="tel:+96522234567" className="hidden md:flex items-center gap-2 text-base font-medium text-gray-700">
                <Phone className="h-5 w-5" />
                +965-22234567
              </a>
            </div>

            {/* Center Logo */}
            <div className="flex justify-center cursor-pointer" onClick={goToHome}>
              <OptimizedImage src={logo} alt="Elite Status" className="h-12 md:h-14 object-contain" />
            </div>

            {/* Right Side */}
            <div className={`flex items-center gap-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center bg-gray-100 rounded-full p-1 text-sm font-medium">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-4 py-1.5 rounded-full transition-all ${currentLanguage === 'en' ? 'bg-white shadow text-navy font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  English
                </button>
                <button
                  onClick={() => changeLanguage('ar')}
                  className={`px-4 py-1.5 rounded-full transition-all ${currentLanguage === 'ar' ? 'bg-white shadow text-navy font-semibold' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  العربية
                </button>
              </div>

              <div className="h-6 w-0.5 rounded-md bg-turquoise hidden md:block" />

              {user ? (
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 text-base font-medium hover:cursor-pointer transition-colors">
                      {user.firstName} {user.lastName}
                      <User className="h-5 w-5" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-48 p-2 flex flex-col gap-1">
                    <button
                      onClick={handleProfile}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors w-full text-left"
                    >
                      <UserCircle className="h-4 w-4" />
                      {t("Header.profile") ?? "Profile"}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      {t("Header.logout") ?? "Logout"}
                    </button>
                  </PopoverContent>
                </Popover>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="flex items-center gap-2 text-base font-medium hover:text-navy cursor-pointer transition-colors"
                >
                  {t("Header.login")}
                  <User className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
}