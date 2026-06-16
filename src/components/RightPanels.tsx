import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CreditCard, Crown, ChevronRight, Clock, Navigation } from 'lucide-react';

// ==========================================
// BOTTOM WIDGETS COMPONENT
// ==========================================
export const BottomWidgets: React.FC = () => {
  const navigate = useNavigate();
  const { user, vehicles } = useApp();

  const defaultVehicle = vehicles.find(v => v.isDefault) || vehicles[0];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      
      {/* My Vehicles Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-sm text-[#0D1117]">My Vehicles</h3>
          <button 
            onClick={() => navigate('/vehicles')}
            className="text-xs text-gray-500 font-semibold hover:text-[#0D1117] transition-colors flex items-center gap-0.5"
          >
            View Garage <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 h-full">
          {defaultVehicle ? (
            <div className="flex-1 border border-green-200 bg-green-50/30 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                <span className="text-xl">🚗</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#0D1117]">{defaultVehicle.brand} {defaultVehicle.model}</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{defaultVehicle.number}</p>
                <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">Default</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 border border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center text-center text-xs text-gray-400">
              No vehicles registered
            </div>
          )}
          <button 
            onClick={() => navigate('/vehicles')}
            className="w-1/3 border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors group"
          >
            <span className="text-lg font-bold leading-none group-hover:text-[#0D1117] transition-colors">+</span>
            <span className="text-[9px] font-bold mt-1 group-hover:text-[#0D1117] transition-colors whitespace-nowrap">Add Vehicle</span>
          </button>
        </div>
      </div>

      {/* Wallet Card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-[#0D1117] mb-1">Wallet</h3>
          <div className="flex items-center gap-3 mt-3">
            <div className="bg-purple-100 p-2.5 rounded-xl">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-[#0D1117]">₹{user.walletBalance.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-gray-500 font-medium">Velix Wallet Balance</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/payments')}
          className="bg-[#FFB800] text-[#0D1117] px-4 py-2.5 w-full text-xs font-bold rounded-xl hover:bg-yellow-400 mt-4 transition-colors"
        >
          Add Money
        </button>
      </div>

      {/* Membership Card */}
      <div className={`p-5 rounded-2xl shadow-sm flex flex-col justify-between border ${
        user.velixPlus.active ? 'border-[#FFB800] bg-white' : 'border-gray-200 bg-white'
      }`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full flex-shrink-0 ${user.velixPlus.active ? 'bg-[#FFF9E5]' : 'bg-gray-100'}`}>
            <Crown className={`w-6 h-6 ${user.velixPlus.active ? 'text-[#FFB800]' : 'text-gray-400'}`} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[#0D1117] text-sm leading-tight mb-1">
              {user.velixPlus.active ? 'Velix Plus Member' : 'Upgrade to Velix Plus'}
            </h3>
            <p className="text-[10px] text-gray-500 leading-tight">
              {user.velixPlus.active 
                ? `Active - valid till ${user.velixPlus.expiry}` 
                : 'Priority assistance, free towing credits & zero visit charges.'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/plus')}
          className={`w-full text-xs font-bold py-2.5 rounded-xl transition-colors mt-4 border ${
            user.velixPlus.active 
              ? 'border-gray-200 text-gray-700 hover:bg-gray-50' 
              : 'border-[#FFB800] bg-[#FFB800]/10 text-[#FFB800] hover:bg-[#FFB800] hover:text-[#0D1117]'
          }`}
        >
          {user.velixPlus.active ? 'View Benefits' : 'Explore Membership'}
        </button>
      </div>

    </div>
  );
};


// ==========================================
// RIGHT SIDEBAR PANELS
// ==========================================
export const RightPanels: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, bookings } = useApp();

  // Last completed booking for recent activity context
  const lastBooking = bookings.filter(b => b.status === 'completed')[0];

  return (
    <div className="space-y-6">
      
      {/* Current Booking Overview Panel */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-sm text-[#0D1117] mb-4 uppercase tracking-wider text-gray-400">Current Booking</h3>
        
        {currentBooking ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-500">Booking ID</p>
                <p className="font-bold text-sm text-[#0D1117]">{currentBooking.id}</p>
              </div>
              <span className="bg-yellow-50 border border-yellow-100 text-[#FFB800] text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                {currentBooking.status}
              </span>
            </div>
            
            <div className="space-y-2.5 bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Service:</span>
                <span className="font-bold text-[#0D1117]">{currentBooking.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Mechanic:</span>
                <span className="font-bold text-[#0D1117]">{currentBooking.mechanicName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">Requested:</span>
                <span className="font-semibold text-gray-600">{currentBooking.date} • {currentBooking.time}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200/50 pt-2 mt-2 font-bold text-sm">
                <span className="text-gray-800">Visit Charge:</span>
                <span className="text-[#0D1117]">{currentBooking.price}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/live-tracking')}
              className="w-full bg-[#0D1117] text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-[0_2px_8px_rgba(13,17,23,0.15)] flex items-center justify-center gap-1"
            >
              View Live Progress <Navigation className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 font-medium">No active service request</p>
            <button 
              onClick={() => navigate('/services')}
              className="text-[#FFB800] text-xs font-bold hover:underline mt-2 inline-block"
            >
              Book service now
            </button>
          </div>
        )}
      </div>

      {/* Recent Activity Steps */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-sm text-[#0D1117] mb-4 uppercase tracking-wider text-gray-400">Recent Activity</h3>
        
        {currentBooking ? (
          // Stepper of active request progress
          <div className="relative pl-3 space-y-4">
            <div className="absolute top-2 bottom-2 left-[7px] w-0.5 bg-gray-100"></div>
            
            <div className="relative flex items-center gap-3 text-xs">
              <div className={`w-3.5 h-3.5 rounded-full z-10 border-2 border-white ${
                ['requested', 'accepted', 'onWay', 'arrived', 'completed'].includes(currentBooking.status) ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1 flex justify-between items-center">
                <span className="font-bold text-gray-700">Request Sent</span>
                <span className="text-[10px] text-gray-400">{currentBooking.timeline.requested}</span>
              </div>
            </div>

            <div className="relative flex items-center gap-3 text-xs">
              <div className={`w-3.5 h-3.5 rounded-full z-10 border-2 border-white ${
                ['accepted', 'onWay', 'arrived', 'completed'].includes(currentBooking.status) ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1 flex justify-between items-center">
                <span className={`font-bold ${['accepted', 'onWay', 'arrived', 'completed'].includes(currentBooking.status) ? 'text-gray-700' : 'text-gray-400'}`}>
                  Request Accepted
                </span>
                <span className="text-[10px] text-gray-400">{currentBooking.timeline.accepted || '--:--'}</span>
              </div>
            </div>

            <div className="relative flex items-center gap-3 text-xs">
              <div className={`w-3.5 h-3.5 rounded-full z-10 border-2 border-white ${
                ['onWay', 'arrived', 'completed'].includes(currentBooking.status) ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1 flex justify-between items-center">
                <span className={`font-bold ${['onWay', 'arrived', 'completed'].includes(currentBooking.status) ? 'text-gray-700' : 'text-gray-400'}`}>
                  Mechanic Dispatched
                </span>
                <span className="text-[10px] text-gray-400">{currentBooking.timeline.onWay || '--:--'}</span>
              </div>
            </div>

            <div className="relative flex items-center gap-3 text-xs opacity-80">
              <div className={`w-3.5 h-3.5 rounded-full z-10 border-2 border-white ${
                ['arrived', 'completed'].includes(currentBooking.status) ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1 flex justify-between items-center">
                <span className={`font-bold ${['arrived', 'completed'].includes(currentBooking.status) ? 'text-gray-700' : 'text-gray-400'}`}>
                  Helper Arrived
                </span>
                <span className="text-[10px] text-gray-400">{currentBooking.timeline.arrived || '--:--'}</span>
              </div>
            </div>
          </div>
        ) : lastBooking ? (
          // Last completed logs
          <div className="space-y-4">
            <div className="border-l-2 border-green-500 pl-3">
              <p className="text-xs font-bold text-gray-800">{lastBooking.service}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{lastBooking.mechanicName} • Completed</p>
              <span className="text-[9px] text-gray-400 font-semibold">{lastBooking.date} • {lastBooking.time}</span>
            </div>
            <button 
              onClick={() => navigate('/bookings')}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-[#0D1117] rounded-xl text-xs font-bold text-center border border-gray-100 transition-colors"
            >
              View Booking History
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center py-4">No recent activity log.</p>
        )}
      </div>

      {/* Safety Help Card / Police Hotline Info (SOS related) */}
      <div className="bg-[#0D1117] text-white p-5 rounded-2xl relative overflow-hidden border border-gray-800">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600 rounded-full blur-[60px] opacity-10"></div>
        <div className="relative z-10">
          <h4 className="font-bold text-sm text-red-500 mb-1 flex items-center gap-1.5">
            🚨 Safety Center
          </h4>
          <p className="text-[11px] text-gray-400 mb-3.5">
            Emergency helpline numbers and emergency contact options.
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between border-b border-gray-800 pb-1.5">
              <span className="text-gray-400">National Police Help:</span>
              <a href="tel:112" className="font-bold text-white hover:underline">112</a>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1.5">
              <span className="text-gray-400">Road Accident Helpline:</span>
              <a href="tel:1073" className="font-bold text-white hover:underline">1073</a>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Velix Dispatch Support:</span>
              <a href="tel:1800-VELIX" className="font-bold text-[#FFB800] hover:underline">1800-120-999</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RightPanels;