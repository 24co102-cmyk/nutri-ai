// src/components/WelcomeModal.tsx
import React, { useState } from 'react';
import { Sparkles, Phone, ArrowRight, ShieldCheck, CheckCircle2, Lock, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'options' | 'phone' | 'otp' | 'success'>('options');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [userMethod, setUserMethod] = useState<'google' | 'phone' | null>(null);

  if (!isOpen) return null;

  // Google Sign-In Handler
  const handleGoogleSignIn = () => {
    setLoading(true);
    setUserMethod('google');
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        localStorage.setItem('unlocked_prototype', 'true');
        onClose();
        setStep('options');
      }, 1200);
    }, 1000);
  };

  // Phone Number Submit Handler -> Send OTP
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      alert('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 800);
  };

  // OTP Verification Handler
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      alert('Please enter all 4 digits of the OTP (e.g. 1234)');
      return;
    }
    setLoading(true);
    setUserMethod('phone');
    setTimeout(() => {
      setLoading(false);
      setStep('success');
      setTimeout(() => {
        localStorage.setItem('unlocked_prototype', 'true');
        onClose();
        setStep('options');
      }, 1200);
    }, 1000);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-md transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200/80 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header Branding */}
        <div className="bg-neutral-900 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight">NutriLens</h3>
          <p className="text-xs text-emerald-400 font-semibold tracking-wider uppercase mt-1">
            AI HEALTH & NUTRITION SUITE
          </p>

          {/* Background Glow */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: OPTIONS (Google & Phone choice) */}
          {step === 'options' && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-base font-bold text-neutral-900">Welcome to NutriLens Prototype</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Choose Google Sign-In or Phone OTP to open the UI suite.
                </p>
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-white border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-3 group"
              >
                {/* Official Google SVG Logo */}
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-neutral-200"></div>
                <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                  OR USE PHONE NUMBER
                </span>
                <div className="flex-grow border-t border-neutral-200"></div>
              </div>

              {/* Phone Option Button */}
              <button
                onClick={() => setStep('phone')}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Sign in with Phone & OTP</span>
              </button>

              {/* Direct Access Shortcut */}
              <div className="pt-2 text-center">
                <button
                  onClick={() => {
                    localStorage.setItem('unlocked_prototype', 'true');
                    onClose();
                  }}
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline"
                >
                  Skip & Explore UI Prototype Directly →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PHONE NUMBER INPUT */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4 animate-in fade-in">
              <div>
                <h4 className="text-base font-bold text-neutral-900">Enter Mobile Number</h4>
                <p className="text-xs text-neutral-500 mt-0.5">We will send a 4-digit verification code (OTP).</p>
              </div>

              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="p-3 text-xs font-bold rounded-2xl bg-neutral-100 border border-neutral-200 focus:outline-none"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                </select>

                <input
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 p-3 text-sm font-bold tracking-wider rounded-2xl bg-[#faf9f8] border border-neutral-200 focus:border-emerald-500 focus:outline-none"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Sending OTP Code...' : 'Get Verification Code (OTP)'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('options')}
                className="w-full text-center text-xs font-bold text-neutral-400 hover:text-neutral-600"
              >
                ← Back to Options
              </button>
            </form>
          )}

          {/* STEP 3: OTP VERIFICATION */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-neutral-900">Enter Verification Code</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Code sent to <span className="font-bold text-neutral-800">{countryCode} {phone}</span>
                </p>
              </div>

              {/* 4-Digit OTP Boxes */}
              <div className="flex justify-center gap-3 py-2">
                {[0, 1, 2, 3].map((idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={otp[idx]}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-extrabold rounded-2xl bg-[#faf9f8] border-2 border-neutral-200 focus:border-emerald-500 focus:bg-white focus:outline-none transition-all"
                  />
                ))}
              </div>

              <p className="text-[11px] text-center text-emerald-600 font-semibold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                💡 Demo Tip: Enter any 4 digits (e.g. 1 2 3 4) to verify.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying Code...' : 'Verify OTP & Open UI Prototype'}
                <ShieldCheck className="w-4 h-4" />
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="font-bold text-neutral-400 hover:text-neutral-600"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={() => alert('New OTP sent: 1234')}
                  className="font-bold text-emerald-600 hover:text-emerald-700"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SUCCESS ANIMATION */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-3 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h4 className="text-xl font-extrabold text-neutral-900">
                {userMethod === 'google' ? 'Google Account Verified!' : 'Phone OTP Verified!'}
              </h4>
              <p className="text-xs text-neutral-500 font-medium">Opening NutriLens UI Health Suite...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
