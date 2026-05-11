import { useEffect, useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import Sidebar from './components/Sidebar';
import AccountProfile from './components/MyProfile';
import AccountBooking from './components/MyBookings';
import AccountPricePlan from './components/MyPricePlan';
import AccountFavourites from './components/MyFavorites';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PageTitle } from '@/components/shared/PageTitle';
import { PlanSubscriptionSuccessModal } from './components/plans/PlanSubscriptionSuccessModal';
import { scrollToTop } from '@/lib/utils';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'booking' | 'price-plan' | 'favourite'>('profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const location = useLocation()
  const navigate = useNavigate();
  const passedPage = location.state?.page as 'profile' | 'booking' | 'price-plan' | 'favourite' | undefined

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get('page') as 'profile' | 'booking' | 'price-plan' | 'favourite' | undefined;
  const [openSuccessModal, setOpenSuccessModal] = useState(false)

  useEffect(() => {
    if (passedPage || page) {
      const active = passedPage || page || ""
      if (active) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setActiveTab(active)
      }
    }
    if (page && page === "price-plan") {
      setOpenSuccessModal(true)
    }
  }, [setActiveTab, passedPage, page])


  useEffect(() => {
    if (location.state) {
      navigate('.', { replace: true, state: null });
    }
  }, [navigate, location.state]);

  const user = useSelector((state: RootState) => state.auth.user);

  const { currentLanguage } = useSelector((state: RootState) => state.language);

  const isRTL = currentLanguage === "ar";

  useEffect(function returnToHomeIfNotLoggedIn() {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <AccountProfile />;
      case 'booking': return <AccountBooking />;
      case 'price-plan': return <AccountPricePlan />;
      case 'favourite': return <AccountFavourites />;
    }
  };

  useEffect(() => {
    scrollToTop()
  }, [activeTab])

  return (
    <>
      <PageTitle titleKey='Account.Header.pageTitle' />

      <div className={`min-h-screen min-w-md bg-gray-50 p-6 flex flex-col gap-4`}>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100" dir={isRTL ? "rtl" : "ltr"}>
          <ProfileHeader onMenuClick={() => setIsDrawerOpen(true)} />
        </div>

        {/* Main Container: Sidebar + Content */}
        <div className={`
        bg-white rounded-2xl shadow-sm border border-gray-100 
        flex flex-1 overflow-hidden
        ${isRTL ? 'lg:flex-row-reverse' : 'lg:flex-row'}
      `}>

          {/* Desktop Sidebar - Position changes based on direction */}
          <div className={`
            hidden lg:flex w-72 border-gray-100
            ${isRTL ? 'border-l' : ''}
          `}>
            <Sidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {renderContent()}
          </main>

          {/* Mobile Drawer */}
          {isDrawerOpen && (
            <div
              className="fixed inset-0 z-50 lg:hidden bg-black/60"
              onClick={() => setIsDrawerOpen(false)}
            >
              <div
                className={`
                  absolute top-0 h-full w-80 bg-white shadow-xl
                  ${isRTL ? 'right-0' : 'left-0'}
                `}
                onClick={e => e.stopPropagation()}
              >
                <Sidebar
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  isMobile
                  onClose={() => setIsDrawerOpen(false)}
                />
              </div>
            </div>
          )}

          <PlanSubscriptionSuccessModal
            open={openSuccessModal}
            onClose={() => {
              setSearchParams({}, { replace: true });
              setOpenSuccessModal(false)
            }}
            planName={""}
          />

        </div>
      </div>
    </>
  );
}