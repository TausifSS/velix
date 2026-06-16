import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ShieldCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length === 10) {
      setOtpMode(true);
    }
  };

  const handleVerify = () => {
    if (otp === '4812' || otp.length === 4) {
      navigate('/');
    } else {
      alert('Enter any 4-digit code (e.g. 4812) to login');
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      
      {/* Left Branding Panel (Visible on Desktop) */}
      <div className="hidden lg:flex w-1/2 bg-[#0D1117] relative flex-col justify-between overflow-hidden">
        {/* Background Design Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFB800] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/3"></div>

        <div className="p-12 relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="text-[#FFB800] font-bold text-4xl">V</div>
            <div>
              <h1 className="font-bold text-3xl text-white tracking-tight">VELIX</h1>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Never Stranded Again.</p>
            </div>
          </div>
          
          <div className="max-w-md mt-20">
            <h2 className="text-5xl font-bold text-white leading-[1.1] mb-6">
              One Tap.<br />
              <span className="text-[#FFB800]">Instant Help.</span><br />
              Anywhere.
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              India's intelligent on-demand roadside assistance platform. 
              Join thousands of drivers who drive with peace of mind.
            </p>
            
            <div className="flex gap-6 mt-12">
              <div className="flex flex-col gap-2">
                <div className="text-3xl font-bold text-white">300M+</div>
                <div className="text-sm text-gray-400">Registered Vehicles</div>
              </div>
              <div className="w-px bg-gray-800"></div>
              <div className="flex flex-col gap-2">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Emergency Support</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12 relative z-10">
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md inline-flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#FFB800]" />
            <span className="text-gray-300 text-sm font-medium">Verified & Trusted Professionals Only</span>
          </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="flex lg:hidden items-center gap-3 mb-12 justify-center">
            <div className="text-[#FFB800] font-bold text-4xl">V</div>
            <div>
              <h1 className="font-bold text-3xl text-[#0D1117] tracking-tight">VELIX</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Never Stranded Again.</p>
            </div>
          </div>

          <div className="text-center lg:text-left mb-10">
            <h2 className="text-3xl font-bold text-[#0D1117] mb-2">Welcome to Velix</h2>
            <p className="text-gray-500">
              {otpMode ? 'Enter the 4-digit OTP code sent to you' : 'Enter your mobile number to get started'}
            </p>
            {otpMode && <p className="text-green-600 text-xs font-bold mt-1">Verification OTP: 4812</p>}
          </div>

          <div className="space-y-6">
            {!otpMode ? (
              <>
                <div className="relative flex items-center bg-white">
                  <div className="absolute left-1 top-1 bottom-1 bg-[#F5F6F8] rounded-l-xl px-4 flex items-center gap-2 border-r border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors">
                    <span className="font-semibold text-[#0D1117]">+91</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter your mobile number"
                    className="w-full pl-28 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-lg font-medium text-[#0D1117] focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all placeholder:text-gray-400 placeholder:font-normal"
                  />
                </div>

                <button 
                  onClick={handleContinue}
                  disabled={phoneNumber.length !== 10}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    phoneNumber.length === 10 
                      ? 'bg-[#FFB800] text-[#0D1117] hover:bg-yellow-400 shadow-lg shadow-yellow-500/20' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </>
            ) : (
              <>
                <div className="relative flex items-center bg-white">
                  <input
                    type="tel"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter OTP (e.g. 4812)"
                    className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-[#FFB800] focus:ring-2 focus:ring-[#FFB800]/20 transition-all"
                  />
                </div>

                <button 
                  onClick={handleVerify}
                  disabled={otp.length !== 4}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    otp.length === 4 
                      ? 'bg-[#FFB800] text-[#0D1117] hover:bg-yellow-400 shadow-lg shadow-yellow-500/20' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Verify Code
                </button>
                <button onClick={() => setOtpMode(false)} className="w-full text-xs text-gray-400 font-bold hover:underline text-center">Change Mobile Number</button>
              </>
            )}
          </div>

          <div className="mt-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">or continue with</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-[#0D1117] font-semibold bg-white"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center justify-center gap-3 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-[#0D1117] font-semibold bg-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.31-.83 3.73-.8 1.47.05 2.68.64 3.41 1.69-2.95 1.77-2.51 5.86.37 7.02-.75 1.83-1.63 3.28-2.59 4.26zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.37-1.95 4.34-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-xs text-gray-400 leading-relaxed">
            By continuing, you agree to our <br/>
            <a href="#" className="font-semibold text-gray-600 hover:text-[#0D1117] transition-colors">Terms & Conditions</a> and <a href="#" className="font-semibold text-gray-600 hover:text-[#0D1117] transition-colors">Privacy Policy</a>
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;