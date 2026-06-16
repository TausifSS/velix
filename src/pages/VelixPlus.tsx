import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Crown, CheckCircle2, 
  ArrowRight, X
} from 'lucide-react';

export const VelixPlus: React.FC = () => {
  const { user, upgradeToVelixPlus } = useApp();
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');

  const features = [
    { name: 'Priority Mechanic Dispatch', standard: false, plus: true },
    { name: 'Free Towing (Up to 50km)', standard: false, plus: true },
    { name: 'Zero Visit Charges', standard: false, plus: true },
    { name: '24/7 Premium SOS Support', standard: 'Standard', plus: 'Dedicated Line' },
    { name: 'Free Battery Jumpstarts', standard: 'Pay per use', plus: '3 per year' },
    { name: 'Discount on Spare Parts', standard: '0%', plus: '10%' },
  ];

  const handleUpgrade = () => {
    upgradeToVelixPlus();
    alert('Congratulations! You are now a Velix Plus Member.');
  };

  return (
    <div className="p-8 h-full flex flex-col w-full overflow-y-auto custom-scrollbar">
      
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 shrink-0">
        <div className="inline-flex items-center justify-center p-3 bg-yellow-50 rounded-2xl mb-4">
          <Crown className="w-8 h-8 text-[#FFB800]" />
        </div>
        <h1 className="text-4xl font-bold text-[#0D1117] mb-4 tracking-tight">
          Drive with absolute peace of mind.
        </h1>
        <p className="text-gray-500 text-lg">
          Upgrade to Velix Plus and get priority roadside assistance, free towing credits, and zero visit charges whenever you are stranded.
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-10 shrink-0">
        <div className="bg-white border border-gray-200 p-1 rounded-xl inline-flex shadow-sm">
          <button 
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              billingCycle === 'monthly' ? 'bg-[#0D1117] text-white shadow-md' : 'text-gray-500 hover:text-[#0D1117]'
            }`}
          >
            Monthly
          </button>
          <button 
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              billingCycle === 'yearly' ? 'bg-[#0D1117] text-white shadow-md' : 'text-gray-500 hover:text-[#0D1117]'
            }`}
          >
            Yearly
            <span className="bg-[#FFB800] text-[#0D1117] text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-8 w-full mb-16 shrink-0">
        
        {/* Standard Plan */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-[#0D1117] mb-2">Pay As You Go</h3>
            <p className="text-gray-500 text-sm mb-6">Best for occasional drivers</p>
            <div className="mb-8">
              <span className="text-4xl font-bold text-[#0D1117]">₹0</span>
              <span className="text-gray-500">/year</span>
            </div>
            <button className="w-full py-4 rounded-xl font-bold text-[#0D1117] bg-gray-100 hover:bg-gray-200 transition-colors mb-8" disabled>
              {user.velixPlus.active ? 'Available' : 'Current Plan'}
            </button>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-600 text-sm">Access to verified mechanics</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-600 text-sm">Standard SOS Support</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0" />
                <span className="text-gray-600 text-sm">Live GPS Tracking</span>
              </div>
            </div>
          </div>
        </div>

        {/* Velix Plus Plan */}
        <div className="bg-[#0D1117] rounded-3xl p-8 border border-[#0D1117] shadow-xl relative overflow-hidden flex flex-col justify-between transform md:-translate-y-4">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800] rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#FFB800] via-yellow-300 to-[#FFB800]"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Velix Plus
                <Crown className="w-5 h-5 text-[#FFB800]" />
              </h3>
              <span className="bg-[#FFB800]/20 text-[#FFB800] text-xs font-bold px-3 py-1 rounded-full border border-[#FFB800]/30">
                Most Popular
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6">Complete coverage for your vehicle</p>
            <div className="mb-8 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">
                {billingCycle === 'yearly' ? '₹1,499' : '₹149'}
              </span>
              <span className="text-gray-400 pb-1">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
            </div>
            
            {user.velixPlus.active ? (
              <button className="w-full py-4 rounded-xl font-bold text-white bg-green-600 transition-all mb-8 cursor-default flex items-center justify-center gap-2">
                Active Member Pass ✓
              </button>
            ) : (
              <button 
                onClick={handleUpgrade}
                className="w-full py-4 rounded-xl font-bold text-[#0D1117] bg-[#FFB800] hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 transition-all mb-8 flex items-center justify-center gap-2"
              >
                Upgrade Now <ArrowRight className="w-5 h-5" />
              </button>
            )}
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D1117]" />
                </div>
                <span className="text-gray-200 font-medium text-sm">Free Towing (Up to 50km)</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D1117]" />
                </div>
                <span className="text-gray-200 font-medium text-sm">Zero mechanic visit charges</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D1117]" />
                </div>
                <span className="text-gray-200 font-medium text-sm">Priority mechanic dispatch in 5 mins</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#FFB800] flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D1117]" />
                </div>
                <span className="text-gray-200 font-medium text-sm">3 Free Battery Jumpstarts per year</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Compare Features Section */}
      <div className="max-w-4xl mx-auto w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-12 shrink-0">
        <h3 className="text-2xl font-bold text-[#0D1117] mb-8 text-center">Compare Plan Features</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-4 font-bold text-gray-500 w-1/2">Features</th>
                <th className="pb-4 font-bold text-gray-500 w-1/4 text-center">Pay As You Go</th>
                <th className="pb-4 font-bold text-[#FFB800] w-1/4 text-center">Velix Plus Pass</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={index} className="group hover:bg-gray-50 transition-colors">
                  <td className="py-4 border-b border-gray-100 font-medium text-[#0D1117]">
                    {feature.name}
                  </td>
                  <td className="py-4 border-b border-gray-100 text-center text-gray-500">
                    {typeof feature.standard === 'boolean' ? (
                      feature.standard ? <CheckCircle2 className="w-5 h-5 mx-auto text-green-500" /> : <X className="w-5 h-5 mx-auto text-gray-300" />
                    ) : (
                      <span className="text-sm">{feature.standard}</span>
                    )}
                  </td>
                  <td className="py-4 border-b border-gray-100 text-center font-bold text-[#0D1117]">
                    {typeof feature.plus === 'boolean' ? (
                      feature.plus ? <CheckCircle2 className="w-5 h-5 mx-auto text-[#FFB800]" /> : <X className="w-5 h-5 mx-auto text-gray-300" />
                    ) : (
                      <span className="text-sm">{feature.plus}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default VelixPlus;