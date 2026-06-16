import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  CalendarDays, 
  MapPin, 
  Wrench, 
  CreditCard, 
  Car, 
  Crown, 
  HelpCircle, 
  Map, 
  Percent, 
  Settings, 
  LogOut,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Home, id: 'dashboard', path: '/' },
  { name: 'My Bookings', icon: CalendarDays, id: 'bookings', path: '/bookings' },
  { name: 'Live Tracking', icon: MapPin, id: 'tracking', path: '/live-tracking' },
  { name: 'Live Map', icon: Map, id: 'live-map', path: '/live-map' },
  { name: 'Services', icon: Wrench, id: 'services', path: '/services' },
  { name: 'Payments', icon: CreditCard, id: 'payments', path: '/payments' },
  { name: 'My Vehicles', icon: Car, id: 'vehicles', path: '/vehicles' },
  { name: 'Velix Plus', icon: Crown, id: 'plus', path: '/plus', isNew: true },
  { name: 'Support', icon: HelpCircle, id: 'support', path: '/support' },
  { name: 'Offers', icon: Percent, id: 'offers', path: '/offers' },
  { name: 'Settings', icon: Settings, id: 'settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, currentUserRole, setCurrentUserRole } = useApp();

  const getNavItems = () => {
    if (currentUserRole === 'mechanic') {
      return [
        { name: 'Business Console', icon: Home, id: 'dashboard', path: '/' },
        { name: 'Live Map', icon: Map, id: 'live-map', path: '/live-map' },
        { name: 'Payout Ledger', icon: CreditCard, id: 'payments', path: '/payments' },
        { name: 'Settings', icon: Settings, id: 'settings', path: '/settings' },
      ];
    }
    if (currentUserRole === 'admin') {
      return [
        { name: 'Verification Portal', icon: Home, id: 'dashboard', path: '/' },
        { name: 'Platform Finances', icon: CreditCard, id: 'payments', path: '/payments' },
        { name: 'Settings', icon: Settings, id: 'settings', path: '/settings' },
      ];
    }
    return navItems;
  };

  const currentNavItems = getNavItems();

  // Find active item based on current pathname
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    const activeItem = currentNavItems.find(item => item.path !== '/' && path.startsWith(item.path));
    return activeItem ? activeItem.id : 'dashboard';
  };

  const activeTab = getActiveTab();

  const handleNavClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-64 bg-white h-full flex flex-col border-r border-gray-200 flex-shrink-0">
      
      {/* Brand & Logo Area */}
      <div className="p-6 pb-4 flex items-center gap-3">
        <div className="text-[#FFB800] font-bold">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-9 h-9">
             <path d="M12 2L2 22h5.5l4.5-9 4.5 9H22L12 2z" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-2xl tracking-tight text-[#0D1117] leading-none">VELIX</h1>
          <p className="text-[11px] text-gray-500 font-medium mt-1 tracking-wide">Never Stranded Again.</p>
        </div>
      </div>

      {/* Persona Switcher for Simulation */}
      <div className="mx-4 mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
        <label className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
          Simulate Role View
        </label>
        <select 
          value={currentUserRole}
          onChange={(e) => {
            setCurrentUserRole(e.target.value as 'user' | 'mechanic' | 'admin');
            navigate('/');
          }}
          className="w-full bg-white border border-slate-200 text-xs font-semibold py-1.5 px-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#FFB800] text-gray-700 cursor-pointer"
        >
          <option value="user">🚙 Regular User</option>
          <option value="mechanic">🔧 Mechanic Partner</option>
          <option value="admin">🛡️ Platform Admin</option>
        </select>
      </div>

      {/* Scrollable Navigation Area */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5 custom-scrollbar">
        {currentNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive 
                  ? 'bg-[#FFF9E5] text-[#FFB800]' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-[#0D1117]' 
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left text-sm font-semibold">{item.name}</span>
              
              {item.isNew && (
                <span className="bg-[#FFF9E5] text-[#FFB800] text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  New
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section (Logout & Velix Plus Ad) */}
      <div className="p-4 space-y-4">
        
        {/* Logout Button */}
        <button 
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-[#FF4D4F] rounded-xl font-medium transition-colors group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-semibold">Logout</span>
        </button>

        {/* Velix Plus Promotion Card */}
        {currentUserRole === 'user' && (
          !user.velixPlus.active ? (
            <div className="bg-[#0D1117] text-white p-5 rounded-2xl relative overflow-hidden shadow-lg border border-gray-800">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-[#FFB800]" />
                  <span className="font-bold text-base tracking-wide">Velix Plus</span>
                </div>
                
                <ul className="text-xs text-gray-300 space-y-2.5 mb-5">
                  <li className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#FFB800]" /> Priority Support
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Percent className="w-4 h-4 text-[#FFB800]" /> Lower Prices
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Wrench className="w-4 h-4 text-[#FFB800]" /> Free Towing Credits
                  </li>
                </ul>
                
                <button 
                  onClick={() => navigate('/plus')}
                  className="bg-[#FFB800] text-[#0D1117] text-sm font-bold py-3 w-full rounded-xl hover:bg-yellow-400 transition-all transform active:scale-95 shadow-[0_4px_14px_0_rgba(255,184,0,0.39)]"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#0D1117] to-[#1e2330] text-white p-5 rounded-2xl relative overflow-hidden shadow-lg border border-yellow-500/30">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800] rounded-full blur-2xl opacity-10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-[#FFB800] animate-pulse" />
                  <span className="font-bold text-sm text-yellow-400 uppercase tracking-wider">Velix Plus Active</span>
                </div>
                <p className="text-[10px] text-gray-400">Premium roadside support active until {user.velixPlus.expiry}</p>
                <button 
                  onClick={() => navigate('/plus')}
                  className="mt-3 w-full border border-yellow-500/40 text-yellow-400 text-xs font-bold py-2 rounded-xl hover:bg-[#FFB800] hover:text-[#0D1117] transition-all"
                >
                  View Benefits
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Sidebar;