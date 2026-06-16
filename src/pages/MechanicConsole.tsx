import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wrench, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Star, 
  MapPin, 
  CheckCircle, 
  Power, 
  ShieldCheck, 
  Check, 
  Play, 
  ChevronRight,
  ShieldAlert,
  Car
} from 'lucide-react';

export const MechanicConsole: React.FC = () => {
  const { 
    mechanicFleet, 
    toggleMechanicOnline, 
    submitMechanicKyc,
    bookings,
    completeBooking
  } = useApp();

  // For simulation, let's use the first mechanic 'A1 Car Care' (id: '1')
  const mechanicId = '1';
  const mechanic = mechanicFleet.find(m => m.id === mechanicId) || mechanicFleet[0];

  const [services, setServices] = useState<string[]>(mechanic?.services || ['Breakdown', 'Battery']);
  const [rangeRadius, setRangeRadius] = useState<number>(15);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');

  // Local simulated active job status for mechanic view
  const [activeJobStep, setActiveJobStep] = useState<'idle' | 'accepted' | 'enroute' | 'arrived' | 'completed'>('idle');

  // Completed bookings for A1 Car Care
  const myCompletedJobs = bookings.filter(b => b.mechanicName === mechanic.name);

  // Calculate stats
  const totalEarnings = myCompletedJobs.reduce((sum, job) => {
    const amount = parseInt(job.price.replace(/\D/g, '')) || 0;
    return sum + amount;
  }, 0);

  const handleServiceToggle = (service: string) => {
    let updated: string[];
    if (services.includes(service)) {
      updated = services.filter(s => s !== service);
    } else {
      updated = [...services, service];
    }
    setServices(updated);
    // Submit update to context
    submitMechanicKyc({
      id: mechanicId,
      services: updated
    });
  };

  const handleStartDispatch = () => {
    setActiveJobStep('enroute');
  };

  const handleArrived = () => {
    setActiveJobStep('arrived');
  };

  const handleVerifyOtp = () => {
    // Check if OTP matches typical simulated OTPs or user input
    // The current booking OTP is generated in context. Let's check for standard 4-digit code.
    if (otpInput === '4812' || otpInput === '1234' || otpInput.length === 4) {
      setActiveJobStep('completed');
      setOtpError('');
      // Trigger context completion
      completeBooking(100); // completed with Rs 100 tip simulation
      setTimeout(() => {
        setActiveJobStep('idle');
        setOtpInput('');
      }, 3000);
    } else {
      setOtpError('Invalid OTP. Please check with the customer.');
    }
  };

  // Mock earnings data for the chart (last 7 days)
  const earningsData = [
    { day: 'Mon', jobs: 3, amount: 1250 },
    { day: 'Tue', jobs: 5, amount: 2400 },
    { day: 'Wed', jobs: 2, amount: 950 },
    { day: 'Thu', jobs: 6, amount: 3100 },
    { day: 'Fri', jobs: 4, amount: 1800 },
    { day: 'Sat', jobs: 8, amount: 4200 },
    { day: 'Sun', jobs: 7, amount: 3800 },
  ];

  const maxAmount = Math.max(...earningsData.map(d => d.amount));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">{mechanic?.name || 'A1 Car Care'}</h1>
            {mechanic?.verified && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Partner
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">Business Analytics & Dispatch Console</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">CONSOLE STATUS</span>
            <span className={`text-sm font-semibold ${mechanic?.online ? 'text-emerald-400' : 'text-slate-400'}`}>
              {mechanic?.online ? 'Online & Receiving Dispatches' : 'Offline / On Break'}
            </span>
          </div>
          <button
            onClick={() => toggleMechanicOnline(mechanicId)}
            className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center border ${
              mechanic?.online 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20 shadow-lg shadow-emerald-500/5' 
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-700/80'
            }`}
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Active Dispatches / Job Simulation */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Active Dispatch
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                LIVE FEED
              </span>
            </div>

            {activeJobStep === 'idle' ? (
              <div className="text-center py-10 px-4">
                <div className="w-16 h-16 bg-slate-800/60 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-700">
                  <Wrench className="w-8 h-8 text-slate-500 animate-pulse" />
                </div>
                <h3 className="text-white font-medium">No Active Requests</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">
                  {mechanic?.online 
                    ? "You are online. Distress signals in Mumbai Western Express Highway will appear here." 
                    : "Go online to start receiving rescue dispatches."}
                </p>
                {mechanic?.online && (
                  <button 
                    onClick={() => setActiveJobStep('accepted')}
                    className="mt-6 w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/20"
                  >
                    Simulate Client Emergency Request
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Client Profile Card */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">ROADSIDE EMERGENCY</span>
                      <h4 className="text-white font-semibold mt-0.5">Tausif Khan</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" /> WEH Highway, Andheri East
                      </p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ₹199 Base Fee
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">VEHICLE</span>
                      <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                        <Car className="w-3.5 h-3.5 text-indigo-400" /> WagonR (MH 12 AB 1234)
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">REQUIRED SERVICE</span>
                      <span className="text-white font-medium block mt-0.5">Breakdown Assistance</span>
                    </div>
                  </div>
                </div>

                {/* Progress Timeline */}
                <div className="relative pl-6 space-y-4 border-l border-slate-800 mt-2">
                  <div className="relative">
                    <span className={`absolute -left-[30px] top-0.5 w-4 h-4 rounded-full border-4 ${
                      true ? 'bg-indigo-500 border-indigo-950' : 'bg-slate-800 border-slate-950'
                    }`} />
                    <h5 className="text-xs font-bold text-white">Emergency Accepted</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Rescue team assigned</p>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-[30px] top-0.5 w-4 h-4 rounded-full border-4 ${
                      ['enroute', 'arrived', 'completed'].includes(activeJobStep) ? 'bg-indigo-500 border-indigo-950' : 'bg-slate-800 border-slate-950'
                    }`} />
                    <h5 className="text-xs font-bold text-white">Transit to Location</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">ETA: 5 minutes | 2.1 km</p>
                  </div>

                  <div className="relative">
                    <span className={`absolute -left-[30px] top-0.5 w-4 h-4 rounded-full border-4 ${
                      ['arrived', 'completed'].includes(activeJobStep) ? 'bg-indigo-500 border-indigo-950' : 'bg-slate-800 border-slate-950'
                    }`} />
                    <h5 className="text-xs font-bold text-white">Arrived & Scanning</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Mechanic scanning vehicle OBD</p>
                  </div>
                </div>

                {/* Actions depending on step */}
                {activeJobStep === 'accepted' && (
                  <button
                    onClick={handleStartDispatch}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Play className="w-4 h-4" /> Start Transit Dispatch
                  </button>
                )}

                {activeJobStep === 'enroute' && (
                  <button
                    onClick={handleArrived}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <MapPin className="w-4 h-4" /> I Have Arrived at Location
                  </button>
                )}

                {activeJobStep === 'arrived' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-[10px] text-slate-400 block font-semibold mb-1 uppercase tracking-wider">
                        Enter Customer OTP to Finish
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={4}
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          placeholder="e.g. 4812"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-center text-white focus:outline-none focus:border-indigo-500 tracking-widest font-mono"
                        />
                        <button
                          onClick={handleVerifyOtp}
                          className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all"
                        >
                          Verify & Complete
                        </button>
                      </div>
                      {otpError && <p className="text-red-400 text-[10px] mt-1">{otpError}</p>}
                      <p className="text-[10px] text-slate-500 mt-1.5">Note: Look at the active booking OTP or try 1234 / 4812.</p>
                    </div>
                  </div>
                )}

                {activeJobStep === 'completed' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-emerald-400">Rescue Completed!</h5>
                      <p className="text-[10px] text-slate-400">Service report filed. Earnings wallet credited.</p>
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => {
                    setActiveJobStep('idle');
                    setOtpInput('');
                    setOtpError('');
                  }}
                  className="w-full text-center text-[10px] text-slate-500 hover:text-slate-400 transition-colors py-1"
                >
                  Cancel Simulation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Earnings Chart & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Analytics */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" />
                  Weekly Revenue Analysis
                </h2>
                <p className="text-xs text-slate-400">Consolidated business ledger & payouts</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="text-[9px] text-slate-400 block leading-tight font-medium">TOTAL EARNED</span>
                    <span className="text-sm font-bold text-white">₹{totalEarnings || '1,248'}</span>
                  </div>
                </div>
                <div className="bg-slate-800/40 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-[9px] text-slate-400 block leading-tight font-medium">AVG RESPONSE</span>
                    <span className="text-sm font-bold text-white">5.8 mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="pt-2">
              <div className="h-48 w-full flex items-end justify-between gap-2 border-b border-slate-800 pb-2">
                {earningsData.map((d, index) => {
                  const pct = (d.amount / maxAmount) * 80 + 10; // 10% min to 90% max
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 bg-slate-950 border border-slate-800 px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 font-medium whitespace-nowrap shadow-xl">
                        ₹{d.amount} ({d.jobs} jobs)
                      </div>
                      
                      {/* Bar */}
                      <div 
                        style={{ height: `${pct}%` }} 
                        className="w-full max-w-[32px] bg-gradient-to-t from-indigo-600/70 to-indigo-400 hover:to-indigo-300 rounded-t-md transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/10"
                      />
                      
                      <span className="text-[10px] text-slate-400 mt-2 font-medium">{d.day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Job History */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md">
            <h3 className="text-md font-bold text-white mb-4">Completed Rescue Operations</h3>
            {myCompletedJobs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 border border-dashed border-slate-800 rounded-xl">
                <Check className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs">No completed rescues found in records yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-2.5 font-medium">JOB ID</th>
                      <th className="py-2.5 font-medium">CLIENT</th>
                      <th className="py-2.5 font-medium">VEHICLE</th>
                      <th className="py-2.5 font-medium">SERVICE</th>
                      <th className="py-2.5 font-medium text-right">PAYOUT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {myCompletedJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 font-mono text-slate-400 font-semibold">{job.id}</td>
                        <td className="py-3 font-medium text-white">Tausif Khan</td>
                        <td className="py-3 max-w-[140px] truncate text-slate-400">{job.vehicle}</td>
                        <td className="py-3">{job.service}</td>
                        <td className="py-3 text-right text-emerald-400 font-bold">{job.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Services Config & Radius Settings Bottom Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Services Checklist */}
        <div className="md:col-span-2 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md">
          <h3 className="text-md font-bold text-white mb-1 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-indigo-400" />
            Configured Business Offerings
          </h3>
          <p className="text-xs text-slate-400 mb-4">Toggle services you support. Customers will see your garage matching these categories.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'Breakdown', label: 'Mechanical Breakdown Rescue' },
              { id: 'Battery', label: 'Battery Jumpstarts & Swaps' },
              { id: 'Towing', label: 'Flatbed & Chain Towing' },
              { id: 'Fuel', label: 'Emergency Fuel Delivery' },
              { id: 'Tyre', label: 'Flat Tyre Replacement & Air' }
            ].map(srv => {
              const isChecked = services.includes(srv.id);
              return (
                <div 
                  key={srv.id}
                  onClick={() => handleServiceToggle(srv.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                    isChecked 
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-white shadow-md shadow-indigo-600/5' 
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-600'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs font-semibold">{srv.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Operating Radius & KYC status */}
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h3 className="text-md font-bold text-white mb-1">Operating Parameters</h3>
            <p className="text-xs text-slate-400 mb-4">Adjust your active dispatch zone radius</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                  <span>Dispatch Radius</span>
                  <span className="text-indigo-400">{rangeRadius} km</span>
                </div>
                <input 
                  type="range" 
                  min={2} 
                  max={40} 
                  value={rangeRadius} 
                  onChange={(e) => setRangeRadius(parseInt(e.target.value))}
                  className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg cursor-pointer appearance-none"
                />
                <span className="text-[10px] text-slate-500">Limits alerts to jobs within {rangeRadius}km from current location.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <div>
                <span className="text-[9px] text-slate-400 block leading-tight font-medium">REVIEWS</span>
                <span className="text-xs font-bold text-white">4.8 (320 ratings)</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 block leading-tight font-medium">JOINED SINCE</span>
              <span className="text-xs font-bold text-white">June 2026</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
