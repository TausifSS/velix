import React from 'react';
import { useApp } from '../context/AppContext';
import { Ticket, Tag, Sparkles, Crown } from 'lucide-react';

export const Offers: React.FC = () => {
  const { user } = useApp();

  const coupons = [
    {
      code: 'VELIXFREE',
      discount: '100% Off Visit Charge',
      description: 'First dispatcher callout visit fee waived completely.',
      expiry: '31 Dec, 2026',
      iconColor: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      code: 'JUMPSTART50',
      discount: '50% Off Battery Boost',
      description: 'Get half off on your next scheduled battery jumpstart service.',
      expiry: '30 Sep, 2026',
      iconColor: 'text-[#FFB800]',
      bgColor: 'bg-yellow-50'
    },
    {
      code: 'TOWINGFAST',
      discount: '₹200 Off Towing',
      description: 'Applicable on towing request distances exceeding 15km.',
      expiry: '31 Aug, 2026',
      iconColor: 'text-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="p-8 w-full space-y-8 overflow-y-auto h-full custom-scrollbar">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0D1117]">Offers & Coupons</h1>
        <p className="text-gray-500 text-sm mt-1">Get discounts on callout visit charges and premium services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Active Coupons */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-base text-[#0D1117] flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#FFB800]" /> Active Promo Coupons
          </h3>

          <div className="space-y-4">
            {coupons.map((coupon, idx) => (
              <div 
                key={idx}
                className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow transition-shadow relative overflow-hidden"
              >
                {/* Decorative cutouts to look like a ticket */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-[#F5F6F8] -translate-y-1/2 border-r border-gray-200"></div>
                <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-[#F5F6F8] -translate-y-1/2 border-l border-gray-200"></div>

                <div className="flex gap-4 items-start pl-3">
                  <div className={`p-3 rounded-2xl shrink-0 ${coupon.bgColor}`}>
                    <Tag className={`w-6 h-6 ${coupon.iconColor}`} />
                  </div>
                  <div>
                    <span className="bg-gray-100 text-gray-700 text-[10px] font-black px-2 py-0.5 rounded border border-gray-200">
                      {coupon.code}
                    </span>
                    <h4 className="font-extrabold text-sm text-[#0D1117] mt-2">{coupon.discount}</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-[250px]">{coupon.description}</p>
                    <p className="text-[9px] text-gray-400 font-semibold mt-2">Valid till {coupon.expiry}</p>
                  </div>
                </div>

                <button 
                  onClick={() => alert(`Coupon "${coupon.code}" copied! It will auto-apply on payment checkout.`)}
                  className="bg-gray-50 hover:bg-[#FFF9E5] text-gray-600 hover:text-[#FFB800] px-4 py-2 rounded-xl text-xs font-bold border border-gray-150 transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Plus Perks advertising */}
        <div className="bg-[#0D1117] text-white p-8 rounded-3xl relative overflow-hidden border border-gray-800 shadow-xl flex flex-col justify-between h-max">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800] rounded-full blur-[100px] opacity-15 -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="space-y-6">
            <div className="flex gap-3 items-center">
              <div className="bg-[#FFF9E5] p-3 rounded-2xl text-[#0D1117]">
                <Crown className="w-8 h-8 text-[#FFB800]" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-1.5">
                  Velix Plus Membership
                </h3>
                <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Uncapped Perks & Flat Rates</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Why collect single coupons when you can get flat waivers? Velix Plus members bypass visit charges entirely and get complementary towing limits.
            </p>

            <ul className="space-y-3.5 text-xs text-gray-300">
              <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-[#FFB800]" /> Zero Dispatch Visit Fees (Unlimited)</li>
              <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-[#FFB800]" /> Free Towing limits up to 50 Kilometers</li>
              <li className="flex items-center gap-3"><Sparkles className="w-4 h-4 text-[#FFB800]" /> Dedicated premium priority assistance queue</li>
            </ul>
          </div>

          <button 
            onClick={() => window.location.href = '/plus'}
            className="w-full bg-[#FFB800] text-[#0D1117] py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all shadow-md mt-8 shadow-yellow-500/20"
          >
            {user.velixPlus.active ? 'You Are A Member ✓' : 'Upgrade Annual Pass Now'}
          </button>
        </div>

      </div>

    </div>
  );
};

export default Offers;
