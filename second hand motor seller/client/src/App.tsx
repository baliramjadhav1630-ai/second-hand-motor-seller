import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { FavoritesProvider } from './context/FavoritesContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { FloatingHelpDrawer } from './components/layout/FloatingHelpDrawer.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { MarketplacePage } from './pages/MarketplacePage.js';
import { VehicleDetailPage } from './pages/VehicleDetailPage.js';
import { SellVehiclePage } from './pages/SellVehiclePage.js';
import { SellerDashboardPage } from './pages/SellerDashboardPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { LoginPage } from './pages/LoginPage.js';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#07090e] text-slate-100">
            {/* Top Navigation */}
            <Navbar />

            {/* Main Application Routes */}
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/buy" element={<MarketplacePage />} />
                <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
                <Route path="/sell" element={<SellVehiclePage />} />
                <Route path="/dashboard" element={<SellerDashboardPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Floating Concierge Assistant */}
            <FloatingHelpDrawer />

            {/* Footer */}
            <Footer />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
