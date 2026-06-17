import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Users, 
  Wrench, 
  ChevronDown, 
  Bell, 
  ChevronRight, 
  LogOut, 
  ShieldCheck,
  Settings
} from 'lucide-react';

interface BusinessAppProps {
  setScreen: (scr: string) => void;
}

export const BusinessApp: React.FC<BusinessAppProps> = ({ setScreen }) => {
  const { setCurrentUserRole } = useApp();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'today'>('week');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'mechanics' | 'customers' | 'menu'>('dashboard');
  const [radius, setRadius] = useState<number>(8);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);

  // Timeframe statistics mapping
  const stats = {
    week: { bookings: 128, completed: 98, earnings: '₹45,680', active: 14, online: 10, bookDiff: '↑ 16%', earnDiff: '↑ 20%', compDiff: '↑ 12%' },
    month: { bookings: 542, completed: 412, earnings: '₹1,84,320', active: 18, online: 12, bookDiff: '↑ 24%', earnDiff: '↑ 28%', compDiff: '↑ 18%' },
    today: { bookings: 18, completed: 14, earnings: '₹5,840', active: 12, online: 8, bookDiff: '↓ 4%', earnDiff: '↑ 2%', compDiff: '↓ 1%' }
  };

  const currentStats = stats[timeframe];

  // Weekly Line chart coordinates simulation
  const chartCoordinates = {
    week: "M 30,130 Q 70,120 110,100 T 190,80 T 270,70 T 350,50",
    month: "M 30,120 Q 70,90 110,110 T 190,70 T 270,50 T 350,40",
    today: "M 30,140 Q 70,130 110,120 T 190,110 T 270,90 T 350,85"
  };

  const chartPath = chartCoordinates[timeframe];

  const handleLogout = () => {
    setCurrentUserRole('user');
    setScreen('auth');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-between h-full select-none text-slate-800 font-sans">
      
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pb-4">
        
        {/* Yellow Header section */}
        <div className="bg-[#FFB800] rounded-b-[32px] p-5 pb-8 text-slate-950 relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-950 rounded-full blur-3xl opacity-5"></div>
          
          {/* Logo & Alerts */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-slate-950">
                <path d="M30 20 L10 80 L35 80 L50 45 Z" />
                <path d="M70 20 L90 80 L65 80 L50 45 Z" />
              </svg>
              <span className="font-black text-xl tracking-tight">VELIX</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-full bg-slate-950/10 flex items-center justify-center relative hover:bg-slate-950/15">
                <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full border border-[#FFB800] text-[8px] text-white font-extrabold flex items-center justify-center leading-none">3</span>
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Welcome Info */}
          <div className="flex justify-between items-end mt-6">
            <div>
              <p className="text-[10px] font-bold text-slate-900/80 uppercase tracking-widest leading-none">Business Owner</p>
              <h2 className="text-xl font-black mt-1 leading-tight text-slate-950">Hello, AutoFix Hub 👋</h2>
            </div>
            
            {activeTab === 'dashboard' && (
              <div className="relative">
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as 'week' | 'month' | 'today')}
                  className="bg-white border border-slate-200 text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl focus:outline-none appearance-none cursor-pointer shadow-sm text-slate-800"
                >
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-200">
            {/* Stats Grid Dashboard Card */}
            <div className="mx-4 -mt-6 bg-white rounded-2xl p-4 shadow-lg border border-slate-100 grid grid-cols-2 gap-3.5">
              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Bookings</span>
                <span className="text-lg font-black text-slate-900 mt-0.5 block">{currentStats.bookings}</span>
                <span className="text-[9px] font-bold text-emerald-600 block mt-1">{currentStats.bookDiff} vs last week</span>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Completed Jobs</span>
                <span className="text-lg font-black text-slate-900 mt-0.5 block">{currentStats.completed}</span>
                <span className="text-[9px] font-bold text-emerald-600 block mt-1">{currentStats.compDiff} vs last week</span>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Total Earnings</span>
                <span className="text-lg font-black text-emerald-600 mt-0.5 block">{currentStats.earnings}</span>
                <span className="text-[9px] font-bold text-emerald-600 block mt-1">{currentStats.earnDiff} vs last week</span>
              </div>

              <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Active Mechanics</span>
                <span className="text-lg font-black text-slate-900 mt-0.5 block">{currentStats.active}</span>
                <span className="text-[9px] font-semibold text-slate-550 block mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block"></span> Online {currentStats.online}
                </span>
              </div>
            </div>

            {/* Quick Menu shortcuts */}
            <div className="mx-4 mt-5 grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-700">
              <div onClick={() => setActiveTab('bookings')} className="p-3.5 bg-[#FFF9E5] border border-yellow-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
                <Calendar className="w-4 h-4 text-[#FFB800]" />
                <span>Bookings</span>
              </div>
              <div onClick={() => setActiveTab('mechanics')} className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
                <Wrench className="w-4 h-4 text-blue-500" />
                <span>Mechanics</span>
              </div>
              <div onClick={() => setActiveTab('customers')} className="p-3.5 bg-purple-50 border border-purple-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
                <Users className="w-4 h-4 text-purple-500" />
                <span>Customers</span>
              </div>
              <div onClick={() => setActiveTab('menu')} className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
                <Settings className="w-4 h-4 text-emerald-500" />
                <span>Settings</span>
              </div>
            </div>

            {/* Weekly Earnings Chart */}
            <div className="mx-4 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-black text-slate-900">Earnings Analysis</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Line Chart (₹)</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm">
                <div className="relative">
                  <svg className="w-full h-32" viewBox="0 0 380 120">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFB800" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#FFB800" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d={`${chartPath} L 350,110 L 30,110 Z`} fill="url(#chartGlow)" className="transition-all duration-500" />
                    <path d={chartPath} fill="none" stroke="#FFB800" strokeWidth="3.5" strokeLinecap="round" className="transition-all duration-500" />
                    <circle cx="350" cy="50" r="5" fill="#FFB800" stroke="white" strokeWidth="2" />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] text-slate-400 font-bold font-mono ml-8 mt-2">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            {/* Live Bookings List preview */}
            <div className="mx-4 mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-black text-slate-900">Live Booking Alerts</h3>
                <button onClick={() => setActiveTab('bookings')} className="text-[10px] font-bold text-[#FFB800]">View All</button>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm space-y-3">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center text-lg shadow-sm">🚙</div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Tausif Khan</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Breakdown – Car Won't Start</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1">📍 Vile Parle West, Mumbai</p>
                      <span className="inline-block bg-blue-50 text-blue-600 text-[8px] font-bold px-2.5 py-0.5 rounded-full mt-2 uppercase tracking-wide">On The Way</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400">10:24 AM</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">₹350</p>
                  </div>
                </div>

                <div className="flex justify-between items-start pt-1">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-lg shadow-sm">🏍️</div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">Rahul Sharma</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Flat Tyre replacement</p>
                      <p className="text-[9px] text-slate-400 font-semibold mt-1">📍 Bandra West, WEH Highway</p>
                      <span className="inline-block bg-emerald-50 text-emerald-600 text-[8px] font-bold px-2.5 py-0.5 rounded-full mt-2 uppercase tracking-wide">Completed</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400">08:10 AM</p>
                    <p className="text-sm font-extrabold text-slate-900 mt-0.5">₹250</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Services list */}
            <div className="mx-4 mt-6">
              <h3 className="text-sm font-black text-slate-900 mb-3">Service Statistics</h3>
              <div className="flex gap-2.5 overflow-x-auto py-1 custom-scrollbar">
                {[
                  { label: 'Breakdown', value: 42 },
                  { label: 'Towing', value: 28 },
                  { label: 'Battery', value: 25 },
                  { label: 'Flat Tyre', value: 20 },
                  { label: 'Fuel Dispatch', value: 13 }
                ].map((srv, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center min-w-[84px] space-y-1">
                    <div className="w-8 h-8 bg-[#FFF9E5] border border-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600 text-sm">🛠️</div>
                    <p className="text-[8px] text-slate-400 font-bold block uppercase">{srv.label}</p>
                    <p className="text-xs font-black text-slate-900">{srv.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="mx-4 mt-4 space-y-3 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">Fleet Dispatch History</h3>
            
            {[
              { id: '1', customer: 'Tausif Khan', type: 'Breakdown', loc: 'Vile Parle West', status: 'In Transit', time: '10:24 AM', cost: '₹350', emoji: '🚙', badge: 'bg-blue-50 text-blue-600' },
              { id: '2', customer: 'Rahul Sharma', type: 'Flat Tyre', loc: 'Bandra West', status: 'Completed', time: '08:10 AM', cost: '₹250', emoji: '🏍️', badge: 'bg-emerald-50 text-emerald-600' },
              { id: '3', customer: 'Neha Singh', type: 'Towing Service', loc: 'Andheri East', status: 'Completed', time: 'Yesterday', cost: '₹800', emoji: '🚗', badge: 'bg-emerald-50 text-emerald-600' },
              { id: '4', customer: 'Priya Shah', type: 'Battery Jumpstart', loc: 'Santacruz Highway', status: 'Cancelled', time: '2 days ago', cost: '₹150', emoji: '🚙', badge: 'bg-red-50 text-red-650' }
            ].map(bk => (
              <div key={bk.id} className="bg-white p-4 rounded-xl border border-slate-150 shadow-sm flex justify-between items-center">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-lg">{bk.emoji}</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{bk.customer}</h4>
                    <p className="text-[10px] text-slate-500">{bk.type} • {bk.time}</p>
                    <p className="text-[9px] text-slate-400 mt-1 font-semibold flex items-center gap-0.5">📍 {bk.loc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${bk.badge}`}>{bk.status}</span>
                  <p className="text-xs font-black text-slate-900 mt-1.5">{bk.cost}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: MECHANICS LIST */}
        {activeTab === 'mechanics' && (
          <div className="mx-4 mt-4 space-y-3 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-black text-slate-900">On-Duty Fleet</h3>
              <span className="text-[9px] bg-slate-900 text-white font-extrabold px-2 py-0.5 rounded">Total 4</span>
            </div>

            {[
              { name: 'Arjun L.', rating: '4.8 ★', status: 'Online', dispatch: 'Tausif Khan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120', badge: 'text-emerald-500' },
              { name: 'Vikram S.', rating: '4.9 ★', status: 'Online', dispatch: 'Neha Singh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120', badge: 'text-emerald-500' },
              { name: 'Priya K.', rating: '4.7 ★', status: 'Online', dispatch: 'Idle', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120', badge: 'text-emerald-500' },
              { name: 'Ramesh G.', rating: '4.5 ★', status: 'Offline', dispatch: 'None', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120', badge: 'text-slate-400' }
            ].map((mech, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden bg-slate-50">
                    <img src={mech.avatar} alt={mech.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{mech.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${mech.badge}`}></span>
                      {mech.status}
                    </p>
                    <p className="text-[9px] text-slate-500 font-semibold mt-1">Job: {mech.dispatch}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[9px] font-black text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded">{mech.rating}</span>
                  <button className="text-[9px] text-[#FFB800] font-bold block hover:underline mt-1">Track Live</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: CUSTOMERS REGISTRY */}
        {activeTab === 'customers' && (
          <div className="mx-4 mt-4 space-y-3 animate-in fade-in duration-200">
            <h3 className="text-sm font-black text-slate-900 mb-1">Premium Client Directory</h3>

            {[
              { name: 'Tausif Khan', orders: '5 Bookings', spent: '₹1,750 spent', rating: '5.0 ★', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120' },
              { name: 'Rahul Sharma', orders: '8 Bookings', spent: '₹2,100 spent', rating: '4.9 ★', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=120' },
              { name: 'Neha Singh', orders: '3 Bookings', spent: '₹2,400 spent', rating: '4.8 ★', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120' }
            ].map((cust, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-slate-200 overflow-hidden bg-slate-50">
                    <img src={cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{cust.name}</h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">{cust.orders} • {cust.spent}</p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{cust.rating}</span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: MENU & SETTINGS */}
        {activeTab === 'menu' && (
          <div className="mx-4 mt-4 space-y-4 animate-in fade-in duration-200">
            {/* Shop profile details */}
            <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm space-y-3 text-center">
              <div className="w-16 h-16 bg-[#FFF9E5] border border-yellow-100 rounded-2xl flex items-center justify-center mx-auto text-yellow-600 text-3xl shadow-sm">
                🏬
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">AutoFix Hub</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Registration: AX99120H</p>
                <div className="mt-1.5 flex justify-center">
                  <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-100">
                    <ShieldCheck className="w-2.5 h-2.5" /> Verified Business
                  </span>
                </div>
              </div>
            </div>

            {/* Config list settings */}
            <div className="bg-white rounded-2xl border border-slate-150 shadow-sm overflow-hidden text-xs">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-900 block">Dispatch Radius Limit</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Maximum alert range on WEH</span>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min={2} 
                    max={20} 
                    value={radius} 
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-20 accent-[#FFB800]" 
                  />
                  <span className="font-black font-mono text-[10px] text-slate-800 shrink-0">{radius} km</span>
                </div>
              </div>

              <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <span className="font-extrabold text-slate-900 block">Sound Alerts & Alarms</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Rings upon client emergency request</span>
                </div>
                <button 
                  onClick={() => setAlertsEnabled(!alertsEnabled)}
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${alertsEnabled ? 'bg-amber-400' : 'bg-gray-200'}`}
                >
                  <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${alertsEnabled ? 'translate-x-4.5' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/50">
                <div>
                  <span className="font-extrabold text-slate-900 block">Business Account Info</span>
                  <span className="text-[10px] text-slate-450 block mt-0.5">Billing logs, GSTIN details</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-extrabold text-xs rounded-2xl transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Business</span>
            </button>
          </div>
        )}

      </div>

      {/* Symmetrical Bottom Tab Bar */}
      <div className="grid grid-cols-5 w-full bg-white border-t border-slate-150 py-3 text-center shrink-0">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'dashboard' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" />
            <rect x="14" y="3" width="7" height="5" />
            <rect x="14" y="12" width="7" height="9" />
            <rect x="3" y="16" width="7" height="5" />
          </svg>
          <span className="text-[9px] font-bold">Dashboard</span>
        </button>

        <button 
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'bookings' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <Calendar className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Bookings</span>
        </button>

        <button 
          onClick={() => setActiveTab('mechanics')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'mechanics' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <Wrench className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Mechanics</span>
        </button>

        <button 
          onClick={() => setActiveTab('customers')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'customers' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <Users className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[9px] font-bold">Customers</span>
        </button>

        <button 
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'menu' ? 'text-[#FFB800]' : 'text-gray-400'}`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="text-[9px] font-bold">Menu</span>
        </button>
      </div>

    </div>
  );
};
