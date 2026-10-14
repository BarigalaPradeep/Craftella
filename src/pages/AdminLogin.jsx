import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  User,
} from 'lucide-react';
import { usePaymentCards } from '../context/PaymentCardContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { isAdminLoggedIn, loginAdmin } = usePaymentCards();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect directly to /admin
  useEffect(() => {
    if (isAdminLoggedIn) {
      navigate('/admin', { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);

  useEffect(() => {
    document.title = 'Admin Sign In | Craftella';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await loginAdmin(identifier, password);
      setIsSubmitting(false);

      if (result.success) {
        navigate('/admin', { replace: true });
      } else {
        setErrorMsg(result.error || 'Invalid Admin ID or Password.');
      }
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg('An unexpected error occurred during sign in.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070C15] text-[#F4F8FF] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(122,165,242,0.15),transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.12),transparent_70%)] pointer-events-none" />

      {/* Top Header / Back Link */}
      <div className="mx-auto max-w-md w-full flex items-center justify-between pb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9BB1D3] hover:text-white transition-colors"
        >
          <span>← Back to Website</span>
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
          <Lock className="h-3 w-3" />
          <span>Restricted Portal</span>
        </span>
      </div>

      {/* Center Auth Card */}
      <div className="mx-auto max-w-md w-full">
        <div className="rounded-3xl border border-[rgba(158,190,246,0.22)] bg-gradient-to-b from-[#111A2C] via-[#0E1524] to-[#0A0F1A] p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative">
          {/* Subtle Top Accent Line */}
          <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-[#7AA5F2] to-transparent" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7AA5F2]/20 to-[#578CE6]/10 border border-[#7AA5F2]/30 text-[#7AA5F2] shadow-lg mb-4">
              <ShieldCheck className="h-7 w-7 text-[#7AA5F2]" />
            </div>

            <div className="inline-flex items-center gap-2 mb-1">
              <span className="font-serif text-2xl font-bold tracking-[0.14em] text-white">
                CRAFTELLA
              </span>
            </div>
            <p className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#7AA5F2] uppercase">
              ADMIN DESK
            </p>
            <p className="text-xs text-[#9BB1D3] mt-2">
              Sign in with your administrator credentials to manage passes, payment QR &amp; bookings.
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 flex items-start gap-3 animate-in shake duration-200">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-200 font-medium">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Admin ID / Username */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                Admin ID or Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9BB1D3]">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. admin or admin@craftella.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(158,190,246,0.22)] bg-black/40 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2] transition-colors"
                />
              </div>
            </div>

            {/* Admin Password */}
            <div>
              <label className="block text-xs font-semibold text-[#CBD8ED] mb-1.5">
                Admin Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9BB1D3]">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-[rgba(158,190,246,0.22)] bg-black/40 pl-10 pr-10 py-2.5 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9BB1D3] hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#CBD8ED]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-[#7AA5F2] text-[#7AA5F2] focus:ring-[#7AA5F2]"
                />
                <span>Stay signed in on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7AA5F2] to-[#578CE6] py-3.5 px-6 text-xs font-extrabold uppercase tracking-widest text-white shadow-[0_0_25px_rgba(122,165,242,0.45)] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="text-white font-bold">Signing In...</span>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-white" />
                    <span className="text-white font-bold">Sign In to Admin Portal</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-0.5 text-white" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer inside card */}
          <div className="mt-7 pt-5 border-t border-white/10 text-center">
            <p className="text-[11px] text-[#9BB1D3]">
              Need help? Admin access is restricted to verified event organizers.
            </p>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="mx-auto max-w-md w-full pt-8 text-center text-xs text-[#9BB1D3]/70">
        © 2026 Craftella. Secure Organizers Portal.
      </div>
    </div>
  );
}
