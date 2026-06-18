import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home as HomeIcon, CalendarDays, AlertTriangle, 
  ArrowLeft, ChevronDown, ChevronRight, Map, User
} from 'lucide-react';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../config/firebase';

// Import modular apps
import { CustomerApp } from './mobile/CustomerApp';
import { BusinessApp } from './mobile/BusinessApp';
import { MechanicApp } from './mobile/MechanicApp';
import loginIllustration from '../assets/login_illustration.png';

export const MobileApp: React.FC = () => {
  const {
    mechanicFleet, verifyMechanicPartner,
    submitMechanicKyc,
    currentUserRole, setCurrentUserRole,
    updateUser
  } = useApp();

  // Screen State
  // Possible screens: splash, onboarding, auth, home, bookings, map, profile, support
  const [screen, setScreen] = useState<string>('splash');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [showOtpScreen, setShowOtpScreen] = useState<boolean>(false);
  const [onboardingSlide, setOnboardingSlide] = useState<number>(0);
  const [partnerType, setPartnerType] = useState<'mechanic' | 'business'>('mechanic');
  const [partnerMode, setPartnerMode] = useState<'login' | 'register'>('login');

  // Firebase auth & API states
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [authError, setAuthError] = useState<string>('');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [partnerIdToken, setPartnerIdToken] = useState<string>('');

  // Custom Business Owner registration inputs
  const [kycGarageName, setKycGarageName] = useState<string>('AutoFix Hub');
  const [kycOwnerName, setKycOwnerName] = useState<string>('Vikram Shah');
  const [kycAddress, setKycAddress] = useState<string>('WEH highway Mile 12, Mumbai');
  const [kycLicenseGst, setKycLicenseGst] = useState<string>('27AADCV9921C1Z4');

  // Mechanic KYC input states
  const [kycName, setKycName] = useState<string>('National Auto Garage');
  const [kycPhone, setKycPhone] = useState<string>('+91 98222 33344');
  const [kycServices, setKycServices] = useState<string[]>(['Breakdown', 'Battery']);
  const [kycAadhaar, setKycAadhaar] = useState<string>('5544 3322 1100');
  const [kycPan, setKycPan] = useState<string>('APXDK9921C');
  const [videoScanStatus, setVideoScanStatus] = useState<'idle' | 'recording' | 'finished'>('idle');

  const myMechanic = mechanicFleet.find(m => m.id === 'my-mobile-mech') || { status: 'none', online: false };

  // Send OTP with Firebase Phone Auth (Invisible reCAPTCHA)
  const sendOtp = async (phone: string) => {
    setAuthError('');
    setIsAuthLoading(true);
    try {
      const formattedPhone = `+91${phone}`;
      
      // Get or create RecaptchaVerifier
      let verifier = (window as any).recaptchaVerifier;
      if (!verifier) {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          },
          'expired-callback': () => {
            setAuthError('reCAPTCHA expired. Please try again.');
          }
        });
        (window as any).recaptchaVerifier = verifier;
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);
      setShowOtpScreen(true);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      let errMsg = 'Failed to send OTP. Please check the phone number or try again later.';
      if (err.message) {
        if (err.message.includes('too-many-requests') || err.code === 'auth/too-many-requests') {
          errMsg = 'Too many requests. Please try again later or use a registered testing phone number.';
        } else {
          errMsg = err.message;
        }
      }
      setAuthError(errMsg);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Verify OTP for Customer & Sync with Backend
  const verifyCustomerOtp = async () => {
    if (!confirmationResult) {
      // Fallback for debug/mock if no session exists (e.g. testing mode)
      if (otpCode === '4812' || mobileNumber === '9876543210') {
        updateUser({ phone: `+91 ${mobileNumber}` });
        setCurrentUserRole('user');
        setScreen('home');
        return;
      }
      setAuthError('No active verification session. Please request OTP again.');
      return;
    }

    setAuthError('');
    setIsAuthLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Call Express sync API on Render
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://velix-myzf.onrender.com';
      const syncRes = await fetch(`${backendUrl}/api/auth/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '',
          email: '',
          role: 'user',
        }),
      });

      if (!syncRes.ok) {
        const errData = await syncRes.json();
        throw new Error(errData.error || 'Failed to sync user profile with server.');
      }

      const syncData = await syncRes.json();
      console.log('User synced:', syncData);

      // Update local AppContext user state
      updateUser({
        name: syncData.profile?.name || '',
        phone: syncData.profile?.phone || user.phoneNumber || `+91 ${mobileNumber}`,
        email: syncData.profile?.email || '',
      });

      setCurrentUserRole('user');
      setScreen('home');
    } catch (err: any) {
      console.error('Error verifying OTP / Syncing:', err);
      setAuthError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Verify OTP for Partner & Check Role on Backend
  const verifyPartnerOtp = async () => {
    if (!confirmationResult) {
      // Fallback for debug/mock if no session exists (e.g. testing mode)
      if (otpCode === '4812' || mobileNumber === '9876543210') {
        if (partnerMode === 'login') {
          setCurrentUserRole(partnerType);
          if (partnerType === 'business') {
            setScreen('business_dashboard');
          } else {
            if (myMechanic.status === 'approved') {
              setScreen('mechanic_dashboard');
            } else {
              setScreen('mechanic_pending');
            }
          }
        } else {
          setScreen('partner_kyc_step1');
        }
        return;
      }
      setAuthError('No active verification session. Please request OTP again.');
      return;
    }

    setAuthError('');
    setIsAuthLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      const user = result.user;
      const idToken = await user.getIdToken();

      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://velix-myzf.onrender.com';

      if (partnerMode === 'login') {
        // Fetch user profile from backend
        const profileRes = await fetch(`${backendUrl}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
          },
        });

        if (!profileRes.ok) {
          if (profileRes.status === 404) {
            throw new Error('No registered partner account found for this phone number. Please choose "Register (New)" instead.');
          }
          const errData = await profileRes.json();
          throw new Error(errData.error || 'Failed to retrieve partner profile.');
        }

        const profileData = await profileRes.json();
        console.log('Partner profile retrieved:', profileData);

        const profile = profileData.profile;
        if (profile.role !== partnerType) {
          throw new Error(`This account is registered as a "${profile.role}", but you selected "${partnerType}". Please select the correct role.`);
        }

        // Update local state
        updateUser({
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
        });

        setCurrentUserRole(partnerType);
        if (partnerType === 'business') {
          setScreen('business_dashboard');
        } else {
          if (myMechanic.status === 'approved') {
            setScreen('mechanic_dashboard');
          } else {
            setScreen('mechanic_pending');
          }
        }
      } else {
        // Registration mode: save ID Token and proceed to onboarding forms
        setPartnerIdToken(idToken);
        setScreen('partner_kyc_step1');
      }
    } catch (err: any) {
      console.error('Error in partner auth:', err);
      setAuthError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Submit KYC Application for Partner and Sync to Backend
  const submitPartnerKyc = async () => {
    setAuthError('');
    setIsAuthLoading(true);
    try {
      const partnerName = partnerType === 'mechanic' ? kycName : kycGarageName;
      const partnerPhone = partnerType === 'mechanic' ? kycPhone : kycPhone || `+91 ${mobileNumber}`;

      // Call submitMechanicKyc to sync local context state
      submitMechanicKyc({
        id: 'my-mobile-mech',
        name: partnerName,
        phone: partnerPhone,
        services: partnerType === 'mechanic' ? kycServices : ['Breakdown', 'Battery', 'Towing', 'Fuel', 'Tyre'],
        aadhaar: kycAadhaar,
        pan: kycPan,
        videoUrl: 'my_kyc_video.mp4'
      });

      // Synchronize profile with Render Express API
      if (partnerIdToken) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://velix-myzf.onrender.com';
        const syncRes = await fetch(`${backendUrl}/api/auth/sync`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${partnerIdToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: partnerName,
            email: '',
            role: partnerType,
          }),
        });

        if (!syncRes.ok) {
          const errData = await syncRes.json();
          throw new Error(errData.error || 'Failed to sync partner profile with server.');
        }

        const syncData = await syncRes.json();
        console.log('Partner profile synced:', syncData);

        // Update local AppContext user state
        updateUser({
          name: syncData.profile?.name || partnerName,
          phone: syncData.profile?.phone || partnerPhone,
        });
      }

      setScreen('partner_pending');
    } catch (err: any) {
      console.error('Error submitting partner KYC sync:', err);
      alert(err.message || 'Failed to submit KYC to backend server. Proceeding locally.');
      setScreen('partner_pending'); // Transition anyway to allow fallback testing
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Auto transition splash screen to onboarding
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [screen]);

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

  // Symmetrical Bottom Nav rendering helper for Customer App
  const renderBottomNav = () => (
    <div className="grid grid-cols-5 w-full bg-white border-t border-gray-150 pt-3.5 pb-6 md:rounded-b-[32px] shrink-0 text-center z-50">
      <button 
        onClick={() => setScreen('home')}
        className={`flex flex-col items-center justify-center gap-1 ${screen === 'home' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <HomeIcon className="w-5 h-5" />
        <span className="text-[10px] font-bold">Home</span>
      </button>
      <button 
        onClick={() => setScreen('bookings')}
        className={`flex flex-col items-center justify-center gap-1 ${screen === 'bookings' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <CalendarDays className="w-5 h-5" />
        <span className="text-[10px] font-bold">Bookings</span>
      </button>
      <button 
        onClick={() => setScreen('sos_screen')}
        className={`flex flex-col items-center justify-center gap-1 ${screen === 'sos_screen' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <div className="w-9 h-9 bg-red-50 rounded-full flex items-center justify-center border border-red-200">
          <AlertTriangle className="w-4.5 h-4.5 text-red-500" />
        </div>
        <span className="text-[10px] font-bold text-red-500">SOS</span>
      </button>
      <button 
        onClick={() => setScreen('map')}
        className={`flex flex-col items-center justify-center gap-1 ${screen === 'map' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <Map className="w-5 h-5" />
        <span className="text-[10px] font-bold">Live Map</span>
      </button>
      <button 
        onClick={() => setScreen('profile')}
        className={`flex flex-col items-center justify-center gap-1 ${screen === 'profile' ? 'text-[#FFB800]' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] font-bold">Profile</span>
      </button>
    </div>
  );

  const showCustomerNav = currentUserRole === 'user' && 
    ['home', 'bookings', 'map', 'profile', 'support', 'service_category', 'vehicles', 'wallet', 'plus'].includes(screen);

  return (
    <div className="w-full h-screen bg-white md:bg-[#EEF0F7] flex items-center justify-center select-none text-[#0d1117] font-sans overflow-hidden">
      {/* Invisible reCAPTCHA container for Firebase auth */}
      <div id="recaptcha-container"></div>

      {/* Responsive layout: Full-bleed on mobile viewports, clean rounded card on desktop */}
      <div className="w-full h-full md:w-[375px] md:h-[812px] md:max-h-[90vh] bg-white rounded-none md:rounded-[32px] border-0 md:border md:border-slate-200/80 shadow-none md:shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col relative shrink-0">
        
        {/* Scrollable Screen Body Container */}
        <div className="flex-1 overflow-y-auto bg-[#F5F6F8] flex flex-col min-h-0 text-[#0d1117]">
          
          {/* SCREEN: Splash */}
          {screen === 'splash' && (
            <div className="flex-1 bg-white flex flex-col justify-between p-6">
              <div className="text-center my-auto space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-[#FFB800] rounded-[24px] flex items-center justify-center shadow-xl shadow-yellow-500/10">
                    <svg viewBox="0 0 100 100" className="w-12 h-12 fill-slate-950">
                      <path d="M30 20 L10 80 L35 80 L50 45 Z" />
                      <path d="M70 20 L90 80 L65 80 L50 45 Z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black text-slate-950 tracking-tight">VELIX</h1>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Emergency Roadside Rescue</p>
                </div>
              </div>
              <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">Crafted for Western Express Highway</p>
            </div>
          )}

          {/* SCREEN: Onboarding */}
          {screen === 'onboarding' && (
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              {/* Skip button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setScreen('auth')}
                  className="text-xs font-bold text-gray-500 hover:text-slate-950"
                >
                  Skip
                </button>
              </div>

              {/* Slider screen */}
              <div className="text-center space-y-8 my-auto">
                <div className="text-8xl">{onboardingSlides[onboardingSlide].emoji}</div>
                <div className="space-y-3 px-4">
                  <h2 className="text-2xl font-black text-slate-905 leading-tight">{onboardingSlides[onboardingSlide].title}</h2>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{onboardingSlides[onboardingSlide].description}</p>
                </div>
              </div>

              {/* Pagination controls */}
              <div className="space-y-6">
                <div className="flex justify-center gap-2">
                  {onboardingSlides.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`h-2 rounded-full transition-all ${onboardingSlide === idx ? 'w-6 bg-[#FFB800]' : 'w-2 bg-gray-250'}`}
                    />
                  ))}
                </div>

                {onboardingSlide < onboardingSlides.length - 1 ? (
                  <button 
                    onClick={() => setOnboardingSlide(prev => prev + 1)}
                    className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
                  >
                    Next
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
                <div className="flex items-center gap-2 mb-4 mt-2">
                  <svg viewBox="0 0 100 100" className="w-8 h-8">
                    <path d="M30 20 L10 80 L35 80 L50 45 Z" fill="#FFB800" />
                    <path d="M70 20 L90 80 L65 80 L50 45 Z" fill="#FFB800" />
                  </svg>
                  <h1 className="text-xl font-black text-[#0D1117] tracking-tight">VELIX</h1>
                </div>

                {!showOtpScreen ? (
                  <div className="space-y-6">
                    {/* Top Clickable Banner for Partner Gate */}
                    <div 
                      onClick={() => {
                        setMobileNumber('');
                        setOtpCode('');
                        setShowOtpScreen(false);
                        setScreen('partner_selection');
                      }}
                      className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center transition cursor-pointer select-none hover:bg-indigo-100/80 active:scale-98"
                    >
                      <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">Business Partner Portal</p>
                      <p className="text-xs font-black text-indigo-950 leading-tight mt-1">Are you a Mechanic or Business Owner? Start business here</p>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl font-black text-[#0D1117]">Welcome to Velix</h2>
                      <p className="text-gray-500 text-xs font-medium">Never Stranded Again.</p>
                    </div>

                    <div className="py-2 flex justify-center">
                      <img src={loginIllustration} className="h-32 object-contain" alt="Welcome to Velix" />
                    </div>

                    <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden items-center p-1 focus-within:border-[#FFB800]">
                      <div className="flex items-center gap-1 px-3 py-3 select-none text-sm font-bold text-gray-700 border-r border-gray-200">
                        <span>+91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                      </div>
                      <input 
                        type="tel"
                        maxLength={10}
                        placeholder="Enter your mobile number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 bg-transparent font-semibold focus:outline-none text-sm placeholder-gray-400 text-slate-800"
                      />
                    </div>

                    {authError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold leading-normal">
                        {authError}
                      </div>
                    )}

                    <button 
                      onClick={() => {
                        if (mobileNumber.length === 10) {
                          sendOtp(mobileNumber);
                        }
                      }}
                      disabled={mobileNumber.length !== 10 || isAuthLoading}
                      className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all flex justify-center items-center gap-2 ${
                        mobileNumber.length === 10 && !isAuthLoading
                          ? 'bg-[#FFB800] text-[#0D1117] hover:bg-yellow-400 shadow-md shadow-yellow-500/20 active:scale-95' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isAuthLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin" />
                          <span>Sending OTP...</span>
                        </>
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-[#0D1117]">Verify OTP</h2>
                      <p className="text-gray-500 text-xs mt-1">Enter code sent to +91 {mobileNumber.slice(0,5)} {mobileNumber.slice(5)}</p>
                      <p className="text-[#16A34A] text-xs font-bold mt-1.5 bg-green-50 px-2 py-1 rounded inline-block">Hint code: 4812 (for testing)</p>
                    </div>

                    <input 
                      type="tel"
                      maxLength={6}
                      placeholder="Enter verification code"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-[#FFB800]"
                    />

                    {authError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold leading-normal">
                        {authError}
                      </div>
                    )}

                    <button 
                      onClick={verifyCustomerOtp}
                      disabled={otpCode.length < 4 || isAuthLoading}
                      className={`w-full py-4 rounded-xl font-bold text-sm transition-colors shadow-md flex justify-center items-center gap-2 ${
                        otpCode.length >= 4 && !isAuthLoading
                          ? 'bg-[#0D1117] text-white hover:bg-gray-800'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isAuthLoading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        'Verify & Log In'
                      )}
                    </button>
                    <button onClick={() => { setShowOtpScreen(false); setAuthError(''); }} className="w-full text-xs font-bold text-gray-400 text-center hover:underline">Change Phone Number</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SCREEN: Partner Selection Gateway */}
          {screen === 'partner_selection' && (
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 mt-2">
                  <button 
                    onClick={() => {
                      setMobileNumber('');
                      setOtpCode('');
                      setShowOtpScreen(false);
                      setScreen('auth');
                    }} 
                    className="p-1 hover:bg-gray-100 rounded-full shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <div>
                    <h2 className="text-sm font-black text-[#0D1117]">Partner selection</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Choose business type</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-900 leading-tight">Start your business on Velix</h3>
                  <p className="text-xs text-gray-550 font-medium">Select your role to register or log in to your account.</p>

                  <div className="space-y-3 pt-2">
                    {/* Option A: Freelance Mechanic */}
                    <div 
                      onClick={() => {
                        setMobileNumber('');
                        setOtpCode('');
                        setShowOtpScreen(false);
                        setPartnerType('mechanic');
                        setScreen('partner_auth');
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-[#FFB800] bg-slate-55/50 hover:bg-white transition cursor-pointer select-none space-y-2 shadow-sm active:scale-98"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-2xl">🛠️</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Freelance Roadside Mechanic</h4>
                        <p className="text-[10px] text-slate-450 mt-1">Receive live rescue dispatches along Western Express Highway and earn directly.</p>
                      </div>
                    </div>

                    {/* Option B: Garage Owner */}
                    <div 
                      onClick={() => {
                        setMobileNumber('');
                        setOtpCode('');
                        setShowOtpScreen(false);
                        setPartnerType('business');
                        setScreen('partner_auth');
                      }}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-[#FFB800] bg-slate-55/50 hover:bg-white transition cursor-pointer select-none space-y-2 shadow-sm active:scale-98"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-2xl">🏬</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Garage / Business Owner</h4>
                        <p className="text-[10px] text-slate-450 mt-1">Onboard multiple mechanics, review workshop statistics, and direct rescue operations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: Partner Authentication Gateway */}
          {screen === 'partner_auth' && (
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6 mt-2">
                  <button 
                    onClick={() => {
                      setMobileNumber('');
                      setOtpCode('');
                      setShowOtpScreen(false);
                      setScreen('partner_selection');
                    }} 
                    className="p-1 hover:bg-gray-100 rounded-full shrink-0"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <div>
                    <h2 className="text-sm font-black text-[#0D1117] capitalize">{partnerType} Portal</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Authentication</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Log In vs Register Toggle */}
                  <div className="bg-gray-100 p-1 rounded-xl grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileNumber('');
                        setOtpCode('');
                        setShowOtpScreen(false);
                        setPartnerMode('login');
                      }}
                      className={`py-2 text-[10px] font-extrabold rounded-lg uppercase tracking-wider transition ${
                        partnerMode === 'login' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'bg-transparent text-gray-400'
                      }`}
                    >
                      Log In (Existing)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileNumber('');
                        setOtpCode('');
                        setShowOtpScreen(false);
                        setPartnerMode('register');
                      }}
                      className={`py-2 text-[10px] font-extrabold rounded-lg uppercase tracking-wider transition ${
                        partnerMode === 'register' 
                          ? 'bg-white text-gray-900 shadow-sm' 
                          : 'bg-transparent text-gray-400'
                      }`}
                    >
                      Register (New)
                    </button>
                  </div>

                  <div className="space-y-1.5 text-center">
                    <h3 className="text-base font-black text-slate-900">
                      {partnerMode === 'login' ? 'Partner Account Log In' : 'Partner Sign Up & KYC'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      Role: {partnerType === 'business' ? 'Business Owner' : 'Mechanic'}
                    </p>
                  </div>

                  {!showOtpScreen ? (
                    <div className="space-y-4 pt-1">
                      <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden items-center p-1 focus-within:border-[#FFB800]">
                        <div className="flex items-center gap-1 px-3 py-3 select-none text-sm font-bold text-gray-700 border-r border-gray-200">
                          <span>+91</span>
                          <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                        </div>
                        <input 
                          type="tel"
                          maxLength={10}
                          placeholder="Enter your partner mobile"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 bg-transparent font-semibold focus:outline-none text-sm placeholder-gray-400 text-slate-800"
                        />
                      </div>

                      {authError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold leading-normal">
                          {authError}
                        </div>
                      )}

                      <button 
                        onClick={() => {
                          if (mobileNumber.length === 10) {
                            sendOtp(mobileNumber);
                          }
                        }}
                        disabled={mobileNumber.length !== 10 || isAuthLoading}
                        className={`w-full py-4 rounded-xl font-extrabold text-sm transition-all flex justify-center items-center gap-2 ${
                          mobileNumber.length === 10 && !isAuthLoading
                            ? 'bg-[#FFB800] text-[#0D1117] hover:bg-yellow-400 shadow-md shadow-yellow-500/20 active:scale-95' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isAuthLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin" />
                            <span>Sending OTP...</span>
                          </>
                        ) : (
                          'Continue'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <p className="text-gray-500 text-xs mt-1">Enter code sent to +91 {mobileNumber.slice(0,5)} {mobileNumber.slice(5)}</p>
                        <p className="text-[#16A34A] text-xs font-bold mt-1.5 bg-green-50 px-2 py-1 rounded inline-block">Hint code: 4812 (for testing)</p>
                      </div>

                      <input 
                        type="tel"
                        maxLength={6}
                        placeholder="Enter verification code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-center text-xl font-bold tracking-widest focus:outline-none focus:border-[#FFB800]"
                      />

                      {authError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold leading-normal">
                          {authError}
                        </div>
                      )}

                      <button 
                        onClick={verifyPartnerOtp}
                        disabled={otpCode.length < 4 || isAuthLoading}
                        className={`w-full py-4 rounded-xl font-bold text-sm transition-colors shadow-md flex justify-center items-center gap-2 ${
                          otpCode.length >= 4 && !isAuthLoading
                            ? 'bg-[#0D1117] text-white hover:bg-gray-800'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {isAuthLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          'Verify & Log In'
                        )}
                      </button>
                      <button onClick={() => { setShowOtpScreen(false); setAuthError(''); }} className="w-full text-xs font-bold text-gray-400 text-center hover:underline">Change Phone Number</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SCREEN: Partner Onboarding - Step 1: Profile Setup */}
          {screen === 'partner_kyc_step1' && (
            <div className="flex-1 bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setScreen('partner_auth')} className="p-1 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
                  <div>
                    <h2 className="text-sm font-black text-[#0D1117]">Register Partner</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Step 1 of 3: Business Setup</p>
                  </div>
                </div>

                {partnerType === 'mechanic' ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Mechanic / Garage Name</label>
                      <input 
                        type="text" 
                        value={kycName} 
                        onChange={(e) => setKycName(e.target.value)} 
                        placeholder="e.g. Arjun Lal (Freelance)" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Business Mobile Number</label>
                      <input 
                        type="tel" 
                        value={kycPhone} 
                        onChange={(e) => setKycPhone(e.target.value)} 
                        placeholder="e.g. +91 98765 43210" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Services You Offer</label>
                      <div className="space-y-2">
                        {[
                          { id: 'Breakdown', label: 'Mechanical Breakdown Support' },
                          { id: 'Battery', label: 'Battery Jumpstarts & Swaps' },
                          { id: 'Towing', label: 'Towing Rescue Rig' },
                          { id: 'Fuel', label: 'Emergency Fuel Supply' },
                          { id: 'Tyre', label: 'Flat Tyre Repairs' }
                        ].map(srv => {
                          const isChecked = kycServices.includes(srv.id);
                          return (
                            <div 
                              key={srv.id}
                              onClick={() => {
                                if (isChecked) {
                                  setKycServices(kycServices.filter(s => s !== srv.id));
                                } else {
                                  setKycServices([...kycServices, srv.id]);
                                }
                              }}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition select-none ${
                                isChecked ? 'bg-indigo-50 border-indigo-200 text-indigo-900 font-bold' : 'bg-gray-50 border-gray-200 text-gray-655'
                              }`}
                            >
                              <span className="text-[11px]">{srv.label}</span>
                              <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked ? 'bg-indigo-600 border-indigo-505 text-white' : 'border-gray-400'
                              }`}>
                                {isChecked && <span className="text-[10px] font-bold">✓</span>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Garage / Shop Name</label>
                      <input 
                        type="text" 
                        value={kycGarageName} 
                        onChange={(e) => setKycGarageName(e.target.value)} 
                        placeholder="e.g. AutoFix Hub" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Owner Full Name</label>
                      <input 
                        type="text" 
                        value={kycOwnerName} 
                        onChange={(e) => setKycOwnerName(e.target.value)} 
                        placeholder="e.g. Vikram Shah" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Shop Address</label>
                      <input 
                        type="text" 
                        value={kycAddress} 
                        onChange={(e) => setKycAddress(e.target.value)} 
                        placeholder="e.g. WEH highway Mile 12, Mumbai" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">GSTIN / Shop License Number</label>
                      <input 
                        type="text" 
                        value={kycLicenseGst} 
                        onChange={(e) => setKycLicenseGst(e.target.value.toUpperCase())} 
                        placeholder="e.g. 27AADCV9921C1Z4" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold text-slate-800 text-upper"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setScreen('partner_kyc_step2')}
                disabled={
                  partnerType === 'mechanic'
                    ? (!kycName.trim() || !kycPhone.trim() || kycServices.length === 0)
                    : (!kycGarageName.trim() || !kycOwnerName.trim() || !kycAddress.trim() || !kycLicenseGst.trim())
                }
                className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition shadow-md mt-6 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next: Document Verification
              </button>
            </div>
          )}

          {/* SCREEN: Partner Onboarding - Step 2: Documents Upload */}
          {screen === 'partner_kyc_step2' && (
            <div className="flex-1 bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setScreen('partner_kyc_step1')} className="p-1 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
                  <div>
                    <h2 className="text-sm font-black text-[#0D1117]">Register Partner</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Step 2 of 3: Upload Documents</p>
                  </div>
                </div>

                <div className="space-y-5 text-xs">
                  <div className="bg-indigo-50/55 p-3.5 rounded-xl border border-indigo-100 text-[10px] text-indigo-950 font-semibold leading-relaxed">
                    {partnerType === 'mechanic' 
                      ? "🛡️ Velix compliance requires legal documents to activate business payouts. Government identities are parsed securely."
                      : "🛡️ Velix compliance requires owner identities and garage licenses to activate your business listing. Data is encrypted."
                    }
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Aadhaar Card Number</label>
                    <input 
                      type="text" 
                      value={kycAadhaar} 
                      onChange={(e) => setKycAadhaar(e.target.value)} 
                      placeholder="e.g. 5544 3322 1100" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1">PAN Card Number</label>
                    <input 
                      type="text" 
                      value={kycPan} 
                      onChange={(e) => setKycPan(e.target.value.toUpperCase())} 
                      placeholder="e.g. APXDK9921C" 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FFB800] font-semibold uppercase font-mono text-slate-800"
                    />
                  </div>

                  {partnerType === 'business' && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between items-center text-[10px] font-bold text-gray-700 uppercase">
                        <span>GSTIN / Shop License</span>
                        <span className="text-indigo-600 font-extrabold">Attached ✓</span>
                      </div>
                      <p className="text-[11px] font-mono text-gray-500 mt-1">{kycLicenseGst || 'N/A'}</p>
                    </div>
                  )}

                  <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/30 text-center space-y-1">
                    <p className="text-[11px] font-bold text-gray-700">Scan Documents Photo</p>
                    <p className="text-[9px] text-gray-400">PDF, PNG, JPG accepted (max 4MB)</p>
                    <div className="text-xs text-indigo-600 font-bold underline cursor-pointer mt-1">Simulated Upload Complete ✓</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setScreen('partner_kyc_step3')}
                disabled={kycAadhaar.replace(/\s/g, '').length !== 12 || kycPan.length !== 10}
                className="w-full bg-[#0D1117] text-white py-4 rounded-xl font-bold text-xs hover:bg-gray-800 transition shadow-md mt-6 disabled:bg-gray-100 disabled:text-gray-400"
              >
                {partnerType === 'mechanic' ? "Next: Face Liveness Verification" : "Next: Business Liveness Verification"}
              </button>
            </div>
          )}

          {/* SCREEN: Partner Onboarding - Step 3: Video KYC Liveness */}
          {screen === 'partner_kyc_step3' && (
            <div className="flex-1 bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setScreen('partner_kyc_step2')} className="p-1 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
                  <div>
                    <h2 className="text-sm font-black text-[#0D1117]">
                      {partnerType === 'mechanic' ? "Video KYC check" : "Business Liveness check"}
                    </h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
                      Step 3 of 3: {partnerType === 'mechanic' ? "Video Face Liveness" : "Shop Facade Liveness"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs text-gray-500 font-semibold text-center">
                    {partnerType === 'mechanic' 
                      ? "Please position your face within the frame and click Record. Speak clearly."
                      : "Please position your device camera in front of your shop facade or desk. Speak declaration."
                    }
                  </div>

                  <div className="aspect-[4/3] rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                    {videoScanStatus === 'idle' && (
                      <div className="text-center p-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg">📷</span>
                        </div>
                        <button 
                          onClick={() => {
                            setVideoScanStatus('recording');
                            setTimeout(() => {
                              setVideoScanStatus('finished');
                            }, 3000);
                          }}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold transition"
                        >
                          {partnerType === 'mechanic' ? "Start Liveness Scan" : "Start Shop Scan"}
                        </button>
                      </div>
                    )}

                    {videoScanStatus === 'recording' && (
                      <div className="absolute inset-0 flex flex-col justify-between p-4">
                        <div className="flex justify-between items-start z-10">
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold tracking-wider animate-pulse">
                            RECORDING
                          </span>
                        </div>
                        <div className="absolute inset-x-0 h-0.5 bg-indigo-400 top-0 animate-bounce shadow-md" />
                        <div className="w-24 h-24 border border-dashed border-indigo-400/40 rounded-full mx-auto self-center animate-pulse" />
                        <div className="text-center z-10 bg-slate-950/80 p-2 rounded-lg">
                          <p className="text-[9px] text-slate-300 font-semibold font-mono">
                            {partnerType === 'mechanic' ? "Verify biometrics liveness match..." : "Scanning storefront & matching GST details..."}
                          </p>
                        </div>
                      </div>
                    )}

                    {videoScanStatus === 'finished' && (
                      <div className="absolute inset-0 bg-green-950/20 flex flex-col items-center justify-center p-4 text-center space-y-2">
                        <span className="text-2xl text-emerald-500">✓</span>
                        <h4 className="text-xs font-bold text-emerald-600">Verification Checklist Captured</h4>
                        <p className="text-[10px] text-slate-500">Ready to file and submit for Admin compliance verify.</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-semibold leading-relaxed">
                    {partnerType === 'mechanic' ? (
                      <span>🗣️ Speak aloud: "I, {kycName}, verify my request to partner with Velix Roadside Assistance network today."</span>
                    ) : (
                      <span>🗣️ Speak aloud: "I, {kycOwnerName}, owner of {kycGarageName}, declare that the business details submitted are authentic."</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={submitPartnerKyc}
                disabled={videoScanStatus !== 'finished' || isAuthLoading}
                className="w-full bg-[#FFB800] text-[#0D1117] py-4 rounded-xl font-bold text-xs hover:bg-yellow-400 transition shadow-md mt-6 disabled:bg-gray-100 disabled:text-gray-400 flex justify-center items-center gap-2"
              >
                {isAuthLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[#0D1117] border-t-transparent rounded-full animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  'Submit KYC Application'
                )}
              </button>
            </div>
          )}

          {/* SCREEN: Partner Onboarding - Pending */}
          {screen === 'partner_pending' && (
            <div className="flex-1 bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setScreen('auth')} className="p-1 hover:bg-gray-100 rounded-full"><ArrowLeft className="w-5 h-5 text-gray-700" /></button>
                  <div>
                    <h2 className="text-sm font-black text-[#0D1117]">Onboarding Status</h2>
                    <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">Verification Underway</p>
                  </div>
                </div>

                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100">
                    <span className="text-2xl animate-pulse">⏳</span>
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold text-sm bg-slate-900 px-3 py-1.5 rounded-full inline-block">
                      Status: {myMechanic.status.toUpperCase()}
                    </h3>
                    <p className="text-xs text-gray-550 mt-2 leading-relaxed px-4">
                      {partnerType === 'mechanic' 
                        ? "Velix compliance officers are matching your Aadhaar, PAN card, and Video KYC declaration biometrics."
                        : "Velix compliance officers are matching your Business GST, owner Aadhaar/PAN, and storefront verification details."
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-150 space-y-3">
                  <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Document Checklist</h4>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-700">Aadhaar & PAN Match</span>
                    <span className={myMechanic.status === 'approved' ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                      {myMechanic.status === 'approved' ? "Verified ✓" : "Pending Verify"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-gray-700">
                      {partnerType === 'mechanic' ? "Video Liveness Check" : "Storefront & GST Match"}
                    </span>
                    <span className={myMechanic.status === 'approved' ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                      {myMechanic.status === 'approved' ? "Verified ✓" : "Pending Verify"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    if (myMechanic.status === 'approved') {
                      setCurrentUserRole(partnerType);
                      if (partnerType === 'business') {
                        setScreen('business_dashboard');
                      } else {
                        setScreen('mechanic_dashboard');
                      }
                    } else {
                      alert("Application is still pending. Use Debug Bypass below to approve instantly.");
                    }
                  }}
                  className={`w-full py-4 rounded-xl font-bold text-xs transition shadow-md ${
                    myMechanic.status === 'approved' 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/10' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {myMechanic.status === 'approved' ? `Proceed to ${partnerType === 'business' ? 'Business' : 'Mechanic'} Dashboard` : "Refresh Status"}
                </button>

                {myMechanic.status !== 'approved' && (
                  <button
                    onClick={() => {
                      verifyMechanicPartner('my-mobile-mech', 'approved');
                      alert("Debug Bypass Triggered: Onboarding approved instantly!");
                    }}
                    className="w-full py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 text-[10px] font-bold rounded-xl transition"
                  >
                    (Debug Bypass: Approve Instantly)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Persona Routing Views */}
          {currentUserRole === 'user' && !['splash', 'onboarding', 'auth', 'partner_selection', 'partner_auth', 'partner_kyc_step1', 'partner_kyc_step2', 'partner_kyc_step3', 'partner_pending'].includes(screen) && (
            <CustomerApp screen={screen} setScreen={setScreen} />
          )}

          {currentUserRole === 'business' && !['splash', 'onboarding', 'auth', 'partner_selection', 'partner_auth', 'partner_kyc_step1', 'partner_kyc_step2', 'partner_kyc_step3', 'partner_pending'].includes(screen) && (
            <BusinessApp setScreen={setScreen} />
          )}

          {currentUserRole === 'mechanic' && !['splash', 'onboarding', 'auth', 'partner_selection', 'partner_auth', 'partner_kyc_step1', 'partner_kyc_step2', 'partner_kyc_step3', 'partner_pending'].includes(screen) && (
            <MechanicApp setScreen={setScreen} />
          )}

        </div>

        {/* Customer Bottom Navigation */}
        {showCustomerNav && renderBottomNav()}

      </div>
    </div>
  );
};
