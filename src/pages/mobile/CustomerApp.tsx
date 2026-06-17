import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, Wrench, CreditCard, 
  Car, Crown, Settings, LogOut, ShieldCheck, Phone, 
  Send, Plus, ChevronRight, Star, Trash2, ArrowLeft,
  ChevronDown, Bell, Sparkles, Map, Share2, Search
} from 'lucide-react';

// Import cropped mockup illustrations
import arrivedIllustration from '../../assets/arrived_illustration.png';
import completedIllustration from '../../assets/completed_illustration.png';

interface CustomerAppProps {
  screen: string;
  setScreen: (scr: string) => void;
}

export const CustomerApp: React.FC<CustomerAppProps> = ({ screen, setScreen }) => {
  const {
    user, vehicles, bookings, currentBooking,
    addVehicle, setDefaultVehicle, deleteVehicle, requestMechanic, 
    cancelBooking, completeBooking, addMoneyToWallet, upgradeToVelixPlus,
    addEmergencyContact, removeEmergencyContact
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('breakdown');
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
  const [tip, setTip] = useState<number>(0);
  const [addWalletAmount, setAddWalletAmount] = useState<string>('500');
  const [newVehicleBrand, setNewVehicleBrand] = useState<string>('');
  const [newVehicleModel, setNewVehicleModel] = useState<string>('');
  const [newVehicleReg, setNewVehicleReg] = useState<string>('');
  const [newVehicleType, setNewVehicleType] = useState<string>('Car');
  const [newVehicleFuel, setNewVehicleFuel] = useState<string>('CNG');
  const [newVehicleColor, setNewVehicleColor] = useState<string>('White');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);
  const [aiInput, setAiInput] = useState<string>('');
  const [aiChat, setAiChat] = useState<any[]>([
    { text: "Hi! Describe your vehicle problem, and I'll suggest causes and safety tips.", sender: 'ai' }
  ]);
  const [newContactName, setNewContactName] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [ratingVal, setRatingVal] = useState<number>(5);
  const [mapSelectedMech, setMapSelectedMech] = useState<any>(null);
  const [bookingFilter, setBookingFilter] = useState<string>('completed');
  const [showExitTrackingModal, setShowExitTrackingModal] = useState<boolean>(false);

  // Synchronize screen state based on booking flow transitions
  useEffect(() => {
    if (currentBooking) {
      if (currentBooking.status === 'arrived' && (screen === 'live_tracking' || screen === 'home')) {
        setScreen('arrived');
      } else if (screen === 'home' || screen === 'mechanic_profile' || screen === 'service_category') {
        setScreen('live_tracking');
      }
    }
  }, [currentBooking, currentBooking?.status, screen, setScreen]);

  // Handle immediate redirection when a booking is cancelled to prevent blank screens
  useEffect(() => {
    if (!currentBooking && ['live_tracking', 'arrived', 'payment', 'rating'].includes(screen)) {
      setScreen('home');
    }
  }, [currentBooking, screen, setScreen]);

  const handleRequestService = (mech: any) => {
    requestMechanic(mech, selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1));
    setScreen('live_tracking');
  };

  const handlePayment = () => {
    completeBooking(tip);
    setScreen('rating');
  };

  const submitRating = () => {
    setTip(0);
    setScreen('home');
  };

  // Mock mechanics list
  const nearbyHelpers = [
    { id: '1', name: 'A1 Car Care', rating: 4.8, reviews: 320, distance: '2.4 km', eta: '6 mins', visitCharge: '₹199', verified: true, services: ['breakdown', 'battery'] },
    { id: '2', name: 'Speedy Rescue', rating: 4.7, reviews: 210, distance: '3.1 km', eta: '8 mins', visitCharge: '₹199', verified: true, services: ['towing', 'breakdown'] },
    { id: '3', name: 'QuickFix Auto', rating: 4.6, reviews: 150, distance: '4.0 km', eta: '10 mins', visitCharge: '₹149', verified: false, services: ['battery', 'tyre'] },
    { id: '4', name: 'Auto Heroes', rating: 4.9, reviews: 412, distance: '1.2 km', eta: '4 mins', visitCharge: '₹249', verified: true, services: ['breakdown', 'towing', 'fuel'] }
  ];

  const categories = [
    { id: 'breakdown', name: 'Breakdown', icon: Wrench, color: 'text-[#F97316]', bg: 'bg-orange-50' },
    { id: 'towing', name: 'Towing', icon: Car, color: 'text-[#3B82F6]', bg: 'bg-blue-50' },
    { id: 'fuel', name: 'Fuel Delivery', icon: Sparkles, color: 'text-[#F59E0B]', bg: 'bg-amber-50' },
    { id: 'battery', name: 'Battery Jumpstart', icon: Sparkles, color: 'text-gray-700', bg: 'bg-gray-100' },
    { id: 'tyre', name: 'Flat Tyre', icon: Settings, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'more', name: 'More Services', icon: Plus, color: 'text-purple-600', bg: 'bg-purple-50' }
  ];

  const handleAiDiagnosisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { text: aiInput, sender: 'user' };
    setAiChat(prev => [...prev, userMsg]);
    
    const query = aiInput.toLowerCase();
    setAiInput('');

    setTimeout(() => {
      let aiText = '';
      if (query.includes('battery') || query.includes('jump') || query.includes('start')) {
        aiText = "🔋 Battery diagnosis: It seems like a discharged battery. Check if dashboard lights are dim. Precautions: Keep hazards on, do not retry cranking repeatedly. I recommend requesting a Battery Jumpstart helper.";
      } else if (query.includes('tyre') || query.includes('puncture') || query.includes('flat')) {
        aiText = "🚗 Flat tyre diagnosis: A puncture or valve leakage. Precautions: Move to the side of the road, engage handbrake. I recommend calling a Flat Tyre repair mechanic.";
      } else if (query.includes('fuel') || query.includes('petrol') || query.includes('diesel') || query.includes('empty')) {
        aiText = "⛽ Out of fuel diagnosis: Engine lacks combustion fuel. Precautions: Park safely off the main highway lane. I recommend booking Fuel Delivery service.";
      } else if (query.includes('smoke') || query.includes('overheat') || query.includes('temp') || query.includes('hot')) {
        aiText = "💨 Overheating engine: Low coolant or fan failure. Warning: Turn off engine immediately, do NOT open the radiator cap while hot. I suggest requesting Towing to nearest service garage.";
      } else {
        aiText = "⚙️ General Breakdown: Listen for clicking noises or check for warning indicators on the cluster dashboard. Precautions: Activate hazard flashers. I recommend initiating a General Breakdown request.";
      }

      setAiChat(prev => [...prev, { text: aiText, sender: 'ai' }]);
    }, 1000);
  };

  return (
    <>
      {/* SCREEN: Home */}
      {screen === 'home' && (
        <div className="flex-1 p-4 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Home Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-[#FFF9E5] border border-yellow-100 flex items-center justify-center text-[#FFB800]">
                  <MapPin className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] text-gray-450 uppercase font-bold tracking-wide">Your Location</p>
                  <p className="text-xs font-bold text-gray-800 flex items-center gap-0.5 max-w-[150px] truncate">
                    WEH Highway, Mumbai <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setScreen('wallet')}
                  className="bg-white px-3 py-1.5 rounded-full border border-gray-200 flex items-center gap-1 shadow-sm"
                >
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  <span className="text-[10px] font-bold text-gray-800">₹{user.walletBalance}</span>
                </button>
                <button onClick={() => alert("No notifications")} className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm relative">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full absolute top-2 right-2"></span>
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Need Help? Prominent Card */}
            <div 
              onClick={() => setScreen('support')}
              className="bg-gradient-to-r from-[#0D1117] to-[#1e2330] p-4 rounded-2xl text-white flex justify-between items-center cursor-pointer shadow-md border border-gray-800"
            >
              <div className="space-y-1.5 max-w-[210px]">
                <span className="bg-[#FFB800] text-[#0D1117] text-[8px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">Need Help?</span>
                <h3 className="font-extrabold text-sm">We are here for you.</h3>
                <p className="text-[9px] text-gray-400">Describe your vehicle issues and let our AI assist you immediately.</p>
              </div>
              <div className="w-10 h-10 bg-[#FFB800] rounded-xl flex items-center justify-center text-[#0D1117] font-black text-lg shadow-sm shadow-yellow-500/20">
                🔧
              </div>
            </div>

            {/* Core Services Grid */}
            <div>
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-wide mb-3">What do you need help with?</h3>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div 
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'more') {
                        alert("Additional services include battery diagnostic scans, cooling assistance, and light bulb swaps.");
                      } else {
                        setSelectedCategory(cat.id);
                        setScreen('service_category');
                      }
                    }}
                    className="bg-white p-3 rounded-2xl border border-gray-200/60 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md active:scale-95 transition-all cursor-pointer min-h-[90px]"
                  >
                    <div className={`p-2.5 rounded-xl ${cat.bg} mb-1.5`}>
                      <cat.icon className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <span className="text-[9px] font-bold text-gray-800 leading-tight">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Providers List */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wide">Nearby Helpers</h3>
                <button onClick={() => { setSelectedCategory('breakdown'); setScreen('service_category'); }} className="text-[10px] font-bold text-[#FFB800] hover:underline">See all</button>
              </div>
              <div className="space-y-3">
                {nearbyHelpers.slice(0,2).map((mech, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setSelectedMechanic(mech);
                      setScreen('mechanic_profile');
                    }}
                    className="bg-white p-3.5 rounded-2xl border border-gray-150 flex justify-between items-center shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-lg overflow-hidden shrink-0">
                        <img src={`https://ui-avatars.com/api/?name=${mech.name.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt={mech.name} />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#0D1117] flex items-center gap-1">
                          {mech.name}
                          {mech.verified && <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>}
                        </h4>
                        <p className="text-[9px] text-gray-500">{mech.eta} away • {mech.distance}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-2.5 h-2.5 text-[#FFB800] fill-[#FFB800]" />
                          <span className="text-[9px] font-bold text-gray-700">{mech.rating}</span>
                          <span className="text-[9px] text-gray-400">({mech.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button className="bg-[#FFB800] hover:bg-yellow-400 text-[#0D1117] text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm">
                        Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: Service Category */}
      {screen === 'service_category' && (
        <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
          <div>
            <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
              <button onClick={() => setScreen('home')} className="p-1 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
              <div className="text-left">
                <h2 className="text-sm font-black text-[#0D1117] capitalize">{selectedCategory} Assistance</h2>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">12 helpers available • 1 Filter</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {nearbyHelpers.map((mech, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSelectedMechanic(mech);
                    setScreen('mechanic_profile');
                  }}
                  className="bg-white p-3.5 rounded-2xl border border-gray-150 flex justify-between items-center shadow-sm cursor-pointer"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={`https://ui-avatars.com/api/?name=${mech.name.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt={mech.name} />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#0D1117] flex items-center gap-1">
                        {mech.name}
                        {mech.verified && <ShieldCheck className="w-3.5 h-3.5 text-green-600" />}
                      </h4>
                      <p className="text-[9px] text-gray-500">{mech.eta} away • {mech.distance}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-[#FFB800] text-xs">★</span>
                        <span className="text-[9px] font-bold text-gray-700">{mech.rating}</span>
                        <span className="text-[9px] text-gray-400">({mech.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 font-medium">Visit Charge</p>
                    <p className="text-xs font-bold text-[#0D1117] mb-1">{mech.visitCharge}</p>
                    <button className="bg-[#FFB800] text-[#0D1117] text-[10px] px-3 py-1.5 rounded-xl font-bold hover:bg-yellow-400 shadow-sm transition-all">
                      Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: Mechanic Profile */}
      {screen === 'mechanic_profile' && selectedMechanic && (
        <div className="flex-1 flex flex-col justify-between bg-white">
          <div className="overflow-y-auto">
            <div className="relative h-28 bg-[#0D1117] flex items-end px-4 py-2 shrink-0">
              <button onClick={() => setScreen('home')} className="absolute top-4 left-4 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full"><ArrowLeft className="w-4 h-4" /></button>
              <button onClick={() => alert("Copied profile details!")} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full"><Share2 className="w-4 h-4" /></button>
              
              <div className="absolute top-4 right-14 bg-green-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Verified
              </div>
            </div>

            <div className="p-4 -mt-10 relative space-y-5 bg-white rounded-t-3xl">
              <div className="flex gap-4 items-end">
                <img 
                  src={`https://ui-avatars.com/api/?name=${selectedMechanic.name.replace(' ', '+')}&background=F5F6F8&color=0D1117`} 
                  alt="Mechanic" 
                  className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-md bg-white animate-in zoom-in-95 duration-200" 
                />
                <div>
                  <h3 className="font-extrabold text-sm text-[#0D1117] flex items-center gap-1">
                    {selectedMechanic.name}
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                  </h3>
                  <p className="text-[10px] text-gray-500">Roadside Specialist Terminal Partner</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center border-y border-gray-150 py-3">
                <div>
                  <p className="text-[9px] text-gray-400 font-medium">Ratings</p>
                  <p className="text-xs font-black text-[#0D1117]">{selectedMechanic.rating} ★</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-medium">ETA</p>
                  <p className="text-xs font-black text-[#0D1117]">{selectedMechanic.eta}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-medium">Distance</p>
                  <p className="text-xs font-black text-[#0D1117]">{selectedMechanic.distance}</p>
                </div>
              </div>

              {/* Services Row */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Services Offered</h4>
                <div className="flex gap-2 overflow-x-auto py-1">
                  {categories.slice(0, 5).map((cat) => (
                    <div key={cat.id} className="flex flex-col items-center p-2 border border-gray-150 rounded-xl bg-gray-50/50 min-w-[65px]">
                      <cat.icon className="w-4 h-4 text-gray-600 mb-1" />
                      <span className="text-[8px] font-bold text-gray-500 whitespace-nowrap">{cat.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About info */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                  Professional diagnostic technician with fully equipped dispatch rig. Specialized in roadside mechanical fixes.
                </p>
              </div>

              {/* Upfront Pricing */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upfront Pricing</h4>
                <div className="flex justify-between bg-gray-50 p-3 rounded-xl text-xs border border-gray-150">
                  <div>
                    <p className="text-gray-650 font-bold">Mechanic Visit Fee</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">(covers dispatcher travel & diagnosis)</p>
                  </div>
                  <p className="font-extrabold text-[#0D1117]">{selectedMechanic.visitCharge}</p>
                </div>
              </div>

            </div>
          </div>

          {/* CTAs */}
          <div className="p-4 border-t border-gray-100 bg-white shrink-0 space-y-2">
            <button 
              onClick={() => handleRequestService(selectedMechanic)}
              className="w-full bg-[#FFB800] text-[#0D1117] py-3.5 rounded-xl font-bold text-xs hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20 uppercase tracking-wider"
            >
              Request Help
            </button>
            <div className="grid grid-cols-2 gap-2">
              <a 
                href={`tel:${user.phone}`} 
                className="border border-gray-250 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" /> Call Partner
              </a>
              <button 
                onClick={() => { setScreen('map'); setMapSelectedMech(selectedMechanic); }}
                className="border border-gray-250 text-gray-700 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Map className="w-3.5 h-3.5" /> View on Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: Live Tracking */}
      {screen === 'live_tracking' && (
        currentBooking ? (
          <div className="flex-1 flex flex-col justify-between bg-white relative">
            <div className="bg-white p-4 border-b border-gray-100 shadow-sm shrink-0 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setShowExitTrackingModal(true)} 
                  className="p-1 hover:bg-gray-100 rounded-full shrink-0"
                >
                  <ArrowLeft className="w-4.5 h-4.5 text-gray-700" />
                </button>
                <div>
                  <h3 className="text-xs font-black text-[#0D1117] flex items-center gap-1.5">
                    Live Tracking
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{currentBooking.mechanicName} is on the way</p>
                </div>
              </div>
              <div className="bg-[#FFF9E5] text-[#FFB800] text-xs font-extrabold px-3 py-1.5 rounded-xl border border-yellow-100">
                {currentBooking.status === 'arrived' ? 'Arrived' : currentBooking.eta}
              </div>
            </div>

            {/* Map Simulation */}
            <div className="flex-1 bg-[#E8EAED] relative overflow-hidden min-h-[300px]">
              <div className="absolute inset-0 bg-[#E5E5E5] opacity-50" 
                   style={{ 
                     backgroundImage: 'radial-gradient(#c9ccd1 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                   }} />
              
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path d="M 50,250 C 120,220 100,100 200,80 S 250,150 320,100" fill="none" stroke="#16A34A" strokeWidth="4" strokeDasharray="6 6" />
              </svg>

              <div className="absolute top-[100px] left-[320px] -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>

              <div 
                className="absolute z-20 transition-all duration-1000"
                style={{
                  top: currentBooking.status === 'requested' ? '250px' :
                       currentBooking.status === 'accepted' ? '230px' :
                       currentBooking.status === 'onWay' ? '90px' : '100px',
                  left: currentBooking.status === 'requested' ? '50px' :
                        currentBooking.status === 'accepted' ? '100px' :
                        currentBooking.status === 'onWay' ? '200px' : '320px',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center border-2 border-green-500">
                  <Car className="w-5 h-5 text-green-600 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Bottom detail card */}
            <div className="bg-white rounded-t-3xl border-t border-gray-150 p-4 shadow-lg shrink-0 space-y-4">
              <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                <div className="flex gap-2.5 items-center">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${currentBooking.mechanicName.replace(' ', '+')}&background=F5F6F8&color=0D1117`} 
                    className="w-10 h-10 rounded-full border object-cover bg-white" 
                    alt="Mechanic"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0D1117]">{currentBooking.mechanicName}</h4>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">{currentBooking.vehicle}</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <a href={`tel:${user.phone}`} className="w-8 h-8 bg-white border border-gray-250 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"><Phone className="w-4 h-4" /></a>
                  <button 
                    onClick={() => {
                      setScreen('map');
                      setMapSelectedMech({
                        name: currentBooking.mechanicName,
                        visitCharge: currentBooking.price,
                        eta: currentBooking.eta,
                        distance: currentBooking.distance,
                        vehicle: currentBooking.vehicle,
                        contact: user.phone
                      });
                    }}
                    className="w-8 h-8 bg-white border border-gray-250 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100"
                  >
                    <Map className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status slider / indicators */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-extrabold">
                  <span className="text-slate-800">Dispatch Status</span>
                  <span className="text-green-600 font-bold">
                    {currentBooking.status === 'requested' ? 'Waiting Acceptance' :
                     currentBooking.status === 'accepted' ? 'Accepted' :
                     currentBooking.status === 'onWay' ? 'Heading Your Way' : 'Arrived'}
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500" 
                    style={{ 
                      width: currentBooking.status === 'requested' ? '10%' :
                             currentBooking.status === 'accepted' ? '30%' :
                             currentBooking.status === 'onWay' ? '70%' : '100%' 
                    }}
                  />
                </div>
              </div>

              {/* Customer OTP Security Check */}
              <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-extrabold text-indigo-900">Security Verification OTP</h4>
                  <p className="text-[10px] text-indigo-500 font-medium">Share this code with the mechanic on arrival</p>
                </div>
                <span className="text-base font-black tracking-widest text-indigo-950 font-mono bg-white border border-indigo-200 px-3 py-1 rounded-xl shadow-sm">
                  {currentBooking.otp}
                </span>
              </div>

              <button 
                onClick={cancelBooking}
                className="w-full text-center text-xs text-red-500 font-bold hover:underline py-1"
              >
                Cancel Service Dispatch
              </button>
            </div>

            {showExitTrackingModal && (
              <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center p-6 z-50 animate-in fade-in duration-200">
                <div className="bg-white rounded-3xl p-6 w-full max-w-[320px] text-center space-y-4 shadow-2xl border border-gray-100">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 text-xl border border-amber-100">⚠️</div>
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-black text-slate-900">Exit Live Tracking?</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">Your emergency dispatch will continue in the background. You can reopen tracking anytime from the home screen.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    <button 
                      onClick={() => setShowExitTrackingModal(false)}
                      className="py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-700 font-bold text-xs rounded-xl transition"
                    >
                      Stay Here
                    </button>
                    <button 
                      onClick={() => {
                        setShowExitTrackingModal(false);
                        setScreen('home');
                      }}
                      className="py-2.5 bg-[#0D1117] hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg transition"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 text-center text-slate-500">
            No active booking currently.
          </div>
        )
      )}

      {/* SCREEN: Arrived */}
      {screen === 'arrived' && currentBooking && (
        <div className="flex-1 bg-white p-5 flex flex-col justify-between text-center">
          <div className="space-y-6 my-auto">
            <h2 className="text-xl font-black text-[#0D1117]">Mechanic Arrived!</h2>
            <img src={arrivedIllustration} className="h-44 object-contain mx-auto animate-bounce" alt="Helper arrived" />
            <p className="text-xs text-gray-500 px-6 leading-relaxed font-semibold">
              {currentBooking.mechanicName} has arrived at your breakdown location. Please share security OTP **{currentBooking.otp}** with the mechanic to initiate vehicle rescue.
            </p>
          </div>

          <button 
            onClick={() => setScreen('payment')}
            className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-md uppercase tracking-wider"
          >
            Review Charges & Pay
          </button>
        </div>
      )}

      {/* SCREEN: Payment Invoice */}
      {screen === 'payment' && currentBooking && (
        <div className="flex-1 bg-white p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black text-[#0D1117] mb-6">Rescue Bill Details</h2>
            
            <div className="space-y-4 text-xs font-semibold">
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-400">Diagnosis & Visit Fee</span>
                <span className="text-gray-800">{currentBooking.visitCharge}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-gray-100">
                <span className="text-gray-400">Labor & Spares Estimate</span>
                <span className="text-gray-800">₹450</span>
              </div>
              
              <div className="space-y-2 py-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Add tip for helper</span>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
                  {[0, 30, 50, 100].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTip(t)}
                      className={`py-2 rounded-xl border transition ${
                        tip === t 
                          ? 'bg-[#FFF9E5] border-[#FFB800] text-[#FFB800]' 
                          : 'bg-white border-gray-200 text-gray-500'
                      }`}
                    >
                      {t === 0 ? 'No Tip' : `₹${t}`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-200 text-sm font-black">
                <span className="text-gray-850">Total Final Bill</span>
                <span className="text-emerald-600">
                  ₹{(parseInt(currentBooking.visitCharge.replace(/\D/g, '')) || 199) + 450 + tip}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handlePayment}
            className="w-full bg-[#16A34A] text-white py-4 rounded-xl font-extrabold text-xs hover:bg-green-600 transition shadow-md uppercase tracking-wider"
          >
            Confirm & Pay Bill
          </button>
        </div>
      )}

      {/* SCREEN: Ratings Feedback */}
      {screen === 'rating' && (
        <div className="flex-1 bg-white p-5 flex flex-col justify-between text-center">
          <div className="space-y-6 my-auto">
            <img src={completedIllustration} className="h-32 object-contain mx-auto" alt="Completed" />
            <div>
              <h2 className="text-xl font-black text-[#0D1117]">Rescue Operation Finished</h2>
              <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">Order ID: #VLX9921</p>
            </div>
            
            <p className="text-xs text-gray-500 font-semibold px-4 leading-relaxed">
              Your vehicle has been successfully rescued. Please rate your helper's service below.
            </p>

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRatingVal(star)}
                  className="text-3xl focus:outline-none"
                >
                  <span className={ratingVal >= star ? "text-[#FFB800]" : "text-gray-250"}>★</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={submitRating}
            className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-md uppercase tracking-wider"
          >
            Submit Review
          </button>
        </div>
      )}

      {/* SCREEN: SOS Emergency screen */}
      {screen === 'sos_screen' && (
        <div className="flex-1 bg-red-650 text-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-200">SOS distress deck</h3>
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
            </div>

            <div className="text-center py-6 space-y-4">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto border border-white/20 relative">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
                <span className="text-4xl">🚨</span>
              </div>
              <div>
                <h2 className="text-xl font-black">Distress Broadcast active</h2>
                <p className="text-[10px] text-red-200 mt-1 font-semibold">Your live coordinates are sent to authorities & family.</p>
              </div>
            </div>

            {/* Contacts notified */}
            <div className="bg-white/10 border border-white/10 rounded-2xl p-4 space-y-3 text-xs">
              <h4 className="text-[10px] text-red-200 font-bold uppercase tracking-wider">Notifying Emergency Contacts</h4>
              {user.emergencyContacts.map((contact, i) => (
                <div key={i} className="flex justify-between items-center font-bold">
                  <span>{contact.name}</span>
                  <span className="text-red-200">{contact.phone}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button 
              onClick={() => alert("Simulating phone call to highway police hotline (1033)")}
              className="w-full bg-white text-red-600 py-3.5 rounded-xl font-bold text-xs hover:bg-gray-50 transition flex items-center justify-center gap-2 shadow"
            >
              <Phone className="w-4 h-4 fill-current" /> Call Highway Police (1033)
            </button>
            <button 
              onClick={() => setScreen('home')}
              className="w-full bg-transparent text-white/80 border border-white/20 py-3 rounded-xl text-xs font-semibold hover:bg-white/5 transition"
            >
              Cancel SOS Broadcast
            </button>
          </div>
        </div>
      )}

      {/* SCREEN: Bookings List */}
      {screen === 'bookings' && (
        <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
          <div>
            <div className="bg-white p-4 border-b border-gray-100 shrink-0">
              <h2 className="text-sm font-black text-[#0D1117]">Roadside Rescues</h2>
              
              {/* Filter Tabs */}
              <div className="flex gap-2 mt-4 text-[10px] font-bold">
                {['completed', 'requested', 'cancelled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setBookingFilter(tab)}
                    className={`px-4 py-2 rounded-xl border capitalize transition ${
                      bookingFilter === tab 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-gray-200 text-gray-500'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-3">
              {bookings.filter(b => b.status === bookingFilter).map((b) => (
                <div key={b.id} className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] text-gray-400 font-mono font-bold">{b.id}</span>
                      <h4 className="text-xs font-extrabold text-[#0D1117] mt-0.5">{b.mechanicName}</h4>
                      <p className="text-[9px] text-gray-400">{b.date} • {b.time}</p>
                    </div>
                    <span className="text-xs font-extrabold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-gray-150">
                      {b.price}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-500">
                    <span>{b.service}</span>
                    <span className={b.status === 'completed' ? 'text-green-600' : 'text-red-500'}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: Vehicles */}
      {screen === 'vehicles' && (
        <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
          <div>
            <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
              <button onClick={() => setScreen('profile')} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
              <h2 className="text-sm font-black text-[#0D1117]">My Vehicles</h2>
            </div>

            <div className="p-4 space-y-4">
              {vehicles.map((v) => (
                <div 
                  key={v.id} 
                  className={`bg-white p-4 rounded-2xl border relative flex justify-between items-center shadow-sm ${
                    v.isDefault ? 'border-[#FFB800] ring-1 ring-[#FFB800]/25' : 'border-gray-150'
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center text-lg shrink-0">
                      🚗
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#0D1117]">{v.brand} {v.model}</h4>
                      <p className="text-[10px] text-gray-500 font-medium tracking-wide">{v.number}</p>
                      <p className="text-[9px] text-gray-405 font-semibold">{v.color} • {v.fuel}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {v.isDefault ? (
                      <span className="bg-green-50 text-green-700 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Default</span>
                    ) : (
                      <button 
                        onClick={() => setDefaultVehicle(v.id)}
                        className="text-[9px] text-[#FFB800] hover:underline font-bold"
                      >
                        Set Default
                      </button>
                    )}
                    <button 
                      onClick={() => deleteVehicle(v.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {showAddVehicleModal ? (
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-inner space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-50 pb-1.5">
                    <h4 className="text-xs font-bold text-gray-700">Add Vehicle</h4>
                    <button onClick={() => setShowAddVehicleModal(false)} className="text-gray-400 hover:text-black text-xs font-bold">Cancel</button>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex gap-2">
                      <input type="text" placeholder="Brand (e.g. Maruti)" value={newVehicleBrand} onChange={(e) => setNewVehicleBrand(e.target.value)} className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFB800]" />
                      <input type="text" placeholder="Model (e.g. Swift)" value={newVehicleModel} onChange={(e) => setNewVehicleModel(e.target.value)} className="w-1/2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFB800]" />
                    </div>
                    <input type="text" placeholder="Plate Reg Number (e.g. MH 12 AB 1234)" value={newVehicleReg} onChange={(e) => setNewVehicleReg(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg uppercase focus:outline-none focus:border-[#FFB800]" />
                    
                    <div className="flex gap-2">
                      <select value={newVehicleType} onChange={(e) => setNewVehicleType(e.target.value)} className="w-1/3 p-2 border border-gray-200 rounded-lg bg-white">
                        <option>Car</option><option>Bike</option><option>EV</option>
                      </select>
                      <select value={newVehicleFuel} onChange={(e) => setNewVehicleFuel(e.target.value)} className="w-1/3 p-2 border border-gray-200 rounded-lg bg-white">
                        <option>CNG</option><option>Petrol</option><option>Diesel</option><option>Electric</option>
                      </select>
                      <input type="text" placeholder="Color" value={newVehicleColor} onChange={(e) => setNewVehicleColor(e.target.value)} className="w-1/3 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFB800]" />
                    </div>

                    <button 
                      onClick={() => {
                        if (newVehicleBrand.trim() && newVehicleReg.trim()) {
                          addVehicle({
                            brand: newVehicleBrand,
                            model: newVehicleModel,
                            number: newVehicleReg,
                            type: newVehicleType,
                            fuel: newVehicleFuel,
                            color: newVehicleColor
                          });
                          setNewVehicleBrand('');
                          setNewVehicleModel('');
                          setNewVehicleReg('');
                          setShowAddVehicleModal(false);
                        }
                      }}
                      className="w-full bg-[#0D1117] text-white py-2.5 rounded-xl font-bold"
                    >
                      Save Vehicle
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setShowAddVehicleModal(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl flex items-center justify-center gap-1.5 text-gray-500 hover:text-black font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Register New Vehicle
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: Wallet */}
      {screen === 'wallet' && (
        <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8] p-4">
          <div>
            <div className="bg-white p-4 border-b border-gray-150 flex items-center gap-3 shrink-0">
              <button onClick={() => setScreen('home')} className="p-1"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
              <h2 className="text-sm font-black text-[#0D1117]">Velix Pay Wallet</h2>
            </div>

            <div className="bg-gradient-to-br from-[#0D1117] to-[#202738] p-5 rounded-2xl text-white mt-4 relative overflow-hidden shadow-md">
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">AVAILABLE BALANCE</span>
                <h3 className="text-3xl font-black text-white">₹{user.walletBalance}</h3>
                <p className="text-[10px] text-gray-400 pt-3">Linked with default UPI: {user.phone.replace(' ', '')}@ybl</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-150 mt-4 space-y-4">
              <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Refill Wallet Cash</h4>
              <div className="flex gap-2">
                {['200', '500', '1000'].map(amt => (
                  <button
                    key={amt}
                    onClick={() => setAddWalletAmount(amt)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold transition ${
                      addWalletAmount === amt 
                        ? 'bg-[#FFF9E5] border-[#FFB800] text-[#FFB800]' 
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  addMoneyToWallet(parseInt(addWalletAmount) || 0);
                  alert(`Successfully refilled ₹${addWalletAmount} using UPI!`);
                }}
                className="w-full bg-[#0D1117] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition"
              >
                Proceed & Pay ₹{addWalletAmount}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: Velix Plus Membership */}
      {screen === 'plus' && (
        <div className="flex-1 flex flex-col justify-between bg-[#0D1117] text-white p-4">
          <div>
            <div className="flex justify-between items-center mb-6 shrink-0">
              <button onClick={() => setScreen('profile')} className="p-1 text-white hover:bg-gray-800 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
              <Crown className="w-6 h-6 text-[#FFB800] animate-pulse" />
            </div>

            <div className="text-center space-y-2 mb-8">
              <h2 className="text-xl font-black text-white">Upgrade to Velix Plus</h2>
              <p className="text-xs text-gray-405 px-4">Get absolute peace of mind on Indian roads with elite roadside cover.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex gap-3">
                <ShieldCheck className="w-5 h-5 text-[#FFB800] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Priority Dispatch Line</h4>
                  <p className="text-[10px] text-gray-400">Average dispatcher arrival in under 15 minutes.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex gap-3">
                <Crown className="w-5 h-5 text-[#FFB800] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Free Towing Credits</h4>
                  <p className="text-[10px] text-gray-400">Up to 50km towing covered fully on breakdown diagnostics.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl flex gap-3">
                <CreditCard className="w-5 h-5 text-[#FFB800] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white">Zero Dispatch Vis. Fee</h4>
                  <p className="text-[10px] text-gray-400">Save ₹199-249 flat dispatcher fee on every single request.</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mt-6 text-center">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Premium Annual Member Pass</p>
              <p className="text-2xl font-black text-[#FFB800] mt-1">₹1,499<span className="text-xs font-medium text-white"> / year</span></p>
              <p className="text-[9px] text-[#16A34A] font-bold mt-0.5">Includes GST • Save 20% compared to monthly</p>
            </div>
          </div>

          <div className="pt-4 shrink-0">
            {user.velixPlus.active ? (
              <button className="w-full bg-[#16A34A] text-white py-4 rounded-xl font-bold text-xs" disabled>
                Velix Plus Active ✓
              </button>
            ) : (
              <button 
                onClick={() => {
                  upgradeToVelixPlus();
                  alert("Congratulations! You are now a Velix Plus Member.");
                }}
                className="w-full bg-[#FFB800] text-[#0D1117] py-4 rounded-xl font-bold text-xs hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20"
              >
                Upgrade & Pay
              </button>
            )}
          </div>
        </div>
      )}

      {/* SCREEN: Support */}
      {screen === 'support' && (
        <div className="flex-1 flex flex-col justify-between bg-white">
          {/* Header */}
          <div className="bg-white p-4 border-b border-gray-150 flex items-center gap-3 shrink-0">
            <button onClick={() => setScreen('home')} className="p-1 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
            <div>
              <h2 className="text-sm font-black text-[#0D1117]">AI Rescue Diagnostics</h2>
              <p className="text-[9px] text-green-600 font-bold uppercase mt-0.5">Velix Copilot Online</p>
            </div>
          </div>

          {/* AI Chat Box */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
            {aiChat.map((msg, i) => (
              <div 
                key={i} 
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                  msg.sender === 'user' 
                    ? 'ml-auto bg-[#0D1117] text-white' 
                    : 'bg-white border border-gray-150 text-gray-750'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Panel */}
          <form onSubmit={handleAiDiagnosisSubmit} className="p-4 border-t border-gray-100 bg-white flex gap-2 shrink-0">
            <input 
              type="text" 
              placeholder="Describe your issue (e.g. engine smoke)" 
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#FFB800]"
            />
            <button type="submit" className="p-3 bg-[#FFB800] text-[#0D1117] rounded-xl hover:bg-yellow-400 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* SCREEN: User Profile */}
      {screen === 'profile' && (
        <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
          <div className="overflow-y-auto">
            <div className="bg-white p-4 border-b border-gray-150 shrink-0">
              <h2 className="text-sm font-black text-[#0D1117]">Account Profile</h2>
            </div>

            <div className="p-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-150 flex items-center gap-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0 font-bold border border-slate-200">
                  TK
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0D1117]">{user.name}</h3>
                  <p className="text-[10px] text-gray-400 font-semibold">{user.phone} • {user.email}</p>
                </div>
              </div>

              {/* Menu items links */}
              <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden divide-y divide-gray-100 shadow-sm text-xs font-bold text-gray-700">
                <button onClick={() => setScreen('vehicles')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3"><Car className="w-4 h-4 text-gray-500" /> Manage Vehicles</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => setScreen('wallet')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3"><CreditCard className="w-4 h-4 text-gray-500" /> Velix Pay Wallet</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => setScreen('plus')} className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                  <span className="flex items-center gap-3"><Crown className="w-4 h-4 text-gray-500" /> Velix Plus Cover</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Emergency Contacts Panel */}
              <div className="bg-white p-4 rounded-2xl border border-gray-150 space-y-4 shadow-sm">
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-wide">Emergency SOS Contacts</h3>
                
                <div className="space-y-2">
                  {user.emergencyContacts.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-xs font-semibold border-b border-gray-50 pb-2">
                      <div>
                        <p className="text-gray-800 font-bold">{c.name}</p>
                        <p className="text-[10px] text-gray-450 mt-0.5">{c.phone}</p>
                      </div>
                      <button 
                        onClick={() => removeEmergencyContact(c.phone)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2 text-xs">
                  <input 
                    type="text" 
                    placeholder="Name" 
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] focus:outline-none"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone" 
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-1/2 p-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      if (newContactName.trim() && newContactPhone.trim()) {
                        addEmergencyContact(newContactName, newContactPhone);
                        setNewContactName('');
                        setNewContactPhone('');
                      }
                    }}
                    className="bg-[#0D1117] text-white px-2.5 rounded-lg text-[10px] font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Sign Out Button */}
              <button 
                onClick={() => setScreen('auth')}
                className="w-full py-3 text-red-500 font-extrabold text-xs border border-red-100 hover:bg-red-50 transition-colors rounded-2xl flex items-center justify-center gap-1 bg-white shadow-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN: Map Fleet */}
      {screen === 'map' && (
        <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8] relative">
          {/* Header Map filter */}
          <div className="absolute top-4 inset-x-4 bg-white p-3 rounded-2xl border border-gray-200 shadow-lg z-10 flex items-center gap-3">
            <button onClick={() => setScreen('home')} className="p-1 hover:bg-gray-100 rounded-full shrink-0">
              <ArrowLeft className="w-4.5 h-4.5 text-gray-700" />
            </button>
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input type="text" placeholder="Search rescue fleet on WEH highway..." className="w-full bg-transparent text-xs font-semibold focus:outline-none placeholder-gray-400" />
          </div>

          {/* Map Grid Canvas */}
          <div className="flex-1 bg-[#E8EAED] relative">
            <div className="absolute inset-0 bg-[#E5E5E5] opacity-50" style={{ backgroundImage: 'radial-gradient(#b4b8c0 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
            
            {/* Rescue Fleet Marker pins on highway */}
            {[
              { name: 'A1 Car Care', top: '150px', left: '120px' },
              { name: 'Speedy Rescue', top: '380px', left: '260px' },
              { name: 'Auto Heroes', top: '220px', left: '190px' }
            ].map((pin, i) => (
              <div 
                key={i} 
                onClick={() => setMapSelectedMech(pin)}
                className="absolute z-10 cursor-pointer -translate-x-1/2 -translate-y-1/2"
                style={{ top: pin.top, left: pin.left }}
              >
                <div className="w-8 h-8 rounded-full bg-white border border-yellow-500 shadow-md flex items-center justify-center relative">
                  <Wrench className="w-4 h-4 text-yellow-600" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white" />
                </div>
              </div>
            ))}

            {/* Custom map detail pop-up card */}
            {mapSelectedMech && (
              <div className="absolute bottom-4 inset-x-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xl z-20 space-y-3 animate-in slide-in-from-bottom-5 duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-[#0D1117]">{mapSelectedMech.name}</h4>
                    <p className="text-[10px] text-gray-500 font-bold mt-0.5">Online Partner • Andheri Zone</p>
                  </div>
                  <button onClick={() => setMapSelectedMech(null)} className="text-gray-400 hover:text-black font-extrabold text-xs">✕</button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedCategory('breakdown');
                      setScreen('service_category');
                    }}
                    className="flex-1 bg-[#FFB800] text-[#0D1117] py-2 rounded-xl text-[10px] font-bold"
                  >
                    Select Services
                  </button>
                  <a href={`tel:+919876543201`} className="px-3 border border-gray-250 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-50"><Phone className="w-3.5 h-3.5" /></a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
