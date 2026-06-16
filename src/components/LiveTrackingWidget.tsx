import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Phone, 
  HelpCircle, 
  Navigation2, 
  Car, 
  Map
} from 'lucide-react';

export const LiveTrackingWidget: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, cancelBooking, user } = useApp();

  // If no active booking, show fallback card
  if (!currentBooking) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-col items-center justify-center text-center py-12 min-h-[300px]">
        <div className="w-16 h-16 bg-[#FFF9E5] rounded-full flex items-center justify-center mb-4">
          <Navigation2 className="w-8 h-8 text-[#FFB800] transform rotate-45" />
        </div>
        <h3 className="font-bold text-lg text-[#0D1117] mb-2">No Active Booking</h3>
        <p className="text-gray-500 text-sm max-w-sm mb-6">
          Need assistance? Select a roadside service category above to find and request a verified mechanic near you.
        </p>
        <button 
          onClick={() => navigate('/services')}
          className="bg-[#0D1117] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
        >
          Book Breakdown Service
        </button>
      </div>
    );
  }

  // Active booking tracking screen
  const stepStatus = currentBooking.status;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      
      {/* Title Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-[#0D1117]">Live Tracking</h2>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
            {stepStatus === 'requested' && 'Requesting...'}
            {stepStatus === 'accepted' && 'Request Accepted'}
            {stepStatus === 'onWay' && 'On The Way'}
            {stepStatus === 'arrived' && 'Helper Arrived'}
            {stepStatus === 'completed' && 'Service Completed'}
          </span>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors">
            <Map className="w-3.5 h-3.5" /> Traffic
          </button>
          <button 
            onClick={() => navigate('/live-tracking')}
            className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors text-[#FFB800]"
          >
            <MapPin className="w-3.5 h-3.5" /> Full Screen Map
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-5">
        {stepStatus === 'requested' && 'Finding the nearest mechanic for you...'}
        {stepStatus === 'accepted' && `${currentBooking.mechanicName} is preparing tools for dispatch`}
        {stepStatus === 'onWay' && `${currentBooking.mechanicName} is on the way to your location`}
        {stepStatus === 'arrived' && `${currentBooking.mechanicName} has arrived! Share the OTP ${currentBooking.otp} to start service.`}
      </p>

      {/* Main tracking content */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* Mechanic Card */}
        <div className="w-full lg:w-1/3 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between shadow-sm bg-white">
          <div>
            <div className="flex gap-3 mb-4">
              <img 
                src={`https://ui-avatars.com/api/?name=${currentBooking.mechanicName.replace(' ', '+')}&background=F5F6F8&color=0D1117`} 
                alt="Mechanic Profile" 
                className="w-14 h-14 rounded-full object-cover border-2 border-green-500 p-0.5" 
              />
              <div>
                <h3 className="font-bold text-[#0D1117]">{currentBooking.mechanicName}</h3>
                <div className="flex items-center gap-1 text-green-600 text-[10px] font-bold mt-0.5 mb-1 bg-green-50 w-max px-1.5 py-0.5 rounded">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </div>
                <p className="text-xs text-gray-500 font-medium">★ 4.8 <span className="text-gray-400">(320 Reviews)</span></p>
              </div>
            </div>
            
            <div className="flex gap-4 text-sm text-gray-600 font-medium mb-4 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#FFB800]" /> 
                {stepStatus === 'arrived' ? 'Arrived' : currentBooking.eta}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-400" /> 
                {stepStatus === 'arrived' ? '10 meters' : currentBooking.distance}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Service Vehicle</p>
              <p className="text-sm font-semibold text-[#0D1117]">{currentBooking.vehicle}</p>
            </div>

            <div className="flex justify-between mb-6 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div>
                <p className="text-[11px] text-gray-500 font-semibold uppercase">Visit Charge</p>
                <p className="text-sm font-bold text-[#0D1117]">{currentBooking.visitCharge}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500 font-semibold uppercase">Service Charge (Est.)</p>
                <p className="text-sm font-bold text-[#0D1117]">{currentBooking.serviceChargeEst}</p>
              </div>
            </div>
            
            {stepStatus === 'arrived' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl mb-4 text-center">
                <p className="text-[10px] text-yellow-800 font-bold uppercase tracking-wider">Start Service OTP</p>
                <p className="text-2xl font-black text-[#0D1117] tracking-widest mt-0.5">{currentBooking.otp}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <a 
                href={`tel:${user.phone}`}
                className="flex-1 bg-[#FFB800] text-[#0D1117] font-bold py-2.5 rounded-xl flex justify-center items-center gap-2 hover:bg-yellow-400 transition-colors active:scale-95 text-center text-sm"
              >
                <Phone className="w-4 h-4" /> Call
              </a>
              <button 
                onClick={() => alert("Connecting with Velix Dispatch helpline: 1800-120-999")}
                className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl flex justify-center items-center gap-2 hover:bg-gray-50 transition-colors active:scale-95 text-sm"
              >
                <HelpCircle className="w-4 h-4" /> Helpline
              </button>
            </div>
            {stepStatus !== 'completed' && (
              <button 
                onClick={cancelBooking}
                className="w-full text-[#FF4D4F] hover:bg-red-50 py-2.5 rounded-xl text-sm font-bold border border-transparent hover:border-red-100 transition-all mt-1"
              >
                Cancel Request
              </button>
            )}
          </div>
        </div>

        {/* Map Column */}
        <div className="w-full lg:w-2/3 flex flex-col gap-4">
          
          {/* Simulated Map Container */}
          <div className="flex-1 bg-[#E8EAED] rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-200 min-h-[250px] shadow-inner">
            <div className="absolute inset-0 bg-[#E5E5E5] opacity-50" 
                 style={{ 
                   backgroundImage: 'radial-gradient(#c9ccd1 1px, transparent 1px)', 
                   backgroundSize: '20px 20px' 
                 }} />
            
            {/* Route Polyline */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path 
                d="M 120,200 C 220,180 200,120 300,110 S 350,220 450,150" 
                fill="none" 
                stroke="#16A34A" 
                strokeWidth="4" 
                strokeDasharray="6 6"
              />
            </svg>

            {/* User Location marker (Blue dot) */}
            <div className="absolute top-[150px] left-[450px] -translate-x-1/2 -translate-y-1/2 z-10">
               <div className="relative">
                 <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                   <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                 </div>
                 <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-30"></div>
               </div>
               <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white text-[#0D1117] text-[9px] font-bold px-1.5 py-0.5 rounded shadow border border-gray-100 whitespace-nowrap">
                 You
               </div>
            </div>

            {/* Mechanic Car Marker (position animates based on status) */}
            <div 
              className="absolute z-20 transition-all duration-1000"
              style={{
                top: stepStatus === 'requested' ? '200px' :
                     stepStatus === 'accepted' ? '185px' :
                     stepStatus === 'onWay' ? '115px' : '150px',
                left: stepStatus === 'requested' ? '120px' :
                      stepStatus === 'accepted' ? '200px' :
                      stepStatus === 'onWay' ? '280px' : '450px',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-500">
                  <Car className="w-6 h-6 text-green-600" />
                </div>
                {stepStatus === 'onWay' && (
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                )}
              </div>
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0D1117] text-white text-[9px] font-bold px-2 py-0.5 rounded whitespace-nowrap shadow-md">
                {currentBooking.mechanicName}
              </div>
            </div>

            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-30">
              <button className="bg-white p-2 rounded-lg shadow border border-gray-100 hover:bg-gray-50 w-9 h-9 flex items-center justify-center font-bold text-lg transition-colors">+</button>
              <button className="bg-white p-2 rounded-lg shadow border border-gray-100 hover:bg-gray-50 w-9 h-9 flex items-center justify-center font-bold text-lg transition-colors">-</button>
              <button className="bg-white p-2 rounded-lg shadow border border-gray-100 hover:bg-gray-50 w-9 h-9 flex items-center justify-center transition-colors"><Navigation2 className="w-4 h-4 text-gray-600 transform rotate-45" /></button>
            </div>
          </div>

          {/* Stepper Timeline Progress */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center relative overflow-x-auto">
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-100 -translate-y-1/2 z-0 hidden sm:block"></div>
            
            {/* Active tracking line indicator */}
            <div 
              className="absolute top-1/2 left-8 h-1 bg-green-500 -translate-y-1/2 z-0 hidden sm:block transition-all duration-1000"
              style={{
                width: stepStatus === 'requested' ? '0%' :
                       stepStatus === 'accepted' ? '25%' :
                       stepStatus === 'onWay' ? '50%' :
                       stepStatus === 'arrived' ? '75%' : '100%',
              }}
            ></div>

            {/* Steps */}
            <div className="relative z-10 flex flex-col items-center gap-1 min-w-[70px]">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                ['requested', 'accepted', 'onWay', 'arrived', 'completed'].includes(stepStatus) ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                ✓
              </div>
              <p className="text-[10px] font-bold text-gray-800 mt-1">Requested</p>
              <p className="text-[9px] text-gray-500">{currentBooking.timeline.requested}</p>
            </div>

            <div className={`relative z-10 flex flex-col items-center gap-1 min-w-[70px] ${
              ['accepted', 'onWay', 'arrived', 'completed'].includes(stepStatus) ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                ['accepted', 'onWay', 'arrived', 'completed'].includes(stepStatus) ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {['accepted', 'onWay', 'arrived', 'completed'].includes(stepStatus) ? '✓' : '2'}
              </div>
              <p className="text-[10px] font-bold text-gray-800 mt-1">Accepted</p>
              <p className="text-[9px] text-gray-500">{currentBooking.timeline.accepted || '--:--'}</p>
            </div>

            <div className={`relative z-10 flex flex-col items-center gap-1 min-w-[70px] ${
              ['onWay', 'arrived', 'completed'].includes(stepStatus) ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                ['onWay', 'arrived', 'completed'].includes(stepStatus) ? 'bg-green-500 shadow-[0_0_0_4px_rgba(22,163,74,0.2)]' : 'bg-gray-300'
              }`}>
                {['onWay', 'arrived', 'completed'].includes(stepStatus) ? '✓' : '3'}
              </div>
              <p className="text-[10px] font-bold text-gray-800 mt-1">On The Way</p>
              <p className="text-[9px] text-gray-500">{currentBooking.timeline.onWay || '--:--'}</p>
            </div>

            <div className={`relative z-10 flex flex-col items-center gap-1 min-w-[70px] ${
              ['arrived', 'completed'].includes(stepStatus) ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                ['arrived', 'completed'].includes(stepStatus) ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {['arrived', 'completed'].includes(stepStatus) ? '✓' : '4'}
              </div>
              <p className="text-[10px] font-bold text-gray-800 mt-1">Arrived</p>
              <p className="text-[9px] text-gray-500">{currentBooking.timeline.arrived || '--:--'}</p>
            </div>

            <div className={`relative z-10 flex flex-col items-center gap-1 min-w-[70px] ${
              stepStatus === 'completed' ? 'opacity-100' : 'opacity-40'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                stepStatus === 'completed' ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {stepStatus === 'completed' ? '✓' : '5'}
              </div>
              <p className="text-[10px] font-bold text-gray-500 mt-1">Completed</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LiveTrackingWidget;