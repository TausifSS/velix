import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home as HomeIcon, CalendarDays, MapPin, Wrench, CreditCard, 
  Car, Crown, Settings, 
  LogOut, ShieldCheck, AlertTriangle, Phone, 
  Send, Plus, ChevronRight, Star, Trash2, ArrowLeft,
  CheckCircle2, ChevronDown, Bell, Sparkles, Map, Share2, User, Search
} from 'lucide-react';

// Import cropped mockup illustrations
import loginIllustration from '../assets/login_illustration.png';
import arrivedIllustration from '../assets/arrived_illustration.png';
import completedIllustration from '../assets/completed_illustration.png';

export const MobileApp: React.FC = () => {
  const {
    user, vehicles, bookings, currentBooking,
    addVehicle, setDefaultVehicle, deleteVehicle, requestMechanic, 
    cancelBooking, completeBooking, addMoneyToWallet, upgradeToVelixPlus,
    addEmergencyContact, removeEmergencyContact
  } = useApp();

  // Screen State
  // Possible screens: splash, onboarding, auth, home, service_category, 
  // mechanic_profile, live_tracking, arrived, payment, rating, sos_screen, bookings, 
  // vehicles, wallet, plus, support, profile, map
  const [screen, setScreen] = useState<string>('splash');
  const [selectedCategory, setSelectedCategory] = useState<string>('breakdown');
  const [selectedMechanic, setSelectedMechanic] = useState<any>(null);
  const [onboardingSlide, setOnboardingSlide] = useState<number>(0);
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [showOtpScreen, setShowOtpScreen] = useState<boolean>(false);
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

  // Auto transition splash screen to onboarding
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // Synchronize screen state based on booking flow transitions
  useEffect(() => {
    if (currentBooking) {
      if (currentBooking.status === 'arrived' && (screen === 'live_tracking' || screen === 'home')) {
        setScreen('arrived');
      } else if (screen === 'home' || screen === 'mechanic_profile' || screen === 'service_category') {
        setScreen('live_tracking');
      }
    }
  }, [currentBooking, currentBooking?.status, screen]);

  // Handle immediate redirection when a booking is cancelled to prevent blank screens
  useEffect(() => {
    if (!currentBooking && ['live_tracking', 'arrived', 'payment', 'rating'].includes(screen)) {
      setScreen('home');
    }
  }, [currentBooking, screen]);

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

  // Onboarding slides data
  const onboardingSlides = [
    {
      title: "Quick Mechanic Dispatch",
      description: "Stranded on road? Get verified mechanics dispatched to your GPS location in minutes.",
      emoji: "🛠️"
    },
    {
      title: "Upfront Transparent Pricing",
      description: "No hidden charges. See breakdown of visit fee and service charge estimates before booking.",
      emoji: "💳"
    },
    {
      title: "Live GPS Tracking & SOS",
      description: "Track your mechanic's live ETA. Tap SOS button to alert nearby helpers & family contacts.",
      emoji: "🚨"
    }
  ];

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

  // Fixed Symmetrical Bottom Nav rendering helper
  const renderBottomNav = (activeTab: string) => (
    <div className="grid grid-cols-5 w-full bg-white border-t border-gray-150 py-3 rounded-b-[36px] shrink-0 text-center z-50">
      <button 
        onClick={() => setScreen('home')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'home' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <HomeIcon className="w-5 h-5" />
        <span className="text-[10px] font-bold">Home</span>
      </button>
      <button 
        onClick={() => setScreen('bookings')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'bookings' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <CalendarDays className="w-5 h-5" />
        <span className="text-[10px] font-bold">Bookings</span>
      </button>
      <button 
        onClick={() => setScreen('sos_screen')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'sos' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center border border-red-200">
          <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
        </div>
        <span className="text-[10px] font-bold text-red-500">SOS</span>
      </button>
      <button 
        onClick={() => setScreen('map')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'map' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Map className="w-5 h-5" />
        <span className="text-[10px] font-bold">Live Map</span>
      </button>
      <button 
        onClick={() => setScreen('profile')}
        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'profile' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </div>
  );

  const showNav = ['home', 'bookings', 'map', 'profile', 'support', 'service_category', 'vehicles', 'wallet', 'plus'].includes(screen);

  return (
    <div className="w-full h-screen bg-[#F5F6F8] md:bg-[#16171d] flex items-center justify-center select-none text-[#0d1117] font-sans">
      {/* Centered mobile screen simulation on desktop, full-bleed on mobile viewports */}
      <div className="w-full h-full md:max-w-[420px] md:h-[840px] md:bg-white md:rounded-[36px] md:shadow-[0_20px_50px_rgba(0,0,0,0.3)] md:border md:border-gray-300 overflow-hidden flex flex-col relative bg-[#F5F6F8]">
        
        {/* Scrollable Screen Body Container */}
        <div className="flex-1 overflow-y-auto bg-[#F5F6F8] flex flex-col min-h-0 text-[#0d1117]">
          
          {/* SCREEN: Splash */}
          {screen === 'splash' && (
            <div className="flex-1 bg-white flex flex-col justify-between p-6">
              <div className="text-center my-auto space-y-6">
                {/* Logo */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#FFF9E5] rounded-2xl flex items-center justify-center mb-4 border border-yellow-200">
                    <svg viewBox="0 0 100 100" className="w-10 h-10">
                      <path d="M30 20 L10 80 L35 80 L50 45 Z" fill="#FFB800" />
                      <path d="M70 20 L90 80 L65 80 L50 45 Z" fill="#FFB800" />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-black text-[#0D1117] tracking-tight">VELIX</h1>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">Never Stranded Again.</p>
                </div>

                {/* Tow truck illustration */}
                <div className="py-2">
                  <svg viewBox="0 0 300 150" className="w-64 h-32 mx-auto text-[#0D1117]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="120" x2="290" y2="120" stroke="#E5E7EB" strokeWidth="3" />
                    <path d="M120 70 h60 l20 20 h30 l10 30 h-120 z" fill="#0D1117" />
                    <path d="M185 75 l10 12 h15 l-5 -12 z" fill="#FFB800" opacity="0.8" />
                    <circle cx="140" cy="120" r="14" fill="#E5E7EB" stroke="#0D1117" strokeWidth="4" />
                    <circle cx="210" cy="120" r="14" fill="#E5E7EB" stroke="#0D1117" strokeWidth="4" />
                    <line x1="120" y1="90" x2="80" y2="70" stroke="#0D1117" strokeWidth="4" />
                    <line x1="80" y1="70" x2="60" y2="90" stroke="#0D1117" strokeWidth="2" />
                    <path d="M30 95 h40 l10 -15 h20 l5 15 h10 v15 h-85 z" fill="#FFB800" />
                    <circle cx="45" cy="115" r="9" fill="#E5E7EB" stroke="#FFB800" strokeWidth="3" />
                    <circle cx="85" cy="115" r="9" fill="#E5E7EB" stroke="#FFB800" strokeWidth="3" />
                  </svg>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-[#0D1117]">One Tap. Instant Help.</h3>
                  <p className="text-gray-500 text-xs font-semibold">Anywhere, Anytime.</p>
                </div>
              </div>
              <div className="text-center text-[9px] text-gray-400 font-bold uppercase tracking-wider shrink-0">
                VELIX APP V1.0
              </div>
            </div>
          )}

          {/* SCREEN: Onboarding */}
          {screen === 'onboarding' && (
            <div className="flex-1 bg-white flex flex-col justify-between p-6">
              <div className="flex justify-end">
                <button onClick={() => setScreen('auth')} className="text-sm font-bold text-gray-400 hover:text-black">Skip</button>
              </div>

              <div className="text-center my-auto py-10 space-y-6">
                <div className="text-7xl">{onboardingSlides[onboardingSlide].emoji}</div>
                <h2 className="text-2xl font-black text-[#0D1117] leading-tight">
                  {onboardingSlides[onboardingSlide].title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed px-4">
                  {onboardingSlides[onboardingSlide].description}
                </p>
              </div>

              <div className="space-y-6">
                {/* Dots indicator */}
                <div className="flex justify-center gap-2">
                  {onboardingSlides.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all duration-300 ${onboardingSlide === idx ? 'w-6 bg-[#FFB800]' : 'w-2 bg-gray-250'}`}
                    />
                  ))}
                </div>

                {/* Navigation Button */}
                {onboardingSlide < 2 ? (
                  <button 
                    onClick={() => setOnboardingSlide(prev => prev + 1)}
                    className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors"
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={() => setScreen('auth')}
                    className="w-full bg-[#FFB800] text-[#0D1117] py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors shadow-md shadow-yellow-500/20"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SCREEN: Auth */}
          {screen === 'auth' && (
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6 mt-2">
                  <svg viewBox="0 0 100 100" className="w-8 h-8">
                    <path d="M30 20 L10 80 L35 80 L50 45 Z" fill="#FFB800" />
                    <path d="M70 20 L90 80 L65 80 L50 45 Z" fill="#FFB800" />
                  </svg>
                  <h1 className="text-xl font-black text-[#0D1117] tracking-tight">VELIX</h1>
                </div>

                {!showOtpScreen ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-[#0D1117]">Welcome to Velix</h2>
                      <p className="text-gray-500 text-xs mt-1 font-medium">Never Stranded Again.</p>
                    </div>

                    {/* Cropped mockup illustration */}
                    <div className="py-2 flex justify-center">
                      <img src={loginIllustration} className="h-32 object-contain" alt="Man standing with yellow car" />
                    </div>

                    {/* Symmetrical Phone Input picker */}
                    <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden items-center p-1 focus-within:border-[#FFB800] focus-within:ring-1 focus-within:ring-[#FFB800]">
                      <div className="flex items-center gap-1 px-3 py-3 select-none text-sm font-bold text-gray-850 border-r border-gray-200 cursor-pointer">
                        <span>+91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <input 
                        type="tel"
                        maxLength={10}
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 bg-transparent font-semibold focus:outline-none text-sm placeholder-gray-400"
                      />
                    </div>

                    <button 
                      onClick={() => {
                        if (mobileNumber.length === 10) {
                          setShowOtpScreen(true);
                        }
                      }}
                      disabled={mobileNumber.length !== 10}
                      className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all ${
                        mobileNumber.length === 10 
                          ? 'bg-[#FFB800] text-[#0D1117] hover:bg-yellow-400 shadow-md shadow-yellow-500/20 active:scale-95' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>

                    {/* Social Login Section */}
                    <div className="space-y-4 pt-4 shrink-0">
                      <div className="flex items-center justify-center gap-3">
                        <div className="h-px bg-gray-200 flex-1"></div>
                        <span className="text-[10px] text-gray-450 font-bold uppercase tracking-wider">or continue with</span>
                        <div className="h-px bg-gray-200 flex-1"></div>
                      </div>
                      <div className="flex justify-center gap-4">
                        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm">
                          <svg viewBox="0 0 24 24" className="w-5 h-5">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                        </button>
                        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm">
                          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-[#0d1117]">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.73-1.2 1.88-1.05 2.99 1.11.09 2.24-.55 3-1.44z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => { setMobileNumber('9876543210'); setShowOtpScreen(true); }}
                          className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-700"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-[#0D1117]">Verify OTP</h2>
                      <p className="text-gray-500 text-xs mt-1">Enter code sent to +91 {mobileNumber.slice(0,5)} {mobileNumber.slice(5)}</p>
                      <p className="text-[#16A34A] text-xs font-bold mt-1.5 bg-green-50 px-2 py-1 rounded inline-block">Hint code: 4812</p>
                    </div>

                    <input 
                      type="tel"
                      maxLength={4}
                      placeholder="Enter 4-digit OTP"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-[#FFB800] focus:ring-1 focus:ring-[#FFB800]"
                    />

                    <button 
                      onClick={() => {
                        if (otpCode === '4812' || mobileNumber === '9876543210') {
                          setScreen('home');
                        } else {
                          alert('Invalid OTP code. Enter 4812');
                        }
                      }}
                      className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
                    >
                      Verify & Log In
                    </button>
                    <button onClick={() => setShowOtpScreen(false)} className="w-full text-xs font-bold text-gray-400 text-center hover:underline">Change Phone Number</button>
                  </div>
                )}
              </div>

              <div className="text-center text-[10px] text-gray-400 font-bold px-4 leading-relaxed shrink-0">
                By continuing, you agree to our <span className="underline cursor-pointer hover:text-gray-600">Terms & Conditions</span> and <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
              </div>
            </div>
          )}

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
                      <p className="text-xs font-bold text-gray-805 flex items-center gap-0.5 max-w-[150px] truncate">
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
                            alert("Additional features include Fuel Delivery, EV Charge Assistance, and Towings.");
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
                {/* Header */}
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
                            <span className="text-[9px] text-gray-405">({mech.reviews})</span>
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
                      className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-md bg-white" 
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
                    <p className="text-xs text-gray-550 leading-relaxed font-semibold">
                      10+ years of experience in car repairs, diagnostics, towing rigs, flat tyres, and breakdown assistance loops.
                    </p>
                  </div>

                  {/* Upfront Pricing */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Upfront Pricing</h4>
                    <div className="flex justify-between bg-gray-50 p-3 rounded-xl text-xs border border-gray-150">
                      <div>
                        <p className="text-gray-550 font-bold">Mechanic Visit Fee</p>
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
                    href={`tel:${selectedMechanic.visitCharge}`} 
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
                {/* Header info */}
                <div className="bg-white p-4 border-b border-gray-100 shadow-sm shrink-0 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-black text-[#0D1117] flex items-center gap-1.5">
                      Live Tracking
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{currentBooking.mechanicName} is on the way</p>
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
                  
                  {/* SVG Route */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 50,250 C 120,220 100,100 200,80 S 250,150 320,100" fill="none" stroke="#16A34A" strokeWidth="4" strokeDasharray="6 6" />
                  </svg>

                  {/* User Blue Dot */}
                  <div className="absolute top-[100px] left-[320px] -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Mechanic Marker Car */}
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
                      <Car className="w-5 h-5 text-green-600" />
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

                  {/* Stepper progress indicator */}
                  <div className="flex justify-between items-center px-2">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${['requested','accepted','onWay','arrived'].includes(currentBooking.status) ? 'bg-green-500' : 'bg-gray-250'}`} />
                      <span className="text-[8px] mt-1 text-gray-500 font-bold">Requested</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${['accepted','onWay','arrived'].includes(currentBooking.status) ? 'bg-green-500' : 'bg-gray-250'}`} />
                      <span className="text-[8px] mt-1 text-gray-500 font-bold">Accepted</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${['onWay','arrived'].includes(currentBooking.status) ? 'bg-green-500' : 'bg-gray-250'}`} />
                      <span className="text-[8px] mt-1 text-gray-500 font-bold">On Way</span>
                    </div>
                    <div className="flex-1 h-0.5 bg-gray-200 mx-1"></div>
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${currentBooking.status === 'arrived' ? 'bg-green-500 animate-ping' : 'bg-gray-250'}`} />
                      <span className="text-[8px] mt-1 text-gray-500 font-bold">Arrived</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      cancelBooking();
                      setScreen('home');
                    }}
                    className="w-full py-3.5 text-red-500 border border-red-100 hover:bg-red-50 transition-colors rounded-xl font-bold text-xs"
                  >
                    Cancel Assistance Request
                  </button>
                </div>
              </div>
            ) : (
              // Fallback spinner if currentBooking becomes null during layout rendering
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB800] mb-4"></div>
                <p className="text-xs text-gray-500 font-semibold">Returning to home...</p>
              </div>
            )
          )}

          {/* SCREEN: Arrived */}
          {screen === 'arrived' && currentBooking && (
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex justify-start">
                <button onClick={() => setScreen('home')} className="p-1 hover:bg-gray-150 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
              </div>

              <div className="text-center my-auto py-6 space-y-6">
                <img src={arrivedIllustration} className="h-44 mx-auto object-contain" alt="Helper waving next to yellow car" />
                
                <div className="space-y-1.5">
                  <h2 className="text-xl font-black text-[#0D1117] leading-tight">
                    {currentBooking.mechanicName} has arrived
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed px-6">
                    Please meet the partner, verify the service OTP <span className="font-extrabold text-[#0D1117] tracking-wider">{currentBooking.otp}</span>, and explain the issue details.
                  </p>
                </div>
              </div>

              <div className="space-y-3 shrink-0">
                <button 
                  onClick={() => setScreen('payment')}
                  className="w-full bg-[#FFB800] text-[#0D1117] py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors shadow-md shadow-yellow-500/20"
                >
                  Start Service
                </button>
                <button 
                  onClick={() => setScreen('support')}
                  className="w-full border border-gray-250 text-gray-700 py-3.5 rounded-xl font-bold text-xs hover:bg-gray-50 flex items-center justify-center gap-1.5"
                >
                  Need Help?
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: Payment */}
          {screen === 'payment' && (
            <div className="flex-1 flex flex-col justify-between bg-white p-4">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-base font-extrabold text-[#0D1117]">Service Completed</h2>
                </div>

                <div className="text-center py-4 space-y-4">
                  <img src={completedIllustration} className="h-28 mx-auto object-contain" alt="Checklist clipboard" />
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-extrabold text-gray-500">How was your experience?</h3>
                    <div className="flex justify-center gap-1 text-2xl text-[#FFB800] cursor-pointer">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <span key={val} onClick={() => setRatingVal(val)}>
                          {ratingVal >= val ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-gray-100 rounded-2xl p-4 space-y-4">
                  {/* Tip selection */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Add a tip for your partner</span>
                    <div className="grid grid-cols-4 gap-2">
                      {[20, 50, 100].map(amt => (
                        <button 
                          key={amt}
                          onClick={() => setTip(tip === amt ? 0 : amt)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                            tip === amt ? 'bg-[#FFB800] border-[#FFB800] text-[#0D1117]' : 'bg-white border-gray-250 text-gray-650'
                          }`}
                        >
                          +₹{amt}
                        </button>
                      ))}
                      <button 
                        onClick={() => setTip(0)} 
                        className={`py-2 rounded-xl text-xs font-semibold border ${tip === 0 ? 'bg-gray-100 border-gray-200 text-gray-700' : 'bg-white border-gray-250 text-gray-400'}`}
                      >
                        No Tip
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-gray-150 pt-3 font-extrabold text-sm text-[#0D1117]">
                    <div>
                      <span>Total Payable</span>
                      <p className="text-[10px] text-[#FFB800] hover:underline font-bold mt-0.5 cursor-pointer">View Details</p>
                    </div>
                    <span className="text-lg">₹{(249 + tip)}</span>
                  </div>
                </div>

              </div>

              <div className="space-y-2 shrink-0">
                <button 
                  onClick={handlePayment}
                  className="w-full bg-[#FFB800] text-[#0D1117] py-4 rounded-xl font-bold text-xs hover:bg-yellow-400 transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  Pay Now
                </button>
              </div>
            </div>
          )}

          {/* SCREEN: Rating (Success transition) */}
          {screen === 'rating' && (
            <div className="flex-1 bg-white p-6 flex flex-col justify-between items-center text-center">
              <div className="my-auto space-y-6">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 border border-green-100 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div>
                  <h2 className="text-lg font-black text-[#0D1117]">Service Completed!</h2>
                  <p className="text-gray-500 text-xs mt-1">Payment successful. Digital Invoice dispatched to your registered address.</p>
                </div>
              </div>

              <button 
                onClick={submitRating}
                className="w-full bg-[#FFB800] text-[#0D1117] py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors shadow-sm"
              >
                Go to Home
              </button>
            </div>
          )}

          {/* SCREEN: SOS Screen */}
          {screen === 'sos_screen' && (
            <div className="flex-1 bg-[#0D1117] text-white p-6 flex flex-col justify-between items-center text-center">
              <div className="w-full flex justify-start">
                <button onClick={() => setScreen('home')} className="p-1 hover:bg-gray-800 rounded-full"><ArrowLeft className="w-5 h-5 text-white" /></button>
              </div>

              <div className="my-auto space-y-8 relative">
                {/* pulsing concentric SOS rings */}
                <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
                  <div className="absolute -inset-4 bg-red-500 rounded-full animate-pulse opacity-10"></div>
                  <div className="w-28 h-28 bg-[#FF4D4F] rounded-full border-4 border-white/20 flex items-center justify-center text-white font-extrabold text-2xl tracking-wider shadow-lg">
                    SOS
                  </div>
                </div>

                <div className="space-y-2 max-w-xs">
                  <h2 className="text-lg font-black text-white">SOS Emergency</h2>
                  <p className="text-xs text-gray-400">We will notify your location to nearest helpers.</p>
                  <div className="flex justify-center gap-2 mt-1">
                    {user.emergencyContacts.map((c, i) => (
                      <span key={i} className="bg-white/10 text-white border border-white/15 text-[9px] px-2 py-0.5 rounded-full font-bold">
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 w-full">
                <button 
                  onClick={() => setScreen('home')}
                  className="w-full bg-[#FF4D4F] text-white py-4 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-md shadow-red-500/20"
                >
                  Cancel SOS
                </button>
                <p className="text-gray-400 text-[10px] font-bold">Don't worry, help is on the way.</p>
              </div>
            </div>
          )}

          {/* SCREEN: Bookings */}
          {screen === 'bookings' && (
            <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
              <div>
                <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
                  <h2 className="text-sm font-black text-[#0D1117]">My Bookings</h2>
                </div>

                {/* Tabs */}
                <div className="bg-white border-b border-gray-200 flex text-center font-bold text-xs shrink-0 select-none">
                  {['upcoming', 'completed', 'cancelled'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setBookingFilter(tab)}
                      className={`flex-1 py-3 capitalize transition-all border-b-2 ${
                        bookingFilter === tab ? 'border-[#FFB800] text-gray-850' : 'border-transparent text-gray-400'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="p-4 space-y-3">
                  {bookings.filter(b => b.status === bookingFilter).map((booking, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-2xl border border-gray-150 shadow-sm flex items-center justify-between">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          <img src={`https://ui-avatars.com/api/?name=${booking.mechanicName.replace(' ', '+')}&background=F5F6F8&color=0D1117`} alt={booking.mechanicName} />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#0D1117]">{booking.mechanicName}</h4>
                          <p className="text-[9px] text-gray-500 mt-0.5">{booking.service}</p>
                          <p className="text-[8px] text-gray-400 font-semibold mt-1">{booking.date} • {booking.time}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-800">{booking.price}</p>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded mt-1.5 inline-block uppercase ${
                          booking.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: Live Service Map */}
          {screen === 'map' && (
            <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8] relative">
              {/* Map search box */}
              <div className="absolute top-4 left-4 right-4 z-30">
                <div className="bg-white px-4 py-3 rounded-2xl shadow-md border border-gray-100 flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search for nearby services..." 
                    className="w-full bg-transparent text-xs font-bold focus:outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Mock map graphic */}
              <div className="flex-1 bg-[#E8EAED] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#E5E5E5] opacity-50" 
                     style={{ 
                       backgroundImage: 'radial-gradient(#c9ccd1 1px, transparent 1px)', 
                       backgroundSize: '20px 20px' 
                     }} />

                {/* SVG Polyline grid */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 0,100 L 420,100 M 0,220 L 420,220 M 0,340 L 420,340 M 100,0 L 100,800 M 260,0 L 260,800" stroke="#FFFFFF" strokeWidth="4" opacity="0.6" />
                  <path d="M 20,400 C 120,380 200,200 350,150" stroke="#FFD166" strokeWidth="10" fill="none" />
                </svg>

                {/* User Location */}
                <div className="absolute top-[300px] left-[200px] -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Helper Pins */}
                {nearbyHelpers.map((mech) => (
                  <div 
                    key={mech.id}
                    onClick={() => setMapSelectedMech(mech)}
                    className="absolute z-20 cursor-pointer -translate-x-1/2 -translate-y-1/2"
                    style={{
                      top: mech.id === '1' ? '180px' : mech.id === '2' ? '380px' : mech.id === '3' ? '250px' : '440px',
                      left: mech.id === '1' ? '120px' : mech.id === '2' ? '300px' : mech.id === '3' ? '80px' : '150px',
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full shadow-md flex items-center justify-center border-2 transition-all ${
                      mapSelectedMech?.name === mech.name ? 'bg-[#0D1117] border-[#FFB800] text-white scale-110' : 'bg-white border-green-500 text-[#0D1117]'
                    }`}>
                      <MapPin className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sheet Drawer for Selected Mechanic */}
              {mapSelectedMech && (
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-2xl border border-gray-150 shadow-xl z-30 animate-in slide-in-from-bottom-5 duration-250 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0D1117] flex items-center gap-1">
                      {mapSelectedMech.name}
                      <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    </h4>
                    <p className="text-[9px] text-gray-500 mt-0.5">ETA: {mapSelectedMech.eta} • {mapSelectedMech.distance}</p>
                    <div className="flex gap-2 items-center mt-1.5 text-[9px] font-bold text-[#FFB800]">
                      <span>★ 4.8</span>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button 
                      onClick={() => handleRequestService(mapSelectedMech)}
                      className="bg-[#FFB800] text-[#0D1117] px-3 py-2 rounded-xl text-[10px] font-bold hover:bg-yellow-400 transition-colors shadow-sm"
                    >
                      Request
                    </button>
                    <button 
                      onClick={() => setMapSelectedMech(null)}
                      className="border border-gray-250 text-gray-400 hover:text-gray-600 px-2.5 rounded-xl text-[10px] font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN: Wallet */}
          {screen === 'wallet' && (
            <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
              <div>
                <div className="bg-white p-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
                  <button onClick={() => setScreen('home')} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
                  <h2 className="text-sm font-black text-[#0D1117]">Velix Wallet</h2>
                </div>

                <div className="p-4 space-y-5">
                  <div className="bg-[#0D1117] text-white p-5 rounded-2xl border border-gray-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB800] rounded-full blur-[60px] opacity-10"></div>
                    <p className="text-xs text-gray-400 font-medium">Available Balance</p>
                    <p className="text-3xl font-black text-white mt-1">₹{user.walletBalance}</p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Top Up Wallet</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {['500', '1000', '2000'].map(amt => (
                        <button 
                          key={amt}
                          onClick={() => setAddWalletAmount(amt)}
                          className={`py-3 rounded-xl text-xs font-bold border transition-colors ${
                            addWalletAmount === amt ? 'bg-[#FFB800] border-[#FFB800] text-[#0D1117]' : 'bg-white border-gray-200 text-gray-600'
                          }`}
                        >
                          +₹{amt}
                        </button>
                      ))}
                    </div>

                    <button 
                      onClick={() => {
                        addMoneyToWallet(parseInt(addWalletAmount) || 0);
                        alert(`Successfully added ₹${addWalletAmount} to Wallet!`);
                      }}
                      className="w-full bg-[#0D1117] text-white py-3.5 rounded-xl font-bold text-xs hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: Support / AI */}
          {screen === 'support' && (
            <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
              <div className="flex flex-col flex-1 min-h-0">
                <div className="bg-[#0D1117] text-white p-3 flex items-center gap-3 shrink-0">
                  <button onClick={() => setScreen('home')} className="p-1"><ArrowLeft className="w-4 h-4 text-white" /></button>
                  <div>
                    <h2 className="text-xs font-black">Velix AI Diagnosis Helper</h2>
                    <p className="text-[9px] text-yellow-400">Describe vehicle issue, e.g. "car flat tyre"</p>
                  </div>
                </div>

                {/* Dialogues */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                  {aiChat.map((msg, idx) => (
                    <div 
                      key={idx} 
                      className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                        msg.sender === 'user' 
                          ? 'bg-[#0d1117] text-white ml-auto rounded-tr-sm' 
                          : 'bg-white border border-gray-150 text-gray-800 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleAiDiagnosisSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Describe issue (e.g. car won't start...)"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-[#FFB800]"
                  />
                  <button 
                    type="submit"
                    className="bg-[#FFB800] text-[#0D1117] w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* SCREEN: Profile */}
          {screen === 'profile' && (
            <div className="flex-1 flex flex-col justify-between bg-[#F5F6F8]">
              <div className="overflow-y-auto">
                <div className="bg-white p-5 border-b border-gray-150 flex flex-col items-center text-center shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full border-2 border-[#FFB800] object-cover shadow"
                  />
                  <h3 className="font-extrabold text-sm text-[#0D1117] mt-3">{user.name}</h3>
                  <p className="text-[10px] text-gray-500">{user.phone}</p>
                  
                  {user.velixPlus.active ? (
                    <span className="bg-yellow-50 text-[#FFB800] text-[9px] px-2.5 py-1 rounded-full font-bold mt-2 uppercase tracking-wide border border-yellow-100">
                      ★ Velix Plus Member
                    </span>
                  ) : (
                    <button 
                      onClick={() => setScreen('plus')}
                      className="bg-[#0D1117] text-white text-[9px] px-2.5 py-1 rounded-full font-bold mt-2 hover:bg-gray-800"
                    >
                      Upgrade to Plus
                    </button>
                  )}
                </div>

                <div className="p-4 space-y-4">
                  
                  {/* Garage quick link */}
                  <div 
                    onClick={() => {
                      setScreen('vehicles');
                    }}
                    className="bg-white p-3.5 rounded-2xl border border-gray-150 flex items-center justify-between shadow-sm cursor-pointer hover:shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Car className="w-5 h-5 text-gray-600" />
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-800">My Garage</h4>
                        <p className="text-[9px] text-gray-400">{vehicles.length} Vehicles Registered</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Plus benefits card */}
                  <div 
                    onClick={() => setScreen('plus')}
                    className="bg-white p-3.5 rounded-2xl border border-gray-150 flex items-center justify-between shadow-sm cursor-pointer hover:shadow"
                  >
                    <div className="flex items-center gap-3">
                      <Crown className="w-5 h-5 text-[#FFB800]" />
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-805">Velix Plus Club</h4>
                        <p className="text-[9px] text-gray-400">View premium perks & subscriptions</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>

                  {/* Family Contacts for alerts */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-sm space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                      <h4 className="text-xs font-extrabold text-gray-700">Family Alert Sharing</h4>
                      <span className="text-[9px] text-gray-400">Auto notified on SOS</span>
                    </div>

                    <div className="space-y-2">
                      {user.emergencyContacts.map((contact, i) => (
                        <div key={i} className="flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-[#0D1117]">{contact.name}</p>
                            <p className="text-[9px] text-gray-500">{contact.phone}</p>
                          </div>
                          <button 
                            onClick={() => removeEmergencyContact(contact.phone)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-gray-100/50">
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
                    onClick={() => {
                      setMobileNumber('');
                      setOtpCode('');
                      setShowOtpScreen(false);
                      setScreen('auth');
                    }}
                    className="w-full py-3 text-red-500 font-extrabold text-xs border border-red-100 hover:bg-red-50 transition-colors rounded-2xl flex items-center justify-center gap-1 bg-white shadow-sm"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* SCREEN: Vehicles Garage */}
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
                          <p className="text-[9px] text-gray-400 font-semibold">{v.color} • {v.fuel}</p>
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

                  {/* Add vehicle form */}
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
                          className="w-full bg-[#0D1117] text-white py-2 rounded-xl font-bold"
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

          {/* SCREEN: Velix Plus */}
          {screen === 'plus' && (
            <div className="flex-1 flex flex-col justify-between bg-[#0D1117] text-white p-4">
              <div>
                <div className="flex justify-between items-center mb-6 shrink-0">
                  <button onClick={() => setScreen('profile')} className="p-1 text-white hover:bg-gray-800 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
                  <Crown className="w-6 h-6 text-[#FFB800] animate-pulse" />
                </div>

                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-xl font-black text-white">Upgrade to Velix Plus</h2>
                  <p className="text-xs text-gray-400 px-4">Get absolute peace of mind on Indian roads with elite roadside cover.</p>
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

        </div>

        {/* Root Level Symmetrical Bottom Navigation Bar - Fixed & centered, never scrolls */}
        {showNav && renderBottomNav(
          screen === 'home' ? 'home' :
          screen === 'bookings' ? 'bookings' :
          screen === 'sos_screen' ? 'sos' :
          screen === 'map' ? 'map' :
          screen === 'profile' ? 'profile' : ''
        )}

      </div>
    </div>
  );
};

export default MobileApp;
