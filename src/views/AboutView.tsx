import React from 'react';
import {
  Info,
  Code2,
  Mail,
  MessageCircle,
  HeartHandshake,
  ShieldCheck,
  Coffee,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AboutView: React.FC = () => {
  const { showToast } = useToast();

  const developerName = 'Jamhur';
  const developerWA = '08179015181';
  const developerEmail = 'mull.jhamur@gmail.com';
  const donationNumber = '08179015181';

  const handleOpenWA = () => {
    showToast('Membuka WhatsApp Pengembang Jamhur...', 'info');
    const waUrl = `https://wa.me/628179015181?text=${encodeURIComponent(
      "Assalamu'alaikum Bpk. Jamhur, saya menggunakan aplikasi Bekam Jr. dan ingin berdiskusi mengenai aplikasi ini."
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenEmail = () => {
    showToast('Membuka aplikasi surel (email)...', 'info');
    window.location.href = `mailto:${developerEmail}?subject=${encodeURIComponent(
      'Diskusi Aplikasi Bekam Jr.'
    )}`;
  };

  const handleCopyDonationNumber = () => {
    navigator.clipboard.writeText(donationNumber);
    showToast('Nomor 08179015181 (a.n. Jamhur) berhasil disalin!', 'success');
  };

  const handleConfirmCoffeeWA = () => {
    showToast('Membuka WhatsApp konfirmasi...', 'info');
    const waUrl = `https://wa.me/628179015181?text=${encodeURIComponent(
      "Assalamu'alaikum Bpk. Jamhur, saya pengguna Bekam Jr. izin kirim bagi kopi / donasi apresiasi untuk pengembangan aplikasi. Terima kasih banyak!"
    )}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-400" />
          <span>Tentang Aplikasi Bekam Jr.</span>
        </h1>
        <p className="text-xs text-slate-400">
          Solusi digital rekam medis & manajemen terapi bekam panggilan profesional
        </p>
      </div>

      {/* App Branding Card */}
      <div className="bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950 p-6 rounded-3xl border border-emerald-600/40 shadow-xl text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-1 shadow-lg shadow-emerald-950/60 mb-3 flex items-center justify-center">
          <img src="/pwa-192x192.png" alt="Bekam Jr. Logo" className="w-full h-full object-cover rounded-2xl" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Bekam Jr.</h2>
        <p className="text-xs text-emerald-400 font-semibold mt-0.5">
          Aplikasi PWA Android • Layanan Bekam Panggilan (Door-to-Door)
        </p>
        <div className="inline-block mt-2 px-3 py-1 bg-slate-800/80 rounded-full border border-emerald-500/30 text-[11px] text-slate-300 font-mono">
          Versi 1.1.0 (Door-to-Door Edition)
        </div>

        <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-sm mx-auto">
          Didedikasikan untuk para thabib dan praktisi bekam panggilan (door-to-door) dalam mengelola rekam kunjungan pasien, janji temu ke rumah, dan pengingat otomatis siklus bekam berikutnya secara aman, rapi, dan terisolasi.
        </p>
      </div>

      {/* Developer Profile Card */}
      <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/80 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm uppercase tracking-wider">
          <Code2 className="w-4 h-4" />
          <span>Profil Pengembang (Developer)</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Nama Pengembang:</span>
              <span className="font-bold text-white text-sm">{developerName}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-medium">Kontak WhatsApp:</span>
              <button
                onClick={handleOpenWA}
                className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 active:scale-95 transition"
              >
                <span>{developerWA}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-400 font-medium">Surat Elektronik:</span>
              <button
                onClick={handleOpenEmail}
                className="font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 active:scale-95 transition"
              >
                <span>{developerEmail}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Developer Description & Appreciation */}
          <div className="p-4 bg-emerald-950/30 rounded-2xl border border-emerald-900/40 text-slate-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <HeartHandshake className="w-4 h-4" />
              <span>Apresiasi & Komitmen Pengembang</span>
            </div>
            <p>
              Jamhur adalah software engineer yang berfokus pada perancangan solusi teknologi tepat guna untuk ekosistem kesehatan Islam dan terapis thibbun nabawi. Aplikasi <strong>Bekam Jr.</strong> dirancang secara khusus untuk kepraktisan operasional terapis bekam panggilan di lapangan dengan kenyamanan genggaman satu tangan di ponsel Android.
            </p>
            <p className="italic text-slate-400 pt-1">
              "Semoga karya ini menjadi amal jariyah yang membawa kemudahan dan keberkahan bagi para pejuang sunnah kesehatan bekam."
            </p>
          </div>
        </div>

        {/* Action Buttons for contacting developer */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleOpenWA}
            className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-98 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat WhatsApp</span>
          </button>

          <button
            onClick={handleOpenEmail}
            className="py-3 px-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow active:scale-98 transition"
          >
            <Mail className="w-4 h-4" />
            <span>Kirim Email</span>
          </button>
        </div>
      </div>

      {/* Security & Multi-tenant Guarantee */}
      <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Jaminan Privasi & Isolasi Data Multi-Tenant</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Aplikasi Bekam Jr. menerapkan aturan keamanan Cloud Firestore Zero-Trust. Data pasien terikat secara eksklusif dengan ID akun Anda dan terisolasi penuh sehingga tidak dapat dibaca oleh praktisi lain.
        </p>
      </div>

      {/* FITUR BAGI KOPI (DANA & GOPAY) SESUAI REQUEST USER */}
      <div className="bg-gradient-to-br from-amber-950/40 via-slate-850 to-slate-900 rounded-3xl p-5 border border-amber-600/40 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <div className="p-1.5 bg-amber-500/20 border border-amber-500/40 rounded-xl">
              <Coffee className="w-4 h-4 text-amber-400" />
            </div>
            <span>Bagi Kopi</span>
          </div>
          <span className="text-[10px] text-amber-300/80 font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-600/30">
            Dukung Pengembang
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Jika aplikasi <strong>Bekam Jr.</strong> bermanfaat untuk operasional bekam panggilan Anda, Anda dapat memberikan apresiasi "Bagi Kopi" melalui e-wallet DANA atau GoPay:
        </p>

        {/* E-Wallet Details Box */}
        <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-slate-700/80 space-y-3">
          {/* Logo badges */}
          <div className="flex items-center gap-2">
            {/* DANA Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span>DANA</span>
            </div>

            {/* GoPay Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>GoPay</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Nomor DANA / GoPay:</span>
              <span className="text-base font-black text-amber-300 font-mono tracking-wider">
                {donationNumber}
              </span>
              <span className="text-[11px] text-slate-300 block font-semibold mt-0.5">
                a.n. Jamhur
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyDonationNumber}
              className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow active:scale-95 transition shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Salin Nomor</span>
            </button>
          </div>
        </div>

        {/* Confirmation Action Button */}
        <button
          type="button"
          onClick={handleConfirmCoffeeWA}
          className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-750 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Konfirmasi / Sapa Pengembang di WhatsApp</span>
        </button>
      </div>
    </div>
  );
};
