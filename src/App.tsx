import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import "./i18n";
import Dashboard from './features/dashboard/Dashboard';
import { clearCredentials, selectAccessToken } from './store/slices/authSlice';
import { isTokenValid } from './lib/tokenHelper';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function App() {

  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isTokenValid(accessToken)) {
      dispatch(clearCredentials());
    }
  }, [accessToken, dispatch]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content Area - This will grow naturally */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<div>Users Page</div>} />
          <Route path="/analytics" element={<div>Analytics Page</div>} />
          <Route path="/settings" element={<div>Settings Page</div>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Footer - Now sits naturally at the bottom only when content is short */}
      <Footer />
    </div>
  );
}

export default App;