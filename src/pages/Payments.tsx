import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CreditCard, Wallet, Plus, ArrowUpRight, ArrowDownLeft, ShieldCheck, ChevronRight, FileText } from 'lucide-react';

export const Payments: React.FC = () => {
  const { user, bookings, addMoneyToWallet } = useApp();
  const [topUpAmount, setTopUpAmount] = useState<string>('500');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(topUpAmount);
    if (!isNaN(amt) && amt > 0) {
      addMoneyToWallet(amt);
      setIsModalOpen(false);
      setTopUpAmount('500');
    }
  };

  // Generate transaction list based on bookings and dummy inputs
  const completedBookings = bookings.filter(b => b.status === 'completed');

  return (
    <div className="p-8 w-full space-y-8 overflow-y-auto h-full custom-scrollbar">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D1117]">Payments & Wallet</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your Velix Wallet, view invoices, and transaction logs.</p>
      </div>

      {/* Wallet overview grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Wallet Balance Card */}
        <div className="bg-[#0D1117] text-white p-6 rounded-3xl relative overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between min-h-[180px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800] rounded-full blur-[60px] opacity-15 -translate-y-1/3 translate-x-1/3"></div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Velix Wallet Balance</span>
              <Wallet className="w-5 h-5 text-[#FFB800]" />
            </div>
            <p className="text-3xl font-extrabold text-white tracking-wide">₹{user.walletBalance.toLocaleString('en-IN')}</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-[#FFB800] text-[#0D1117] py-3 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-[0_4px_12px_rgba(255,184,0,0.25)] flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Money to Wallet
          </button>
        </div>

        {/* Plus savings card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-center mb-3 text-xs text-gray-500 font-bold uppercase tracking-wider">
              <span>Velix Plus Savings</span>
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-[#0d1117]">₹{user.velixPlus.active ? '₹597 saved' : '₹0 saved'}</p>
            <p className="text-xs text-gray-400 mt-2">
              {user.velixPlus.active 
                ? 'Your active plan waives dispatcher visit fees.' 
                : 'Plus members save ₹199-249 on every mechanic callout.'}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/plus'}
            className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all text-center"
          >
            {user.velixPlus.active ? 'View Plus Benefits' : 'Upgrade to Save'}
          </button>
        </div>

        {/* Saved Cards */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col justify-between min-h-[180px]">
          <div>
            <div className="flex justify-between items-center mb-3 text-xs text-gray-500 font-bold uppercase tracking-wider">
              <span>Saved Cards</span>
              <CreditCard className="w-5 h-5 text-purple-500" />
            </div>
            <div className="flex items-center gap-3 border border-gray-100 p-2.5 rounded-xl">
              <span className="text-xl">💳</span>
              <div>
                <p className="text-xs font-bold text-gray-800">HDFC Mastercard **** 9012</p>
                <p className="text-[10px] text-gray-400">Expires 09/29</p>
              </div>
            </div>
          </div>
          <button className="w-full text-xs font-bold text-[#FFB800] hover:underline text-left">
            + Add new credit/debit card
          </button>
        </div>

      </div>

      {/* Transaction History & Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Transactions log */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 lg:col-span-2 space-y-6 shadow-sm">
          <h3 className="font-extrabold text-base text-[#0D1117]">Transaction Logs</h3>
          
          <div className="divide-y divide-gray-150">
            {completedBookings.map((tx, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0D1117]">Paid to {tx.mechanicName}</h4>
                    <p className="text-xs text-gray-500">{tx.service} • ID: {tx.id}</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-semibold">{tx.date} • {tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-red-500">-{tx.price}</span>
                  <div className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100 mt-1.5 inline-block">
                    Successful
                  </div>
                </div>
              </div>
            ))}

            {/* Mock deposit tx log */}
            <div className="py-4 flex justify-between items-center last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0D1117]">Added to Wallet</h4>
                  <p className="text-xs text-gray-500">Razorpay Top-up</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-semibold">15 Jun, 2026 • 02:40 PM</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-sm text-green-600">+₹1,000</span>
                <div className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100 mt-1.5 inline-block">
                  Successful
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Invoices checklist */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-sm h-max">
          <h3 className="font-extrabold text-base text-[#0D1117]">Digital Invoices</h3>
          <p className="text-xs text-gray-400">Download digital invoices of completed breakdown services.</p>
          
          <div className="space-y-3">
            {completedBookings.map((inv, idx) => (
              <div key={idx} className="border border-gray-100 p-3.5 rounded-2xl flex items-center justify-between hover:bg-gray-50 cursor-pointer group">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-400 group-hover:text-[#FFB800]" />
                  <div>
                    <h4 className="font-bold text-xs text-[#0D1117]">{inv.id}.pdf</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{inv.date} • {inv.price}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Top up Wallet modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md border border-gray-150 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-lg text-[#0D1117]">Add Money to Wallet</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-[#0D1117] text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTopUp} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Enter Top Up Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-[#0D1117]">₹</span>
                  <input 
                    type="number"
                    min="100"
                    max="10000"
                    placeholder="500"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-black text-[#0D1117] focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]"
                    required
                  />
                </div>
              </div>

              {/* Quick selectors */}
              <div className="grid grid-cols-3 gap-3">
                {['500', '1000', '2000'].map(val => (
                  <button 
                    key={val}
                    type="button"
                    onClick={() => setTopUpAmount(val)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-colors ${
                      topUpAmount === val ? 'bg-[#FFB800] border-[#FFB800] text-[#0D1117]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    +₹{val}
                  </button>
                ))}
              </div>

              <button 
                type="submit"
                className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
              >
                Proceed with Gateway Top Up
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Payments;
