import React, { useState } from 'react';
import { 
  Calendar, 
  Users, 
  Wrench, 
  FileText, 
  ChevronDown, 
  Bell, 
  Phone, 
  MessageSquare,
  TrendingUp,
  Car
} from 'lucide-react';

export const BusinessApp: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'today'>('week');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'bookings' | 'mechanics' | 'customers' | 'menu'>('dashboard');

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

  return (
    <div className="flex-1 bg-slate-50 flex flex-col justify-between h-full select-none text-slate-800 font-sans">
      
      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto pb-4">
        
        {/* Yellow Header section */}
        <div className="bg-[#FFB800] rounded-b-[32px] p-5 pb-8 text-slate-950 relative overflow-hidden shadow-md">
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
              {/* Notification bell */}
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
            
            {/* Filter Dropdown */}
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
          </div>
        </div>

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

        {/* Categories grid menu links */}
        <div className="mx-4 mt-5 grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-slate-700">
          <div className="p-3.5 bg-[#FFF9E5] border border-yellow-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
            <Calendar className="w-4 h-4 text-[#FFB800]" />
            <span>Bookings</span>
          </div>
          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
            <Users className="w-4 h-4 text-blue-500" />
            <span>Mechanics</span>
          </div>
          <div className="p-3.5 bg-purple-50 border border-purple-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
            <Users className="w-4 h-4 text-purple-500" />
            <span>Customers</span>
          </div>
          <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition">
            <FileText className="w-4 h-4 text-emerald-500" />
            <span>Reports</span>
          </div>
        </div>

        {/* Live Bookings List */}
        <div className="mx-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-slate-900">Live Bookings</h3>
            <button className="text-[10px] font-bold text-[#FFB800]">View All</button>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-150 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center text-lg shadow-sm">
                  🚙
                </div>
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

            {/* Actions call/chat */}
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => alert("Dialing customer Tausif Khan (+91 98765 43210)...")}
                className="flex-1 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition text-slate-700"
              >
                <Phone className="w-3.5 h-3.5 text-slate-500" /> Call Client
              </button>
              <button 
                onClick={() => alert("Redirecting to active chat simulator channel...")}
                className="flex-1 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 hover:bg-slate-100 transition text-slate-700"
              >
                <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Send Message
              </button>
            </div>
          </div>
        </div>

        {/* Business Overview Chart */}
        <div className="mx-4 mt-6 bg-white p-4 rounded-2xl border border-slate-150 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Business Overview
            </h3>
            <button className="text-[9px] font-bold text-slate-400">View Report</button>
          </div>

          {/* SVG Line Chart */}
          <div className="relative pt-2">
            <div className="absolute top-0 left-0 text-[8px] text-slate-400 font-semibold font-mono space-y-7">
              <p>50K</p>
              <p>25K</p>
              <p>0</p>
            </div>
            
            <div className="h-28 ml-8 border-l border-b border-slate-100 relative">
              <svg className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FFB800" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#FFB800" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Area Fill */}
                <path 
                  d={`${chartPath} L 350,110 L 30,110 Z`} 
                  fill="url(#chartGlow)" 
                  className="transition-all duration-500"
                />
                {/* Stroke Line */}
                <path 
                  d={chartPath} 
                  fill="none" 
                  stroke="#FFB800" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                {/* Endpoint Node */}
                <circle cx="350" cy="50" r="5" fill="#FFB800" stroke="white" strokeWidth="2" />
              </svg>
            </div>

            <div className="flex justify-between text-[8px] text-slate-400 font-bold font-mono ml-8 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Top Services checklist list */}
        <div className="mx-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-black text-slate-900">Top Services</h3>
            <button className="text-[10px] font-bold text-slate-400">View All</button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto py-1 custom-scrollbar">
            {[
              { label: 'Breakdown', value: 42, icon: Wrench },
              { label: 'Towing', value: 28, icon: Car },
              { label: 'Battery', value: 25, icon: Wrench },
              { label: 'Flat Tyre', value: 20, icon: Wrench },
              { label: 'Fuel Delivery', value: 13, icon: Wrench }
            ].map((srv, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-150 shadow-sm text-center min-w-[76px] space-y-1">
                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-700">
                  <srv.icon className="w-4 h-4 text-slate-550" />
                </div>
                <p className="text-[8px] text-slate-400 font-bold block uppercase">{srv.label.split(' ')[0]}</p>
                <p className="text-xs font-black text-slate-900">{srv.value}</p>
              </div>
            ))}
          </div>
        </div>

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
