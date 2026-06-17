import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileApp } from './pages/MobileApp';
import { 
  User, 
  Wrench, 
  Briefcase, 
  PlusCircle, 
  UserCheck, 
  RefreshCw
} from 'lucide-react';

const DevSimulationConsole = () => {
  const { 
    currentUserRole, 
    setCurrentUserRole, 
    user, 
    addMoneyToWallet, 
    mechanicFleet, 
    verifyMechanicPartner,
    bookings
  } = useApp();

  const [logs, setLogs] = useState<string[]>([
    'System: Velix Dev Console active.',
    'State: Seeded 4 service providers on WEH Highway.',
    'Info: Ready to simulate distress calls.'
  ]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [`[${time}] ${msg}`, ...prev.slice(0, 15)]);
  };

  const handleRoleChange = (role: 'user' | 'mechanic' | 'business' | 'admin') => {
    setCurrentUserRole(role);
    addLog(`Role changed to: ${role.toUpperCase()}`);
  };

  const triggerKycApproval = () => {
    const pending = mechanicFleet.find(m => m.status === 'pending');
    if (pending) {
      verifyMechanicPartner(pending.id, 'approved');
      addLog(`Approved KYC for partner: ${pending.name}`);
    } else {
      verifyMechanicPartner('my-mobile-mech', 'approved');
      addLog(`Forced debug approval for mobile mechanic partner.`);
    }
  };

  const triggerWalletRefill = () => {
    addMoneyToWallet(1000);
    addLog(`Simulated wallet credit of ₹1,000 to ${user.name}.`);
  };

  // Listen to bookings length updates to log booking dispatches
  useEffect(() => {
    if (bookings.length > 0) {
      const latest = bookings[0];
      addLog(`Job Alert: ${latest.service} requested at ${latest.time} - Status: ${latest.status}`);
    }
  }, [bookings.length]);

  return (
    <div className="hidden lg:flex flex-col w-80 bg-slate-950 border-r border-slate-800 text-slate-100 h-screen p-5 justify-between select-none">
      
      {/* Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FFB800] rounded-lg flex items-center justify-center text-slate-950 font-black text-sm">
            V
          </div>
          <h1 className="font-extrabold text-lg tracking-tight text-white">VELIX DEV PANEL</h1>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mobile-Only Simulator Console</p>
      </div>

      {/* Role Switcher */}
      <div className="space-y-2 mt-4">
        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Select Active App view</label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => handleRoleChange('user')}
            className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition ${
              currentUserRole === 'user' 
                ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/5' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <div>
              <span className="block font-bold">Customer App</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Book dispatches, SOS, tracking</span>
            </div>
          </button>

          <button
            onClick={() => handleRoleChange('mechanic')}
            className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition ${
              currentUserRole === 'mechanic' 
                ? 'bg-indigo-500/10 border-indigo-505 text-indigo-400 shadow-md shadow-indigo-500/5' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Wrench className="w-4 h-4 shrink-0" />
            <div>
              <span className="block font-bold">Mechanic App</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">Arjun console, dispatches, jobs</span>
            </div>
          </button>

          <button
            onClick={() => handleRoleChange('business')}
            className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-3 transition ${
              currentUserRole === 'business' 
                ? 'bg-emerald-500/10 border-emerald-505 text-emerald-400 shadow-md shadow-emerald-500/5' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <Briefcase className="w-4 h-4 shrink-0" />
            <div>
              <span className="block font-bold">Business Owner App</span>
              <span className="text-[10px] text-slate-500 block mt-0.5">AutoFix Hub, bookings, overview</span>
            </div>
          </button>
        </div>
      </div>

      {/* Simulator Event Controls */}
      <div className="space-y-2.5 mt-4">
        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Simulator Event Triggers</label>
        
        <button
          onClick={triggerWalletRefill}
          className="w-full p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left text-xs font-bold transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4 text-amber-500" />
          <span>Refill Wallet (+₹1,000)</span>
        </button>

        <button
          onClick={triggerKycApproval}
          className="w-full p-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-xl text-left text-xs font-bold transition flex items-center gap-2"
        >
          <UserCheck className="w-4 h-4 text-emerald-500" />
          <span>Approve Pending KYC</span>
        </button>
      </div>

      {/* Live Sim logs */}
      <div className="flex-1 mt-6 border-t border-slate-900 pt-4 flex flex-col min-h-0 justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Simulation Logs</span>
          <button 
            onClick={() => setLogs(['[Cleared Logs]'])}
            className="text-[9px] text-slate-400 hover:text-white flex items-center gap-1 font-bold"
          >
            <RefreshCw className="w-2.5 h-2.5" /> Clear
          </button>
        </div>
        
        <div className="flex-1 bg-slate-950/40 border border-slate-900 rounded-xl p-3 font-mono text-[9px] text-slate-400 space-y-1.5 overflow-y-auto custom-scrollbar leading-relaxed">
          {logs.map((l, i) => (
            <p key={i} className={l.includes('Job Alert') ? 'text-indigo-400 font-bold' : l.includes('changed') ? 'text-amber-400' : ''}>
              {l}
            </p>
          ))}
        </div>
      </div>

      {/* Bottom instructions */}
      <div className="pt-4 border-t border-slate-900 text-[9px] text-slate-500 leading-relaxed font-semibold">
        <p>💡 Open the console log in your browser for deep state analysis.</p>
        <p className="mt-1">To view full screen on mobile devices, open this link directly in Safari or Chrome.</p>
      </div>

    </div>
  );
};

export const AppLayout = () => {
  return (
    <div className="flex h-screen bg-[#0F1015] font-sans overflow-hidden w-full mx-auto select-none relative text-[#0D1117]">
      
      {/* Dev Simulator Panel (Left-aligned) */}
      <DevSimulationConsole />
      
      {/* Main Center Area holding the simulated phone viewport */}
      <main className="flex-1 h-screen overflow-hidden flex items-center justify-center bg-[#0d0f14]">
        <MobileApp />
      </main>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}