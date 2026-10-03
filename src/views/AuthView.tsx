import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  LogIn,
  UserPlus,
  AlertCircle,
  Sparkles,
  ExternalLink,
  HelpCircle,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthView: React.FC = () => {
  const { login, register, loginWithGoogle, loginAsDemo, resetPassword } = useAuth();
  const { showToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [loading, setLoading] = useState(false);
  const [showConfigNotice, setShowConfigNotice] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Password visibility toggle states (Fitur intip kata sandi)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Mohon lengkapi email dan kata sandi', 'warning');
      return;
    }

    try {
      setLoading(true);
      showToast('Memverifikasi akun praktisi...', 'info');
      await login(email.trim(), password);
      showToast('Berhasil masuk! Selamat datang di Bekam Jr.', 'success');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setShowConfigNotice(true);
        showToast('Penyedia Email/Password belum diaktifkan di konsol Firebase', 'warning');
      } else if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password'
      ) {
        showToast('Email atau kata sandi tidak cocok.', 'error');
      } else if (err.code === 'auth/invalid-email') {
        showToast('Format alamat email tidak valid.', 'error');
      } else {
        showToast(`Gagal masuk: ${err.message || 'Terjadi kesalahan'}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama pembekam wajib diisi!', 'warning');
      return;
    }
    if (!email.trim() || !password) {
      showToast('Email dan kata sandi wajib diisi!', 'warning');
      return;
    }
    if (password.length < 6) {
      showToast('Kata sandi minimal 6 karakter!', 'warning');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Konfirmasi kata sandi tidak cocok!', 'warning');
      return;
    }

    try {
      setLoading(true);
      showToast('Mendaftarkan akun praktisi baru...', 'info');
      await register(email.trim(), password, name.trim(), phone.trim(), address.trim());
      showToast('Pendaftaran berhasil! Selamat datang di Bekam Jr.', 'success');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setShowConfigNotice(true);
        showToast('Penyedia Email/Password belum diaktifkan di konsol Firebase', 'warning');
      } else if (err.code === 'auth/email-already-in-use') {
        showToast('Alamat email ini sudah terdaftar. Silakan login.', 'error');
      } else if (err.code === 'auth/weak-password') {
        showToast('Kata sandi terlalu lemah (minimal 6 karakter).', 'error');
      } else {
        showToast(`Gagal mendaftar: ${err.message || 'Terjadi kesalahan'}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Masukkan alamat email untuk reset sandi', 'warning');
      return;
    }

    try {
      setLoading(true);
      showToast('Mengirim tautan reset kata sandi...', 'info');
      await resetPassword(email.trim());
      showToast('Tautan pemulihan kata sandi telah dikirim ke email Anda!', 'success');
      setMode('login');
    } catch (err: any) {
      showToast('Gagal mengirim tautan reset sandi.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      showToast('Menghubungkan akun Google...', 'info');
      await loginWithGoogle();
      showToast('Berhasil masuk dengan Google!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast('Login Google dibatalkan atau terkendala.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    showToast('Masuk sebagai Praktisi Demo...', 'success');
    loginAsDemo();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center px-4 py-8 max-w-md mx-auto relative">
      {/* App Branding Top */}
      <div className="text-center mb-5">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-950/80 mb-3 flex items-center justify-center">
          <img src="/pwa-192x192.png" alt="Bekam Jr." className="w-full h-full object-cover rounded-2xl" />
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">Bekam Jr.</h1>
        <p className="text-xs text-emerald-400 font-semibold mt-0.5">
          Manajemen Pasien & Jadwal Terapi Bekam
        </p>
      </div>

      {/* Primary 1-Click Google Sign-in (Always Enabled in AI Studio) */}
      <div className="mb-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/70 border border-emerald-400/40 active:scale-98 transition disabled:opacity-50"
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8 0-1.3.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 20.4 7.5 23 12 23z"
              />
            </svg>
          </div>
          <span>Masuk dengan Akun Google (Aktif Langsung)</span>
        </button>

        {/* Demo Mode Button for Instant Testing */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full mt-2 py-2.5 px-3 bg-slate-800/80 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-98 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Coba Mode Demo Praktisi (Tanpa Perlu Login)</span>
        </button>
      </div>

      <div className="relative flex py-2 items-center mb-3">
        <div className="flex-grow border-t border-slate-800"></div>
        <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
          atau dengan Email
        </span>
        <div className="flex-grow border-t border-slate-800"></div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex mb-4">
        <button
          type="button"
          onClick={() => {
            setMode('login');
            showToast('Halaman Masuk (Login)', 'info');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            mode === 'login'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register');
            showToast('Halaman Pendaftaran Akun', 'info');
          }}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            mode === 'register'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Daftar Baru
        </button>
      </div>

      {/* Auth Card */}
      <div className="bg-slate-900/90 rounded-3xl p-5 border border-emerald-900/60 shadow-2xl">
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Masuk dengan Email</span>
              </h2>
              <p className="text-[11px] text-slate-400">Masukkan email dan kata sandi Anda</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="praktisi@email.com"
                  className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">Kata Sandi</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    showToast('Pemulihan Kata Sandi', 'info');
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-400 transition"
                  title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition disabled:opacity-50 text-xs"
            >
              <span>{loading ? 'Memproses...' : 'Masuk dengan Email'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-400" />
                <span>Daftar Akun Baru</span>
              </h2>
              <p className="text-[11px] text-slate-400">Registrasi akun pembekam baru</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nama Lengkap Pembekam *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Ustadz Abdullah"
                  className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Klinik</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Kota / Alamat"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alamat Email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 kar"
                    className="w-full pl-3 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-emerald-400 transition"
                    title={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Konfirmasi *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi"
                    className="w-full pl-3 pr-8 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-emerald-400 transition"
                    title={showConfirmPassword ? 'Sembunyikan konfirmasi sandi' : 'Lihat konfirmasi sandi'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition disabled:opacity-50 text-xs mt-1"
            >
              <span>{loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {mode === 'forgot' && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Lupa Kata Sandi</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Instruksi reset kata sandi akan dikirim ke email Anda
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alamat Email Terdaftar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="praktisi@email.com"
                  className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg active:scale-98 transition disabled:opacity-50 text-xs"
            >
              <span>{loading ? 'Mengirim...' : 'Kirim Tautan Reset'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-1"
            >
              Kembali ke Halaman Masuk
            </button>
          </form>
        )}
      </div>

      {/* Firebase Notice Modal for auth/operation-not-allowed */}
      {showConfigNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/50 rounded-3xl p-5 shadow-2xl text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Penyedia Email Belum Diaktifkan</span>
              </div>
              <button
                onClick={() => setShowConfigNotice(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Di Firebase Authentication, metode <strong>Email/Password</strong> dinonaktifkan secara bawaan oleh Google Cloud. Namun, <strong>Akun Google</strong> sudah aktif secara instan!
            </p>

            <div className="bg-slate-800/90 rounded-xl p-3 border border-slate-700 text-xs space-y-2 mb-4">
              <p className="font-semibold text-emerald-400">Solusi Cepat:</p>
              <button
                type="button"
                onClick={() => {
                  setShowConfigNotice(false);
                  handleGoogleLogin();
                }}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>Masuk Sekarang dengan Google</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfigNotice(false);
                  handleDemoLogin();
                }}
                className="w-full py-2 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>Masuk Mode Demo Praktisi</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Jika ingin tetap menggunakan Email & Password:</p>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-400">
                <li>Buka <strong>Firebase Console</strong> proyek Anda.</li>
                <li>Pilih <strong>Authentication</strong> &gt; tab <strong>Sign-in method</strong>.</li>
                <li>Klik <strong>Email/Password</strong>, centang <strong>Enable</strong>, lalu klik <strong>Save</strong>.</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={() => setShowConfigNotice(false)}
              className="mt-4 w-full py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        <span>Data terenkripsi dan terisolasi per akun praktisi</span>
      </div>
    </div>
  );
};
