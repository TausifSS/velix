import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Home as HomeIcon, 
  Briefcase, 
  TrendingUp, 
  CreditCard, 
  User, 
  Clock, 
  Check,
  LogOut,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  Building
} from 'lucide-react';

interface MechanicAppProps {
  setScreen: (scr: string) => void;
}

export const MechanicApp: React.FC<MechanicAppProps> = ({ setScreen }) => {
  const { completeBooking, setCurrentUserRole } = useApp();
  
  // Local state mappings
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'earnings' | 'wallet' | 'profile'>('home');
  const [jobState, setJobState] = useState<'idle' | 'request' | 'transit' | 'arrived' | 'work' | 'done'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  
  // Simulated stats
  const [todayEarnings, setTodayEarnings] = useState<number>(2350);
  const [completedJobsCount, setCompletedJobsCount] = useState<number>(7);

  // Alarm countdown timer
  useEffect(() => {
    let timer: number;
    if (jobState === 'request' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && jobState === 'request') {
      const handle = setTimeout(() => {
        setJobState('idle');
      }, 0);
      return () => clearTimeout(handle);
    }
    return () => clearInterval(timer);
  }, [jobState, timeLeft]);

  const handleAccept = () => {
    setJobState('transit');
  };

  const handleReject = () => {
    setJobState('idle');
  };

  const handleArrived = () => {
    setJobState('arrived');
  };

  const handleVerifyOtp = () => {
    if (enteredOtp === '9921') {
      setJobState('work');
    } else {
      alert("Invalid Client OTP! (Hint: Use OTP 9921)");
    }
  };

  const handleFinishJob = () => {
    completeBooking(50); // Simulates client tipping ₹50
    setTodayEarnings(prev => prev + 350);
    setCompletedJobsCount(prev => prev + 1);
    setJobState('idle');
    alert("Job complete! ₹350 added to daily earnings.");
  };

  const handleLogout = () => {
    setCurrentUserRole('user');
    setScreen('auth');
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
            
            <button 
              onClick={() => alert("Notification Center: No new warnings or dispatches at this moment.")}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative hover:bg-white/15 active:scale-95 transition"
            >
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#0D1117]"></span>
              <Clock className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          {/* Profile Card row */}
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-3.5 items-center">
              <div 
                onClick={() => setActiveTab('profile')} 
                className="w-12 h-12 rounded-full border-2 border-[#FFB800] overflow-hidden bg-slate-800 shadow-md cursor-pointer hover:opacity-90 transition shrink-0"
              >
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Arjun Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-1.5">
                  Hello, Arjun 👋
                </h3>
                <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
                  {isOnline ? 'You are Online' : 'You are Offline'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('profile')}
              className="bg-[#FFB800] text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1 hover:bg-yellow-400 active:scale-95 transition"
            >
              <span>★</span> 4.8
            </button>
          </div>

          {/* Stats Summary row */}
          <div className="grid grid-cols-3 gap-2 mt-6 pt-5 border-t border-white/5 text-center text-xs">
            <div 
              onClick={() => setActiveTab('earnings')}
              className="cursor-pointer hover:bg-white/5 p-1 rounded-lg transition active:scale-95"
            >
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Today's Earnings</span>
              <span className="text-sm font-black text-[#FFB800] mt-1 block">₹{todayEarnings}</span>
              <span className="text-[8px] text-emerald-400 font-bold mt-0.5 block">↑ 18% vs yesterday</span>
            </div>
            <div 
              onClick={() => setActiveTab('jobs')}
              className="border-x border-white/5 cursor-pointer hover:bg-white/5 p-1 rounded-lg transition active:scale-95"
            >
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Jobs Completed</span>
              <span className="text-sm font-black text-white mt-1 block">{completedJobsCount}</span>
              <span className="text-[8px] text-slate-500 font-bold mt-0.5 block">vs yesterday</span>
            </div>
            <div 
              onClick={() => setActiveTab('profile')}
              className="cursor-pointer hover:bg-white/5 p-1 rounded-lg transition active:scale-95"
            >
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Rating</span>
              <span className="text-sm font-black text-white mt-1 block">4.8 ★</span>
              <span className="text-[8px] text-slate-500 font-bold mt-0.5 block">(128 reviews)</span>
            </div>
          </div>
        </div>

        {/* TAB 1: HOME/DISPATCH VIEW */}
        {activeTab === 'home' && (
          <div className="space-y-4 mt-4 animate-in fade-in duration-200">
            {/* Status toggle bar */}
            <div className="mx-4 bg-white rounded-2xl border border-slate-150 p-4 flex justify-between items-center shadow-sm">
              <div>
                <span className="text-xs font-black text-slate-900 block">Duty Status</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Toggle to receive highway dispatches</span>
              </div>
              <button 
                onClick={() => { setIsOnline(!isOnline); if (isOnline) setJobState('idle'); }}
                className={`w-12 h-6.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${isOnline ? 'bg-emerald-500' : 'bg-gray-200'}`}
              >
                <div className={`w-5.5 h-5.5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${isOnline ? 'translate-x-5.5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Simulated Alarm Dispatch Card */}
            {isOnline && (
              <div className="mx-4">
                {/* STATE: Request Incoming */}
                {jobState === 'request' && (
                  <div className="bg-[#0D1117] text-white rounded-2xl p-5 border-2 border-[#FFB800] space-y-4 shadow-xl animate-bounce">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1 animate-pulse">Emergency Dispatch</span>
                        <h4 className="text-sm font-black">Rahul Sharma</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Breakdown – Car Won't Start</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-black text-[#FFB800] bg-white/5 border border-white/10 px-2 py-1 rounded block">{timeLeft}s left</span>
                      </div>
                    </div>

                    <div className="bg-white/5 p-3 rounded-xl space-y-2 border border-white/5 text-[10px]">
                      <p className="font-semibold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#FFB800] shrink-0" /> Western Express Highway (WEH) • Mile 24</p>
                      <p className="font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#FFB800] shrink-0" /> Estimated ETA: 12 mins • Distance: 4.8 km</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 pt-1.5">
                      <button 
                        onClick={handleReject}
                        className="py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl transition"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={handleAccept}
                        className="py-3 bg-[#FFB800] hover:bg-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-yellow-500/10 transition"
                      >
                        Accept Dispatch
                      </button>
                    </div>
                  </div>
                )}

                {/* STATE: Idle */}
                {jobState === 'idle' && (
                  <div className="bg-white rounded-2xl border border-slate-150 p-6 text-center space-y-4 shadow-sm">
                    <span className="text-2xl animate-bounce block">📡</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">No Active Emergency requests</h4>
                      <p className="text-[10px] text-slate-400 mt-1 px-6">Keep the status online. Emergency rescue dispatches along Western Express Highway will pop up here.</p>
                    </div>
                    <button 
                      onClick={() => { setJobState('request'); setTimeLeft(30); }}
                      className="px-4 py-1.5 bg-[#0D1117] text-white hover:bg-slate-900 rounded-lg text-[9px] font-bold"
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
                      <div className="absolute top-[60px] left-[180px] -translate-x-1/2 -translate-y-1/2 text-base">📍</div>
                    </div>

                    <button
                      onClick={handleArrived}
                      className="w-full bg-[#0D1117] text-white py-3.5 rounded-xl text-xs font-bold hover:bg-gray-800 transition"
                    >
                      Confirm Arrival at Location
                    </button>
                  </div>
                )}

                {/* STATE: Arrived OTP screen */}
                {jobState === 'arrived' && (
                  <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-sm">
                    <div className="text-center space-y-1">
                      <span className="text-2xl">🔑</span>
                      <h4 className="text-xs font-black text-slate-900">Arrived! Enter OTP</h4>
                      <p className="text-[10px] text-slate-400">Ask the client for their verification secure PIN code.</p>
                      <p className="text-[#16A34A] text-[9px] font-bold mt-1 bg-green-50 px-2 py-0.5 rounded inline-block">Hint OTP: 9921</p>
                    </div>

                    <input 
                      type="tel"
                      maxLength={4}
                      placeholder="Enter 4-digit code"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold tracking-widest focus:outline-none focus:border-[#FFB800]"
                    />

                    <button
                      onClick={handleVerifyOtp}
                      className="w-full bg-[#FFB800] text-slate-950 py-3.5 rounded-xl text-xs font-black hover:bg-yellow-400 transition"
                    >
                      Verify PIN & Start Repair
                    </button>
                  </div>
                )}

                {/* STATE: Active work screen */}
                {jobState === 'work' && (
                  <div className="bg-white rounded-2xl border border-slate-150 p-5 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <div>
                        <span className="bg-[#FFF9E5] text-[#FFB800] text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Service In Progress</span>
                        <h4 className="text-xs font-black text-slate-900 mt-1">Rahul Sharma</h4>
                        <p className="text-[9px] text-slate-400">Breakdown – Car Won't Start</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"><Phone className="w-4 h-4" /></button>
                        <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200"><MessageSquare className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 text-[10px]">
                      <p className="font-semibold text-slate-700">🛠️ Task Checklist:</p>
                      <ul className="space-y-1 pl-1 text-slate-500">
                        <li className="flex items-center gap-1.5">✓ Diagnose vehicle battery voltage</li>
                        <li className="flex items-center gap-1.5">✓ Connect high-amp jump cables</li>
                        <li className="flex items-center gap-1.5">⏰ Complete ignition spin test (2 mins)</li>
                      </ul>
                    </div>

                    <button
                      onClick={handleFinishJob}
                      className="w-full bg-[#16A34A] text-white py-3.5 rounded-xl text-xs font-bold hover:bg-green-600 transition flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 stroke-[3]" /> Mark Job as Completed
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Today's Schedule */}
            <div className="mx-4 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-black text-slate-900">Today's Schedule</h3>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Chronological</span>
              </div>

              <div className="bg-white rounded-2xl border border-slate-150 p-4 shadow-sm divide-y divide-slate-100">
                {[
                  { time: '08:10 AM', client: 'Rahul Sharma', job: 'Battery Jumpstart', price: '₹250', status: 'Completed', statusColor: 'text-emerald-600 bg-emerald-50' },
                  { time: '10:15 AM', client: 'Neha Singh', job: 'Flat Tyre Repair', price: '₹300', status: 'Completed', statusColor: 'text-emerald-600 bg-emerald-50' },
                  { time: '12:45 PM', client: 'Imran Ali', job: 'Towing Service', price: '₹500', status: 'Upcoming', statusColor: 'text-amber-600 bg-amber-50' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                    <div className="flex gap-3 items-center">
                      <span className="font-mono text-[9px] font-bold text-slate-450 shrink-0">{item.time}</span>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{item.client}</h4>
                        <p className="text-[10px] text-slate-500">{item.job}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${item.statusColor}`}>{item.status}</span>
                      <p className="text-xs font-extrabold text-slate-950 mt-1">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPLETED JOBS TIMELINE */}
        {activeTab === 'jobs' && (
          <div className="mx-4 mt-4 space-y-3 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">Rescue Dispatch Log</h3>

            {[
              { client: 'Rahul Sharma', date: 'Today, 08:10 AM', type: 'Battery Jumpstart', route: 'Western Express Highway → Mile 24', pay: '₹250' },
              { client: 'Neha Singh', date: 'Today, 10:15 AM', type: 'Flat Tyre Repair', route: 'Link Road → Bandra Intersection', pay: '₹300' },
              { client: 'Kabir Lal', date: 'Yesterday, 14:20 PM', type: 'Engine Check', route: 'Vile Parle East Tunnel Exit', pay: '₹400' }
            ].map((jb, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{jb.client}</h4>
                    <p className="text-[10px] text-slate-500">{jb.type} • {jb.date}</p>
                  </div>
                  <span className="text-xs font-black text-[#FFB800] bg-slate-950 px-2.5 py-0.5 rounded">{jb.pay}</span>
                </div>
                <div className="text-[9px] text-slate-400 font-semibold flex items-center gap-1 bg-slate-50 p-2 rounded-lg">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{jb.route}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PAYOUTS & EARNINGS ANALYSIS */}
        {activeTab === 'earnings' && (
          <div className="mx-4 mt-4 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">Weekly Payout Summary</h3>

            {/* Earnings visual block */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Accumulated Balance</span>
                  <span className="text-2xl font-black text-slate-950">₹{todayEarnings}</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-black px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Payout Ready
                </span>
              </div>

              {/* Bar charts visual simulation */}
              <div className="space-y-2 pt-2">
                {[
                  { day: 'Mon', val: 75, amt: '₹1,200' },
                  { day: 'Tue', val: 40, amt: '₹750' },
                  { day: 'Wed', val: 90, amt: '₹1,800' },
                  { day: 'Thu', val: 60, amt: '₹1,100' },
                  { day: 'Fri', val: 100, amt: '₹2,350' }
                ].map((b, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[10px]">
                    <span className="w-8 text-slate-500 font-bold">{b.day}</span>
                    <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#FFB800] h-full rounded-full" style={{ width: `${b.val}%` }} />
                    </div>
                    <span className="w-12 text-right font-black text-slate-900">{b.amt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WALLET & CASHOUT SIMULATION */}
        {activeTab === 'wallet' && (
          <div className="mx-4 mt-4 space-y-4 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">My Wallet Balance</h3>

            <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-5 rounded-2xl text-white space-y-4 shadow-lg relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-[#FFB800] rounded-full blur-3xl opacity-10"></div>
              
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Wallet Balance</span>
                <span className="text-2xl font-black text-white mt-1 block">₹{todayEarnings}</span>
              </div>

              <div className="bg-white/5 p-3 rounded-xl border border-white/5 flex justify-between items-center text-[10px]">
                <div className="text-left">
                  <span className="text-slate-400 block font-bold">Payout Target Bank</span>
                  <span className="font-extrabold text-white mt-0.5 block">HDFC Bank Ltd •••• 9910</span>
                </div>
                <Building className="w-4 h-4 text-[#FFB800]" />
              </div>

              <button 
                onClick={() => {
                  alert(`Transfer of ₹${todayEarnings} to HDFC Bank initiated successfully! Processing time: 2-3 hours.`);
                  setTodayEarnings(0);
                }}
                disabled={todayEarnings === 0}
                className={`w-full py-3.5 rounded-xl font-black text-xs transition ${
                  todayEarnings > 0 
                    ? 'bg-[#FFB800] text-slate-950 hover:bg-yellow-400 active:scale-95' 
                    : 'bg-white/10 text-white/40 cursor-not-allowed'
                }`}
              >
                Transfer Cash to Bank
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE & COMPLIANCE */}
        {activeTab === 'profile' && (
          <div className="mx-4 mt-4 space-y-4 animate-in fade-in duration-200">
            {/* Mechanic details */}
            <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm space-y-3 text-center">
              <div className="w-16 h-16 rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 mx-auto shadow-sm">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120" alt="Arjun Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Arjun Lal</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Partner ID: VMX-9982</p>
                <div className="mt-1.5 flex justify-center">
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-100">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified Partner
                  </span>
                </div>
              </div>
            </div>

            {/* Compliance verification list */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden text-xs">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-900 block">Aadhaar Verification Status</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Identity card biometrics validated</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-black uppercase">Approved ✓</span>
              </div>

              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-900 block">PAN Verification Status</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Income Tax record matched</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-black uppercase">Approved ✓</span>
              </div>

              <div className="p-4 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-900 block">Video Liveness KYC</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Face biometric analysis</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-black uppercase">Verified ✓</span>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Mechanic App</span>
            </button>
          </div>
        )}

      </div>

      {/* Symmetrical Bottom Tab Bar */}
      <div className="grid grid-cols-5 w-full bg-white border-t border-slate-150 py-3 text-center shrink-0">
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
