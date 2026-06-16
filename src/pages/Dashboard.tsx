import React from 'react';
import Header from '../components/Header';
import QuickActions from '../components/QuickActions';
import LiveTrackingWidget from '../components/LiveTrackingWidget';
import { BottomWidgets, RightPanels } from '../components/RightPanels';
import { ShieldCheck, Percent, MapPin, Phone, CreditCard } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 w-full">
      {/* Welcome header containing notifications, user profile and SOS */}
      <Header />
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Main Content Column (70%) */}
        <div className="w-full lg:w-[70%] flex flex-col">
          {/* Quick action grid for services */}
          <QuickActions />
          
          {/* Live tracking map + details */}
          <LiveTrackingWidget />
          
          {/* Garage, Wallet, Velix Plus member badges */}
          <BottomWidgets />
        </div>
        
        {/* Right Sidebar Panels (30%) */}
        <div className="w-full lg:w-[30%]">
          <RightPanels />
        </div>
      </div>

      {/* Bottom Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t border-gray-200 text-gray-600">
         <div className="flex items-center gap-2">
           <ShieldCheck className="w-5 h-5 text-green-600" /> 
           <span className="text-xs font-semibold">Verified Professionals</span>
         </div>
         <div className="flex items-center gap-2">
           <Percent className="w-5 h-5 text-[#FFB800]" /> 
           <span className="text-xs font-semibold">Transparent Pricing</span>
         </div>
         <div className="flex items-center gap-2">
           <MapPin className="w-5 h-5 text-blue-500" /> 
           <span className="text-xs font-semibold">Live Tracking</span>
         </div>
         <div className="flex items-center gap-2">
           <Phone className="w-5 h-5 text-gray-700" /> 
           <span className="text-xs font-semibold">24x7 Support</span>
         </div>
         <div className="flex items-center gap-2 flex-1 col-span-2 md:col-span-1">
           <CreditCard className="w-5 h-5 text-purple-500" /> 
           <span className="text-xs font-semibold">Secure Payments</span>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;