import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop only */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header/Navbar */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<div className="text-3xl font-bold">Welcome to Elite Status Dashboard</div>} />
            <Route path="/users" element={<div>Users Page</div>} />
            <Route path="/analytics" element={<div>Analytics Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;