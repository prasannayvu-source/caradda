import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Phone, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../state/authStore';
import { Button } from '../ui/Button';

// Single shared input style used across the form
const inputBase = `
  w-full bg-[#0F172A] border rounded-xl py-3 text-white
  placeholder:text-slate-500 text-sm
  focus:outline-none focus:ring-2 transition-all duration-150
`;

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { phone?: string; password?: string } = {};
    if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(phone, password);
      toast.success('Welcome back! Redirecting to dashboard…');
      navigate('/dashboard', { replace: true });
    } catch {
      toast.error('Invalid phone number or password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>

      {/* ── Phone field ──────────────────────────────────────── */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-white/90">
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <Phone className="w-4 h-4 text-slate-400" />
          </div>
          <input
            id="phone"
            type="tel"
            inputMode="numeric"
            placeholder="9876543210"
            value={phone}
            autoComplete="tel"
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
              if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }));
            }}
            style={{ colorScheme: 'dark', WebkitTextFillColor: '#F8FAFC' }}
            className={`
              ${inputBase} pl-11 pr-4 font-mono tracking-widest
              ${errors.phone
                ? 'border-red/70 focus:ring-red/30'
                : 'border-slate-700 hover:border-slate-500 focus:ring-red/30 focus:border-red/60'
              }
            `}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red flex items-center gap-1.5 mt-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red" />
            {errors.phone}
          </p>
        )}
      </div>

      {/* ── Password field ───────────────────────────────────── */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white/90">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
            }}
            style={{
              colorScheme: 'dark',
              WebkitTextFillColor: '#F8FAFC',
              letterSpacing: showPassword ? 'normal' : '0.2em',
            }}
            className={`
              ${inputBase} pl-11 pr-12
              ${errors.password
                ? 'border-red/70 focus:ring-red/30'
                : 'border-slate-700 hover:border-slate-500 focus:ring-red/30 focus:border-red/60'
              }
            `}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-white transition-colors z-10"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red flex items-center gap-1.5 mt-1">
            <span className="inline-block w-1 h-1 rounded-full bg-red" />
            {errors.password}
          </p>
        )}
      </div>

      {/* ── Submit ───────────────────────────────────────────── */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full text-base font-bold"
        id="login-submit-btn"
      >
        {!isLoading && <LogIn className="w-5 h-5 mr-2" />}
        Login to Dashboard
      </Button>
    </form>
  );
}
