import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Import Components & Pages
import Sidebar from './components/Sidebar'; 
import Dashboard from './pages/Dashboard';
import MyBooking from './pages/Mybooking';
import Services from './pages/Services';
import MyVehicles from './pages/MyVehicles';
import VelixPlus from './pages/VelixPlus';
import Support from './pages/Support';
import LiveTracking from './pages/livetracking';
import Login from './pages/Login';
import Payments from './pages/Payments';
import LiveMap from './pages/LiveMap';
import Offers from './pages/Offers';
import Settings from './pages/Settings';
import MobileApp from './pages/MobileApp';
import { AlertTriangle } from 'lucide-react';

const AppLayout = () => {
  const location = useLocation();
  const { isSOSModalActive, setSOSModalActive, user } = useApp();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Responsive layout listener
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hideSidebar = location.pathname === '/login';

  // Render Mobile Application view directly if on a mobile viewport
  if (isMobile) {
    return <MobileApp />;
  }

  return (
    <div className="flex h-screen bg-[#F5F6F8] font-sans overflow-hidden w-full mx-auto select-none relative text-[#0D1117]">
      
      {/* Left Navigation Sidebar */}
      {!hideSidebar && <Sidebar />}
      
      {/* Scrollable Main Desktop Panel */}
      <main className="flex-1 overflow-y-auto custom-scrollbar w-full relative">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/bookings" element={<MyBooking />} />
          <Route path="/services" element={<Services />} />
          <Route path="/vehicles" element={<MyVehicles />} />
          <Route path="/plus" element={<VelixPlus />} />
          <Route path="/support" element={<Support />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/live-map" element={<LiveMap />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      {/* Global Desktop SOS Overlay Alert Modal */}
      {isSOSModalActive && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-[#0D1117] border border-red-500/30 text-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-250 shadow-[0_0_50px_rgba(255,77,79,0.25)]">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
              <div className="absolute -inset-3 bg-red-500 rounded-full animate-pulse opacity-10"></div>
              <div className="w-16 h-16 bg-[#FF4D4F] rounded-full flex items-center justify-center text-white">
                <AlertTriangle className="w-8 h-8" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-red-500 uppercase tracking-widest">SOS Broadcast Active</h2>
              <p className="text-sm text-gray-300">
                A distress alert has been triggered with your live GPS coordinates.
              </p>
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl mt-4">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Notifying Contacts:</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {user.emergencyContacts.map((c, i) => (
                    <span key={i} className="bg-white/10 text-white border border-white/15 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                      {c.name} ({c.phone.slice(-5)})
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400 pt-2 leading-relaxed">
                Connecting with nearest towing rigs, police patrols, and roadside assistance helpers...
              </p>
            </div>

            <button 
              onClick={() => setSOSModalActive(false)}
              className="w-full bg-white text-[#0D1117] py-3.5 rounded-xl font-bold text-sm hover:bg-gray-150 transition-colors shadow-lg"
            >
              Cancel SOS Emergency
            </button>
          </div>
        </div>
      )}

      {/* Custom Scrollbar CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
}