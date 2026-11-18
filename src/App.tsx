import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import "./i18n";
import Dashboard from './features/dashboard/Dashboard';
import { clearCredentials, selectAccessToken, selectUser } from './store/slices/authSlice';
import { isTokenValid } from './lib/tokenHelper';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropertiesSection from './features/properties/components/PropertiesSection';
import PropertyDetails from './features/properties/components/PropertyDetails';
import ReservationPage from './features/properties/reservation/ReservationPage';
import AccountPage from './features/profile/AccountPage';
import OwnerServices from './features/dashboard/owner-services/OwnerServices';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import ResetPassword from './features/auth/ResetPassword';
import { WhatsAppFAB } from './components/layout/WhatsAppFAB';
import { useOnlineStatus } from './hooks/use-is-online';
import { OfflineBanner } from './components/layout/OfflineBanner';
import { scrollToTop } from './lib/utils';
import PlanPage from './features/plans/PlanPage';
import ComingSoon from './ComingSoon';

function App() {

  const accessToken = useSelector(selectAccessToken);
  const user = useSelector(selectUser)
  const dispatch = useDispatch();
  const isOnline = useOnlineStatus()
  const location = useLocation()

  // Show the Coming Soon page only in production builds
  const isDowntime = false
  const isProduction = import.meta.env.MODE === 'production';

  useEffect(() => {
    if (!user || !accessToken || (accessToken && !isTokenValid(accessToken))) {
      dispatch(clearCredentials());
    }
  }, [accessToken, dispatch, user]);

  useEffect(() => {
    scrollToTop()
  }, [location.pathname])

  if (isDowntime && isProduction) return <ComingSoon />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      {!isOnline && <OfflineBanner />}
      <Header />

      {/* Main Content Area - This will grow naturally */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<PropertiesSection />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/plans/:id" element={<PlanPage />} />
          <Route
            path="/properties/:id/reservation"
            element={
              <ProtectedRoute>
                <ReservationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route path="/owner-services" element={<OwnerServices />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer - Now sits naturally at the bottom only when content is short */}
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

export default App;