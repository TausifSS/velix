import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, Wrench, Fuel, Settings, 
  MapPin, Star, ShieldCheck, Clock, ChevronRight, Zap
} from 'lucide-react';

const serviceCategories = [
  { id: 'all', name: 'All Services', icon: Settings },
  { id: 'breakdown', name: 'Breakdown', icon: Wrench },
  { id: 'battery', name: 'Battery Jumpstart', icon: Zap },
  { id: 'towing', name: 'Towing', icon: Settings },
  { id: 'fuel', name: 'Fuel Delivery', icon: Fuel },
];

const mockMechanics = [
  {
    id: 1,
    name: 'A1 Car Care',
    rating: 4.8,
    reviews: 320,
    distance: '2.4 km',
    eta: '6 mins',
    visitCharge: '₹199',
    verified: true,
    services: ['breakdown', 'battery']
  },
  {
    id: 2,
    name: 'Speedy Rescue',
    rating: 4.7,
    reviews: 210,
    distance: '3.1 km',
    eta: '8 mins',
    visitCharge: '₹199',
    verified: true,
    services: ['towing', 'breakdown']
  },
  {
    id: 3,
    name: 'QuickFix Auto',
    rating: 4.6,
    reviews: 150,
    distance: '4.0 km',
    eta: '10 mins',
    visitCharge: '₹149',
    verified: false,
    services: ['battery', 'fuel']
  },
  {
    id: 4,
    name: 'Auto Heroes',
    rating: 4.9,
    reviews: 412,
    distance: '1.2 km',
    eta: '4 mins',
    visitCharge: '₹249',
    verified: true,
    services: ['breakdown', 'towing', 'fuel']
  }
];

export const Services: React.FC = () => {
  const { requestMechanic } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Set category filter based on query params from QuickActions redirects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat && serviceCategories.some(c => c.id === cat)) {
      setActiveCategory(cat);
    }
  }, [location.search]);

  const filteredMechanics = mockMechanics.filter(mechanic => {
    const matchesCategory = activeCategory === 'all' || mechanic.services.includes(activeCategory);
    const matchesSearch = mechanic.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleRequestClick = (mech: any) => {
    const categoryName = activeCategory === 'all' ? 'Roadside Assistance' : 
      serviceCategories.find(c => c.id === activeCategory)?.name || 'Roadside Assistance';
    
    requestMechanic(mech, categoryName);
    navigate('/live-tracking');
  };

  return (
    <div className="p-8 w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1117]">Nearby Helpers</h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1 font-medium">
            <MapPin className="w-4 h-4 text-gray-400" /> 
            Western Express Highway, Mumbai
          </p>
        </div>
        
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search mechanics..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800] w-72 bg-white"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap border ${
              activeCategory === cat.id 
                ? 'bg-[#FFB800] text-[#0D1117] border-[#FFB800] shadow-sm font-bold' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#FFB800] hover:text-[#0D1117]'
            }`}
          >
            <cat.icon className="w-4 h-4 shrink-0" />
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMechanics.map((mechanic) => (
          <div key={mechanic.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow group flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${mechanic.name.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt={mechanic.name} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0D1117] flex items-center gap-1">
                      {mechanic.name}
                      {mechanic.verified && <ShieldCheck className="w-4 h-4 text-green-500" />}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Star className="w-3 h-3 text-[#FFB800] fill-[#FFB800]" />
                      <span className="font-semibold text-gray-700">{mechanic.rating}</span>
                      <span>({mechanic.reviews} Reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-[#F5F6F8] p-3 rounded-xl flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase">ETA</p>
                    <p className="font-bold text-sm text-[#0D1117]">{mechanic.eta}</p>
                  </div>
                </div>
                <div className="bg-[#F5F6F8] p-3 rounded-xl flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium uppercase">Distance</p>
                    <p className="font-bold text-sm text-[#0D1117]">{mechanic.distance}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-[10px] text-gray-500 font-medium uppercase">Visit Charge</p>
                <p className="font-bold text-[#0D1117]">{mechanic.visitCharge}</p>
              </div>
              <button 
                onClick={() => handleRequestClick(mechanic)}
                className="bg-[#FFF9E5] text-[#FFB800] hover:bg-[#FFB800] hover:text-[#0D1117] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-1 transition-colors"
              >
                Request <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredMechanics.length === 0 && (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl mt-4">
          <p className="text-gray-500 font-medium">No mechanics found for this service in your area.</p>
        </div>
      )}
    </div>
  );
};

export default Services;