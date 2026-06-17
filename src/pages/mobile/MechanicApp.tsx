import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home as HomeIcon, 
  Briefcase, 
  TrendingUp, 
  CreditCard, 
  User, 
  Clock, 
  Check
} from 'lucide-react';

export const MechanicApp: React.FC = () => {
  const { completeBooking } = useApp();
  
  // Local state mappings
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'earnings' | 'wallet' | 'profile'>('home');
  const [jobState, setJobState] = useState<'idle' | 'request' | 'transit' | 'otp' | 'completed'>('request');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  // simulated earnings today
  const [todayEarnings, setTodayEarnings] = useState<number>(2350);
  const [completedJobsCount, setCompletedJobsCount] = useState<number>(7);

  // 30s countdown simulation for dispatch acceptance
  useEffect(() => {
    if (jobState === 'request' && isOnline && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && jobState === 'request') {
      setJobState('idle');
    }
  }, [jobState, isOnline, timeLeft]);

  // Restart simulation helper
  const handleReject = () => {
    setJobState('idle');
    setTimeout(() => {
      setJobState('request');
      setTimeLeft(30);
    }, 8000); // reappear after 8s
  };

  const handleAccept = () => {
    setJobState('transit');
  };

  const handleArrived = () => {
    setJobState('otp');
  };

  const handleOtpVerify = () => {
    if (otpInput === '4812' || otpInput === '1234' || otpInput.length === 4) {
      setJobState('completed');
      setOtpError('');
      setTodayEarnings(prev => prev + 350);
      setCompletedJobsCount(prev => prev + 1);
      
      // complete booking in context
      completeBooking(50);

      setTimeout(() => {
        setJobState('idle');
        setOtpInput('');
      }, 3000);
    } else {
      setOtpError('Invalid client verification OTP.');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-between h-full select-none text-slate-800 font-sans">
      
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pb-4">
        
        {/* Dark Header section */}
        <div className="bg-[#0D1117] text-white p-5 pb-6 rounded-b-[32px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800] rounded-full blur-3xl opacity-5"></div>
          
          {/* Logo & Alerts */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-[#FFB800]">
                <path d="M30 20 L10 80 L35 80 L50 45 Z" />
                <path d="M70 20 L90 80 L65 80 L50 45 Z" />
              </svg>
              <span className="font-black text-xl tracking-tight text-white">VELIX</span>
            </div>
            
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative hover:bg-white/15">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0D1117]"></span>
              <span className="text-[8px] font-black text-white absolute top-1.5 right-1.5 flex items-center justify-center leading-none"></span>
              <Clock className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* Profile Card row */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-3.5 items-center">
              <div className="w-12 h-12 rounded-full border-2 border-[#FFB800] overflow-hidden bg-slate-800 shadow-md">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Arjun Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                  Hello, Arjun 👋
                </h3>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> You are Online
                </p>
              </div>
            </div>

            <div className="bg-[#FFB800] text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1">
              <span>★</span> 4.8
            </div>
          </div>

          {/* Stats Summary row */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/5 text-center text-xs">
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Today's Earnings</span>
              <span className="text-sm font-black text-[#FFB800] mt-1 block">₹{todayEarnings}</span>
              <span className="text-[8px] text-emerald-400 font-bold mt-0.5 block">↑ 18% vs yesterday</span>
            </div>
            <div className="border-x border-white/5">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Jobs Completed</span>
              <span className="text-sm font-black text-white mt-1 block">{completedJobsCount}</span>
              <span className="text-[8px] text-slate-500 font-bold mt-0.5 block">vs yesterday</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Rating</span>
              <span className="text-sm font-black text-white mt-1 block">4.8 ★</span>
              <span className="text-[8px] text-slate-500 font-bold mt-0.5 block">(128 reviews)</span>
            </div>
          </div>

        </div>

        {/* Online Switch Bar */}
        <div className="mx-4 mt-4 bg-white p-3.5 rounded-2xl border border-slate-150 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
            <span className="text-emerald-600">You are Online</span>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400">Go Offline</span>
            <button 
              onClick={() => {
                setIsOnline(!isOnline);
                if (isOnline) setJobState('idle');
              }}
              className={`w-10 h-6 rounded-full p-0.5 transition-colors ${isOnline ? 'bg-[#FFB800]' : 'bg-gray-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isOnline ? 'translate-x-4' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Job Area */}
        <div className="mx-4 mt-5">
          
          {/* STATE: New Job Request Card */}
          {jobState === 'request' && isOnline && (
            <div className="bg-white rounded-2xl border border-red-500/20 shadow-lg p-4 space-y-4 animate-pulse relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-red-500/10"></div>
              
              <div className="flex justify-between items-center">
                <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">New Job Request</span>
                <span className="text-[10px] text-slate-400 font-bold">Just now</span>
              </div>

              <div className="flex justify-between items-start pt-1">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl border border-yellow-200 flex items-center justify-center text-lg shadow-inner">
                    🛠️
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">Tausif Khan</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Breakdown – Car Won't Start</p>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">📍 Vile Parle West, Mumbai</p>
                    <p className="text-[9px] text-slate-500 font-semibold mt-0.5">🚴 2.4 km away</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-extrabold text-slate-900">₹350</p>
                  <p className="text-[8px] text-slate-400 font-bold">Est. Earnings</p>
                </div>
              </div>

              {/* Actions Accept/Reject */}
              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button 
                  onClick={handleAccept}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/10"
                >
                  Accept ({timeLeft}s)
                </button>
                <button 
                  onClick={handleReject}
                  className="px-6 py-3 border border-red-200 hover:bg-red-50 text-red-500 rounded-xl text-xs font-bold transition"
                >
                  Reject
                </button>
              </div>
            </div>
          )}

          {/* STATE: Idle state (no bookings) */}
          {jobState === 'idle' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-6 text-center space-y-4 shadow-sm">
              <span className="text-2xl animate-bounce block">📡</span>
              <div>
                <h4 className="text-xs font-black text-slate-900">No Active Emergency requests</h4>
                <p className="text-[10px] text-slate-400 mt-1 px-6">Keep the status online. Emergency rescue dispatches along Western Express Highway will pop up here.</p>
              </div>
              <button 
                onClick={() => { setJobState('request'); setTimeLeft(30); }}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-bold"
              >
                Force Simulated Alarm
              </button>
            </div>
          )}

          {/* STATE: Transit tracking state */}
          {jobState === 'transit' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-4 space-y-4 shadow-sm">
              <div>
                <span className="bg-blue-50 text-blue-600 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1">Transit routing</span>
                <h4 className="text-xs font-black text-slate-900">Heading to Client Location</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Route: Western Express Highway → Vile Parle West</p>
              </div>

              {/* Map grid */}
              <div className="aspect-[4/3] rounded-xl bg-slate-100 relative overflow-hidden border border-slate-200">
                <div className="absolute inset-0 bg-[#E5E5E5] opacity-50" style={{ backgroundImage: 'radial-gradient(#b4b8c0 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                <svg className="absolute inset-0 w-full h-full">
                  <path d="M 40,130 Q 120,120 180,60" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="5 5" />
                </svg>
                {/* Mechanic Dot */}
                <div className="absolute top-[130px] left-[40px] -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                  </div>
                </div>
                {/* Client Pin */}
                <div className="absolute top-[60px] left-[180px] -translate-x-1/2 -translate-y-1/2 text-base">
                  📍
                </div>
              </div>

              <button
                onClick={handleArrived}
                className="w-full bg-[#0D1117] text-white py-3.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition"
              >
                I Have Arrived at Location
              </button>
            </div>
          )}

          {/* STATE: OTP Verification */}
          {jobState === 'otp' && (
            <div className="bg-white rounded-2xl border border-slate-150 p-4 space-y-4 shadow-sm">
              <div className="text-center">
                <span className="text-2xl">🔑</span>
                <h4 className="text-xs font-black text-slate-900 mt-1">Verify Service Entry</h4>
                <p className="text-[10px] text-slate-450 px-4 mt-0.5">Ask the customer for the security verification OTP shown on their screen.</p>
              </div>

              <div className="space-y-2">
                <input 
                  type="tel"
                  maxLength={4}
                  placeholder="e.g. 4812"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-xl font-bold tracking-widest focus:outline-none focus:border-[#FFB800]"
                />
                {otpError && <p className="text-red-500 text-[10px] text-center font-bold">{otpError}</p>}
                <p className="text-[9px] text-gray-400 text-center font-semibold">Note: Customer OTP is **4812**</p>
              </div>

              <button
                onClick={handleOtpVerify}
                className="w-full bg-[#FFB800] text-slate-950 py-3.5 rounded-xl text-xs font-bold hover:bg-yellow-400 transition"
              >
                Verify OTP & Finish Rescue
              </button>
            </div>
          )}

          {/* STATE: Operation Completed successfully */}
          {jobState === 'completed' && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 p-5 rounded-2xl text-center space-y-2 animate-pulse">
              <span className="text-2xl text-emerald-600 block">✓</span>
              <h4 className="text-xs font-black text-emerald-700">Rescue Completed successfully!</h4>
              <p className="text-[10px] text-slate-500">Payout ledger updated. Base fee + tip credited to wallet.</p>
            </div>
          )}

        </div>

        {/* Today's Schedule timeline list */}
        <div className="mx-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-slate-900">Today's Schedule</h3>
            <button className="text-[10px] font-bold text-slate-400">View All</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-150 p-4 space-y-4 shadow-sm">
            {[
              { name: 'Rahul Sharma', service: 'Battery Jumpstart', time: '08:30 AM', price: '₹250', status: 'completed' },
              { name: 'Neha Singh', service: 'Flat Tyre', time: '10:15 AM', price: '₹300', status: 'completed' },
              { name: 'Imran Ali', service: 'Towing Service', time: '12:45 PM', price: '₹500', status: 'transit' }
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs font-semibold">
                <div className="flex gap-3 items-center">
                  {item.status === 'completed' ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center shrink-0 animate-pulse">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-slate-900">{item.name}</h4>
                    <p className="text-[9px] text-slate-400 font-medium">{item.service} • {item.time}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-slate-900">{item.price}</p>
                  <p className={`text-[8px] font-bold uppercase tracking-wider mt-0.5 ${item.status === 'completed' ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`}>
                    {item.status === 'completed' ? 'Completed' : 'On the way'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Symmetrical Bottom Tab Bar */}
      <div className="grid grid-cols-5 w-full bg-[#0D1117] text-white border-t border-white/5 py-3 text-center shrink-0">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'home' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <HomeIcon className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('jobs')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'jobs' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <Briefcase className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Jobs</span>
        </button>

        <button 
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'earnings' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <TrendingUp className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Earnings</span>
        </button>

        <button 
          onClick={() => setActiveTab('wallet')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'wallet' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <CreditCard className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Wallet</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'profile' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <User className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Profile</span>
        </button>
      </div>

    </div>
  );
};
