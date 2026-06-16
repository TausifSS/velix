import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  MapPin, Phone, HelpCircle, ShieldCheck, 
  Clock, Navigation, CheckCircle2, Car, Map as MapIcon,
  AlertCircle
} from 'lucide-react';

export const LiveTracking: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, cancelBooking, user } = useApp();

  if (!currentBooking) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-24">
        <div className="w-16 h-16 bg-[#FFF9E5] rounded-full flex items-center justify-center mb-6">
          <Navigation className="w-8 h-8 text-[#FFB800] transform rotate-45" />
        </div>
        <h1 className="text-2xl font-bold text-[#0D1117] mb-2">No Active Booking to Track</h1>
        <p className="text-gray-500 text-sm mb-8">
          You don't have any active dispatch requests running right now. Request a service from the services page to track live progress.
        </p>
        <button 
          onClick={() => navigate('/services')}
          className="bg-[#0D1117] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-sm"
        >
          Book a Mechanic Now
        </button>
      </div>
    );
  }

  const stepStatus = currentBooking.status;

  return (
    <div className="p-8 h-full flex flex-col w-full">
      
      {/* Page Header */}
      <header className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117] flex items-center gap-2">
            Live Tracking
            <span className="bg-green-150 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
              {stepStatus === 'requested' && 'Finding Mechanic...'}
              {stepStatus === 'accepted' && 'Request Accepted'}
              {stepStatus === 'onWay' && 'Helper On The Way'}
              {stepStatus === 'arrived' && 'Helper Arrived'}
              {stepStatus === 'completed' && 'Service Completed'}
            </span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {stepStatus === 'requested' && 'Analyzing coordinates and searching nearest helper partners...'}
            {stepStatus === 'accepted' && `${currentBooking.mechanicName} has accepted and is preparing tools.`}
            {stepStatus === 'onWay' && `${currentBooking.mechanicName} is on the way to your location.`}
            {stepStatus === 'arrived' && `${currentBooking.mechanicName} has arrived at your location.`}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors border border-red-100">
            <AlertCircle className="w-4 h-4" />
            Report Issue
          </button>
          <button className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors">
            <MapIcon className="w-4 h-4" />
            Change View
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Left Column: Mechanic Details & Timeline (35%) */}
        <div className="w-full lg:w-[35%] flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar shrink-0">
          
          {/* Mechanic Profile Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm relative">
                  <img src={`https://ui-avatars.com/api/?name=${currentBooking.mechanicName.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt="Mechanic" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#0D1117] flex items-center gap-1">
                    {currentBooking.mechanicName}
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                  </h2>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <span className="text-[#FFB800]">★</span>
                    <span className="font-semibold text-gray-700">4.8</span>
                    <span>(320 Reviews)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F5F6F8] p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase">Arriving In</span>
                </div>
                <div className="text-xl font-bold text-[#16A34A]">
                  {stepStatus === 'arrived' ? 'Arrived' : currentBooking.eta}
                </div>
              </div>
              <div className="bg-[#F5F6F8] p-4 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Navigation className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase">Distance</span>
                </div>
                <div className="text-xl font-bold text-[#0D1117]">
                  {stepStatus === 'arrived' ? '10m' : currentBooking.distance}
                </div>
              </div>
            </div>

            {/* Vehicle & Payment Info */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <Car className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Service Vehicle</p>
                    <p className="text-sm font-semibold text-[#0D1117]">{currentBooking.vehicle}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <div>
                  <p className="text-xs text-yellow-800 font-medium mb-0.5">Service OTP</p>
                  <p className="text-2xl font-bold text-[#0D1117] tracking-widest">{currentBooking.otp}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">Est. Charge</p>
                  <p className="text-lg font-bold text-[#0D1117]">{currentBooking.price}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <a 
                href={`tel:${user.phone}`}
                className="flex items-center justify-center gap-2 bg-[#FFB800] text-[#0D1117] py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors text-center text-sm"
              >
                <Phone className="w-5 h-5" />
                Call Partner
              </a>
              <button 
                onClick={() => alert("Connecting with Velix Dispatch helpline: 1800-120-999")}
                className="flex items-center justify-center gap-2 bg-gray-100 text-[#0D1117] py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
              >
                <HelpCircle className="w-5 h-5" />
                Helpline
              </button>
            </div>
            
            <button 
              onClick={cancelBooking}
              className="w-full mt-3 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors text-sm border border-transparent hover:border-red-100"
            >
              Cancel Assistance Request
            </button>
          </div>

          {/* Stepper Vertical Logs */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1">
            <h3 className="font-bold text-[#0D1117] mb-6">Service Progress</h3>
            <div className="relative pl-3">
              {/* Vertical line connecting steps */}
              <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-gray-100"></div>
              
              {/* Active progress color */}
              <div 
                className="absolute top-2 left-[19px] w-0.5 bg-green-500 transition-all duration-1000"
                style={{
                  height: stepStatus === 'requested' ? '0%' :
                          stepStatus === 'accepted' ? '25%' :
                          stepStatus === 'onWay' ? '50%' :
                          stepStatus === 'arrived' ? '75%' : '100%',
                }}
              ></div>

              <div className="space-y-6">
                
                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 bg-white pt-1">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center bg-green-500">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-bold text-[#0D1117]">Requested</p>
                    <p className="text-xs text-gray-500 mt-1">{currentBooking.timeline.requested}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 bg-white pt-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      ['accepted', 'onWay', 'arrived', 'completed'].includes(stepStatus) ? 'bg-green-500' : 'border-2 border-gray-200 bg-white'
                    }`}>
                      {['accepted', 'onWay', 'arrived', 'completed'].includes(stepStatus) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className={`flex-1 pt-0.5 ${['accepted', 'onWay', 'arrived', 'completed'].includes(stepStatus) ? '' : 'opacity-40'}`}>
                    <p className="text-sm font-bold text-[#0D1117]">Accepted</p>
                    <p className="text-xs text-gray-500 mt-1">{currentBooking.timeline.accepted || '--:--'}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 bg-white pt-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      ['onWay', 'arrived', 'completed'].includes(stepStatus) ? 'bg-green-500' : 'border-2 border-gray-200 bg-white'
                    }`}>
                      {['onWay', 'arrived', 'completed'].includes(stepStatus) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className={`flex-1 pt-0.5 ${['onWay', 'arrived', 'completed'].includes(stepStatus) ? '' : 'opacity-40'}`}>
                    <p className="text-sm font-bold text-[#0D1117]">Helper On The Way</p>
                    <p className="text-xs text-gray-500 mt-1">{currentBooking.timeline.onWay || '--:--'}</p>
                  </div>
                </div>

                <div className="relative flex items-start gap-4">
                  <div className="relative z-10 bg-white pt-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      ['arrived', 'completed'].includes(stepStatus) ? 'bg-green-500' : 'border-2 border-gray-200 bg-white'
                    }`}>
                      {['arrived', 'completed'].includes(stepStatus) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <div className={`flex-1 pt-0.5 ${['arrived', 'completed'].includes(stepStatus) ? '' : 'opacity-40'}`}>
                    <p className="text-sm font-bold text-[#0D1117]">Helper Arrived</p>
                    <p className="text-xs text-gray-500 mt-1">{currentBooking.timeline.arrived || '--:--'}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Google Maps SVG simulator */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-[#E5E5E5] overflow-hidden" 
               style={{ 
                 backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', 
                 backgroundSize: '20px 20px' 
               }}>
            
            {/* SVG Path Route */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path 
                d="M 200,800 L 300,600 L 450,550 L 500,300 L 700,250" 
                fill="none" 
                stroke="#16A34A" 
                strokeWidth="4" 
                strokeDasharray="8 8"
                className="animate-[dash_1s_linear_infinite]"
              />
            </svg>

            {/* Mechanic marker car */}
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000"
              style={{
                top: stepStatus === 'requested' ? '800px' :
                     stepStatus === 'accepted' ? '600px' :
                     stepStatus === 'onWay' ? '450px' : '250px',
                left: stepStatus === 'requested' ? '200px' :
                      stepStatus === 'accepted' ? '300px' :
                      stepStatus === 'onWay' ? '420px' : '700px',
              }}
            >
               <div className="relative">
                 <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-green-500 relative z-10">
                   <Car className="w-6 h-6 text-green-600" />
                 </div>
                 {stepStatus === 'onWay' && (
                   <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                 )}
               </div>
               <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#0D1117] text-white text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-md">
                 {currentBooking.mechanicName}
               </div>
            </div>

            {/* User Blue Pin Location */}
            <div className="absolute top-[250px] left-[700px] -translate-x-1/2 -translate-y-1/2 z-10">
               <div className="w-8 h-8 bg-blue-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white relative z-10">
                 <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
               </div>
               <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white text-[#0D1117] text-[10px] font-bold px-2 py-1 rounded shadow-md border border-gray-100 whitespace-nowrap">
                 Your Coordinates
               </div>
            </div>

          </div>

          {/* Controls */}
          <div className="absolute right-4 bottom-4 flex flex-col gap-2">
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 font-bold text-lg hover:bg-gray-50 border border-gray-100">+</button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-gray-700 font-bold text-xl hover:bg-gray-50 border border-gray-100">-</button>
            <button className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-[#FFB800] hover:bg-gray-50 border border-gray-100"><MapPin className="w-5 h-5 fill-current" /></button>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -16; }
        }
      `}} />
    </div>
  );
};

export default LiveTracking;