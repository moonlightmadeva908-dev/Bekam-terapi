import React from 'react';
import { UserProfile } from '../types';
import { MapPin, Phone, Award, Download, UserCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface HeaderBannerProps {
  profile: UserProfile | null;
  onEditProfile: () => void;
  isInstallable: boolean;
  onInstall: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  profile,
  onEditProfile,
  isInstallable,
  onInstall,
}) => {
  const { showToast } = useToast();

  const bannerUrl =
    profile?.bannerUrl ||
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80';

  const avatarUrl = profile?.avatarUrl;
  const therapistName = profile?.name || 'Praktisi Bekam';
  const therapistPhone = profile?.phone || 'Belum diisi';
  const therapistAddress = profile?.address || 'Klinik Terapi Bekam Sunnah';
  const objectPosition = profile?.bannerPosition || 'center';

  return (
    <div className="relative rounded-3xl overflow-hidden bg-slate-800 shadow-xl border border-emerald-900/40 mb-5">
      {/* Banner Background */}
      <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-emerald-950">
        <img
          src={bannerUrl}
          alt="Banner Praktisi Bekam"
          className="w-full h-full object-cover opacity-75 filter brightness-90"
          style={{ objectPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-md">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Bekam Jr. • Layanan Bekam Panggilan</span>
          </div>

          {isInstallable && (
            <button
              onClick={() => {
                showToast('Membuka instalasi aplikasi...', 'info');
                onInstall();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg animate-pulse transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instal PWA</span>
            </button>
          )}
        </div>
      </div>

      {/* Practitioner Identity Card */}
      <div className="px-5 pb-5 pt-0 -mt-12 relative z-10">
        <div className="flex items-end justify-between gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 p-0.75 shadow-xl shadow-slate-950/60 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={therapistName}
                  className="w-full h-full object-cover rounded-2xl bg-slate-800"
                />
              ) : (
                <div className="w-full h-full bg-slate-800 rounded-2xl flex items-center justify-center text-emerald-400 font-bold text-2xl">
                  {therapistName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 text-slate-950 rounded-full border-2 border-slate-900" title="Terverifikasi">
              <UserCheck className="w-3 h-3" />
            </div>
          </div>

          {/* Quick Edit shortcut button */}
          <button
            onClick={() => {
              showToast('Membuka pengaturan profil pembekam', 'info');
              onEditProfile();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-sm transition active:scale-95"
          >
            Ubah Profil
          </button>
        </div>

        {/* Name and Details */}
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {therapistName}
            </h1>
          </div>
          <p className="text-xs text-emerald-400 font-semibold mt-0.5">
            Praktisi Bekam Panggilan (Door-to-Door)
          </p>

          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{therapistPhone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="line-clamp-1">{therapistAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
