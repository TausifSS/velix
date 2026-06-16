import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Wrench, 
  ShieldAlert, 
  DollarSign, 
  Check, 
  X, 
  ShieldCheck, 
  AlertTriangle,
  Play,
  CheckCircle,
  TrendingUp,
  FileText
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { 
    mechanicFleet, 
    userReports, 
    verifyMechanicPartner,
    addMoneyToWallet,
    bookings
  } = useApp();

  const [activeKycIndex, setActiveKycIndex] = useState<number>(0);
  const [kycFeedProgress, setKycFeedProgress] = useState<'idle' | 'playing' | 'verified'>('idle');

  // Filter pending mechanics
  const pendingMechanics = mechanicFleet.filter(m => m.status === 'pending');
  const activeKycMechanic = pendingMechanics[activeKycIndex] || null;

  // Global KPIs
  const totalFleetSize = mechanicFleet.length;
  const verifiedFleetSize = mechanicFleet.filter(m => m.verified).length;
  const totalReports = userReports.length;
  const pendingReports = userReports.filter(r => r.status === 'pending').length;
  
  // Calculate commission: 20% of completed bookings
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalBookingsValue = completedBookings.reduce((sum, b) => {
    const priceNum = parseInt(b.price.replace(/\D/g, '')) || 0;
    return sum + priceNum;
  }, 0);
  const adminCommissions = Math.floor(totalBookingsValue * 0.20);

  const startVideoKycScan = () => {
    setKycFeedProgress('playing');
    setTimeout(() => {
      setKycFeedProgress('verified');
    }, 4000);
  };

  const handleApprove = (id: string) => {
    verifyMechanicPartner(id, 'approved');
    setKycFeedProgress('idle');
    if (activeKycIndex >= pendingMechanics.length - 1) {
      setActiveKycIndex(0);
    }
  };

  const handleReject = (id: string) => {
    verifyMechanicPartner(id, 'rejected');
    setKycFeedProgress('idle');
    if (activeKycIndex >= pendingMechanics.length - 1) {
      setActiveKycIndex(0);
    }
  };

  const [resolvedReports, setResolvedReports] = useState<string[]>([]);
  const [refundedReports, setRefundedReports] = useState<string[]>([]);

  const handleResolveReport = (reportId: string) => {
    setResolvedReports(prev => [...prev, reportId]);
  };

  const handleRefundUser = (reportId: string, userName: string) => {
    // Refund ₹199 to user wallet
    addMoneyToWallet(199);
    setRefundedReports(prev => [...prev, reportId]);
    setResolvedReports(prev => [...prev, reportId]);
    console.log(`Refunding user ${userName} for report ${reportId}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-slate-100">
      
      {/* Header */}
      <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-md">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-indigo-400" />
          Velix Central Administration Deck
        </h1>
        <p className="text-slate-400 text-sm mt-1">KYC Verifications, Merchant Compliance, & Distress Reports Queue</p>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 block font-medium">TOTAL MERCHANTS</span>
              <span className="text-2xl font-bold text-white mt-1 block">{totalFleetSize}</span>
            </div>
            <span className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Wrench className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
              {verifiedFleetSize} Verified
            </span>
            <span className="text-[10px] text-slate-400">{pendingMechanics.length} Pending KYC</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 block font-medium">PLATFORM COMMISSIONS</span>
              <span className="text-2xl font-bold text-white mt-1 block">₹{adminCommissions || '849'}</span>
            </div>
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>20% service fees on all transactions</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 block font-medium">DISTRESS REPORTS</span>
              <span className="text-2xl font-bold text-white mt-1 block">{totalReports}</span>
            </div>
            <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded">
              {pendingReports} unresolved
            </span>
            <span className="text-[10px] text-slate-400">Tickets in queue</span>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 backdrop-blur-md">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs text-slate-400 block font-medium">RESCUES COMPLETED</span>
              <span className="text-2xl font-bold text-white mt-1 block">{completedBookings.length}</span>
            </div>
            <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>98.6% Response Rate on WEH</span>
          </div>
        </div>

      </div>

      {/* Main Administrative Deck Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Center Column: KYC Onboarding queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                Merchant KYC verification queue ({pendingMechanics.length} applications)
              </h2>
              {pendingMechanics.length > 1 && (
                <div className="flex gap-1.5">
                  {pendingMechanics.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActiveKycIndex(idx); setKycFeedProgress('idle'); }}
                      className={`w-6 h-6 rounded text-xs font-semibold ${
                        idx === activeKycIndex 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {activeKycMechanic ? (
              <div className="space-y-6">
                
                {/* Mechanic Profile Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">APPLICANT PARTNER</span>
                      <h3 className="text-white text-lg font-semibold mt-0.5">{activeKycMechanic.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">Mobile: {activeKycMechanic.phone}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">OFFERED SERVICES</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {activeKycMechanic.services.map((srv: string) => (
                          <span key={srv} className="px-2 py-0.5 bg-slate-900 text-slate-300 text-[10px] rounded border border-slate-800">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 md:border-l md:border-slate-800 md:pl-6">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">AADHAAR CARD NO.</span>
                      <p className="text-white font-mono text-sm mt-0.5">{activeKycMechanic.kyc?.aadhaar || 'Not uploaded'}</p>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">PAN CARD NO.</span>
                      <p className="text-white font-mono text-sm mt-0.5">{activeKycMechanic.kyc?.pan || 'Not uploaded'}</p>
                    </div>
                  </div>
                </div>

                {/* Video KYC stream verification simulation */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">KYC VIDEO VERIFICATION</h4>
                  <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
                    
                    {kycFeedProgress === 'idle' && (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/20">
                          <Play className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-xs text-white font-semibold">Simulated Video Feed Ready</p>
                          <p className="text-[10px] text-slate-400">Click to run match algorithms against uploaded documents</p>
                        </div>
                        <button
                          onClick={startVideoKycScan}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition"
                        >
                          Run Liveness Scan
                        </button>
                      </div>
                    )}

                    {kycFeedProgress === 'playing' && (
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="flex justify-between items-start z-10">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold tracking-wider animate-pulse">
                            SCANNING LIVENESS
                          </span>
                          <span className="text-[10px] font-bold font-mono text-indigo-400 bg-slate-950/80 px-2 py-0.5 rounded">
                            FACIAL MATRIX MATCH: 74%
                          </span>
                        </div>

                        {/* Scanner Laser effect */}
                        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent top-0 animate-bounce shadow-[0_0_8px_rgba(129,140,248,0.8)]" />

                        {/* Centered Outline box */}
                        <div className="w-32 h-32 border border-dashed border-indigo-400/50 rounded-full mx-auto self-center flex items-center justify-center animate-pulse">
                          <div className="w-24 h-24 border border-dashed border-indigo-400/20 rounded-full" />
                        </div>

                        <div className="text-center z-10 bg-slate-950/80 p-2 rounded-lg max-w-xs mx-auto">
                          <p className="text-[10px] text-slate-300">Comparing video speech declaration with Aadhaar card name...</p>
                        </div>
                      </div>
                    )}

                    {kycFeedProgress === 'verified' && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-emerald-400">KYC Verification Succeeded</h4>
                          <p className="text-xs text-slate-300 mt-1 max-w-[280px]">
                            Biometrics align with Aadhaar photograph. User name match score is 98.4%.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approval actions */}
                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => handleApprove(activeKycMechanic.id)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/15"
                  >
                    <Check className="w-4 h-4" /> Approve & Issue Verified Badge
                  </button>
                  <button
                    onClick={() => handleReject(activeKycMechanic.id)}
                    className="py-2.5 px-6 bg-slate-800 hover:bg-rose-500 hover:text-white text-slate-400 rounded-xl text-xs font-bold transition border border-slate-700 flex items-center justify-center gap-1.5"
                  >
                    <X className="w-4 h-4" /> Decline
                  </button>
                </div>

              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
                <Check className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-white font-medium">All applications processed</h4>
                <p className="text-xs text-slate-400 mt-1">No pending mechanic verification tickets left.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: User distress reports */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-rose-400" />
              Distress & Support Queue
            </h2>

            {userReports.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No reports filed.</p>
            ) : (
              <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
                {userReports.map((report) => {
                  const isResolved = resolvedReports.includes(report.id) || report.status === 'resolved';
                  const isRefunded = refundedReports.includes(report.id);

                  return (
                    <div 
                      key={report.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        isResolved 
                          ? 'bg-slate-950/40 border-slate-900 text-slate-400 opacity-60' 
                          : 'bg-slate-950/80 border-slate-800'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-mono text-slate-500 font-semibold">{report.id}</span>
                          <h4 className="text-white font-bold text-xs mt-0.5">{report.userName}</h4>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold border ${
                          isResolved 
                            ? 'bg-slate-800 text-slate-500 border-slate-700' 
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {isResolved ? 'Resolved' : 'Active'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-2 italic bg-slate-900/40 p-2 rounded border border-slate-800/40">
                        "{report.issue}"
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[10px]">
                        <div>
                          <span className="text-slate-500">Booking ID:</span>
                          <span className="text-slate-300 block font-mono font-medium">{report.bookingId}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Service Garage:</span>
                          <span className="text-slate-300 block font-medium">{report.mechanicName}</span>
                        </div>
                      </div>

                      {!isResolved && (
                        <div className="flex gap-2 mt-4 pt-1">
                          <button
                            onClick={() => handleRefundUser(report.id, report.userName)}
                            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 shadow-md shadow-indigo-600/15"
                          >
                            <DollarSign className="w-3.5 h-3.5" /> Refund ₹199
                          </button>
                          <button
                            onClick={() => handleResolveReport(report.id)}
                            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold transition border border-slate-700"
                          >
                            Resolve
                          </button>
                        </div>
                      )}

                      {isResolved && (
                        <div className="mt-3 text-[10px] flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/5 p-1.5 rounded border border-emerald-500/10 justify-center">
                          <Check className="w-3.5 h-3.5" /> 
                          {isRefunded ? 'Refunded & Closed Successfully' : 'Ticket Marked Resolved'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
