import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Bell, ChevronDown, AlertTriangle } from 'lucide-react';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, setSOSModalActive } = useApp();

  return (
    <header className="flex justify-between items-center mb-8">
      {/* Left side: Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D1117] flex items-center gap-2">
          Welcome back, {user.name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1 font-medium">How can we help you today?</p>
      </div>
      
      {/* Right side: Controls */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button 
          onClick={() => navigate('/settings')}
          className="relative p-2 text-gray-600 hover:bg-white rounded-full transition-colors shadow-sm border border-transparent hover:border-gray-200"
        >
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FFB800] rounded-full border-2 border-[#F5F6F8]"></span>
          <Bell className="w-5 h-5" />
        </button>
        
        {/* Profile Pill */}
        <div 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full border border-gray-200 cursor-pointer hover:shadow-md transition-all"
        >
          <img 
            src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
            alt="Profile" 
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm text-[#0D1117]">{user.name}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
        
        {/* SOS Emergency Button */}
        <button 
          onClick={() => setSOSModalActive(true)}
          className="bg-[#FF4D4F] text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_4px_14px_0_rgba(255,77,79,0.25)] hover:bg-red-600 hover:shadow-[0_6px_20px_rgba(255,77,79,0.4)] transition-all active:scale-95 animate-pulse"
        >
          <AlertTriangle className="w-5 h-5" />
          SOS Emergency
        </button>

      </div>
    </header>
  );
};

export default Header;