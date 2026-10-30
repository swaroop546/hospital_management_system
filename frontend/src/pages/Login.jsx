import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Eye,
  EyeOff,
  Hospital,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { DEMO_USERS, ROLE_CONFIG } from '../utils/constants';

const ROLE_DETAILS = {
  admin: { icon: ShieldCheck, title: 'Hospital administration', text: 'Manage teams, resources, and hospital operations.' },
  doctor: { icon: Stethoscope, title: 'Clinical workspace', text: 'Review consultations and clinical records.' },
  nurse: { icon: Activity, title: 'Nursing station', text: 'Track patient care, vitals, and daily priorities.' },
  receptionist: { icon: CalendarDays, title: 'Front desk workspace', text: 'Coordinate registrations and appointments.' },
  patient: { icon: UserRound, title: 'Patient portal', text: 'View appointments, records, and vitals.' },
};

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState(DEMO_USERS[0].role);
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState(DEMO_USERS[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const roleDetails = ROLE_DETAILS[selectedRole];
  const RoleIcon = roleDetails.icon;

  const selectRole = (demo) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword(demo.password);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    try {
      await login(String(formData.get('email') || '').trim(), String(formData.get('password') || ''));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Unable to sign in. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page min-h-screen bg-slate-100 px-4 py-4 text-slate-900 sm:px-6 lg:px-10">
      <div className="auth-frame mx-auto min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
      <header className="flex items-center justify-between border-b border-slate-100 px-6 py-5 lg:px-9">
        <Link to="/" className="flex items-center gap-3">
          <span className="brand-mark"><Hospital className="h-5 w-5" /></span>
          <span className="text-lg font-bold tracking-tight">MediCore <span className="text-cyan-600">HMS</span></span>
        </Link>
        <Link to="/" className="auth-back-link"><ArrowLeft className="h-4 w-4" /> Back to home</Link>
      </header>

      <main className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-[.9fr_1.1fr]">
        <section className="auth-role-panel hidden flex-col justify-between p-10 lg:flex xl:p-14" style={{ '--role-accent': ROLE_CONFIG[selectedRole].accent }}>
          <div className="auth-abstract-art" aria-hidden="true">
            <span className="auth-curve auth-curve-one" />
            <span className="auth-curve auth-curve-two" />
            <span className="auth-art-dot auth-art-dot-one" />
            <span className="auth-art-dot auth-art-dot-two" />
            <span className="auth-dot-grid auth-dot-grid-one" />
            <span className="auth-dot-grid auth-dot-grid-two" />
          </div>
          <div>
            <div className="auth-role-icon"><RoleIcon className="h-7 w-7" /></div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700">Your workspace</p>
            <h2 className="mt-4 max-w-sm text-4xl font-bold leading-tight tracking-tight text-slate-950">{roleDetails.title}</h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-slate-600">{roleDetails.text}</p>
          </div>
          <div className="auth-role-note">
            <Users className="h-5 w-5 text-cyan-700" />
            <span><strong>One clear workspace</strong><small>Focused tools for your role in the hospital.</small></span>
          </div>
        </section>

        <section className="auth-form-panel flex w-full items-center justify-center px-6 py-10 lg:px-12">
          <div className="auth-card w-full max-w-md">
          <div className="mb-8">
            <p className="text-sm font-semibold text-cyan-700">MediCore HMS</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Sign in</h1>
            <p className="mt-2 text-sm text-slate-500">Access your hospital workspace.</p>
          </div>

          <div className="mb-6">
            <label className="mb-3 block text-sm font-bold text-slate-800">Choose your role</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {DEMO_USERS.map((demo) => {
                const active = selectedRole === demo.role;
                return (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => selectRole(demo)}
                    className={`role-tile ${active ? 'role-tile-active' : ''}`}
                    style={active ? { '--tile-accent': ROLE_CONFIG[demo.role].accent } : undefined}
                  >
                    <span className="truncate text-xs font-bold">{ROLE_CONFIG[demo.role].shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="auth-field">
              <span>Email</span>
              <div><Mail className="h-4 w-4" /><input name="email" autoComplete="username" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
            </label>
            <label className="auth-field">
              <span>Password</span>
              <div><LockKeyhole className="h-4 w-4" /><input name="password" autoComplete="current-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(event) => setPassword(event.target.value)} /><button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
            </label>
            <button type="submit" disabled={loading} className="auth-submit">
              {loading ? 'Signing in...' : 'Sign in'} {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
};
