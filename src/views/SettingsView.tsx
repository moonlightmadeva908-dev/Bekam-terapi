import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import {
  Settings,
  User,
  Phone,
  MapPin,
  Image,
  Upload,
  Download,
  FileJson,
  LogOut,
  Save,
  Smartphone,
  Eye,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { exportDataToJSON, importDataFromJSON } from '../services/patientService';

interface SettingsViewProps {
  profile: UserProfile | null;
  onRefreshData: () => void;
  isInstallable: boolean;
  onInstall: () => void;
}

const PRESET_BANNERS = [
  {
    id: 'clinic-1',
    name: 'Klinik Medis Hijau',
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'herbal-2',
    name: 'Herba & Minyak Alami',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'hijama-3',
    name: 'Ruang Terapi Bersih',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1000&auto=format&fit=crop&q=80',
  },
  {
    id: 'zen-4',
    name: 'Ketenangan & Penyembuhan',
    url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1000&auto=format&fit=crop&q=80',
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onRefreshData,
  isInstallable,
  onInstall,
}) => {
  const { currentUser, saveUserProfile, logout } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || '');
  const [bannerUrl, setBannerUrl] = useState(
    profile?.bannerUrl || PRESET_BANNERS[0].url
  );
  const [bannerPosition, setBannerPosition] = useState<'top' | 'center' | 'bottom'>(
    profile?.bannerPosition || 'center'
  );
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Banner Image File Upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran gambar maksimal 2MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBannerUrl(reader.result as string);
      showToast('Foto banner berhasil dimuat untuk pratinjau', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Handle Avatar Image File Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('Ukuran foto profil maksimal 2MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarUrl(reader.result as string);
      showToast('Foto profil berhasil dimuat untuk pratinjau', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Save changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama pembekam tidak boleh kosong!', 'warning');
      return;
    }

    try {
      setSaving(true);
      await saveUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        avatarUrl,
        bannerUrl,
        bannerPosition,
      });
      showToast('Profil praktisi berhasil disimpan!', 'success');
    } catch (err: any) {
      showToast(`Gagal menyimpan: ${err?.message || 'Error'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export Data to JSON
  const handleExportJSON = async () => {
    if (!currentUser) return;
    try {
      showToast('Menyiapkan pencadangan data JSON...', 'info');
      const jsonStr = await exportDataToJSON(currentUser.uid, profile);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bekam_jr_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Pencadangan JSON berhasil diunduh!', 'success');
    } catch (err: any) {
      showToast(`Gagal ekspor: ${err?.message || 'Error'}`, 'error');
    }
  };

  // Import Data from JSON
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      setImporting(true);
      showToast('Membaca berkas pencadangan...', 'info');
      const text = await file.text();
      const result = await importDataFromJSON(currentUser.uid, text);
      showToast(`Berhasil memulihkan ${result.count} data pasien!`, 'success');
      onRefreshData();
    } catch (err: any) {
      showToast(`Gagal impor data: ${err?.message || 'Format tidak cocok'}`, 'error');
    } finally {
      setImporting(false);
      if (jsonFileInputRef.current) {
        jsonFileInputRef.current.value = '';
      }
    }
  };

  const handleLogout = async () => {
    showToast('Keluar dari aplikasi...', 'info');
    await logout();
    showToast('Anda telah berhasil keluar', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>Pengaturan Praktisi</span>
        </h1>
        <p className="text-xs text-slate-400">
          Sesuaikan identitas klinik, foto banner, dan cadangan data
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/80 space-y-4 shadow-xl">
        <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Identitas Pembekam</span>
        </h2>

        {/* Nama Pembekam */}
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
              placeholder="Contoh: Ustadz Ahmad Fauzi, S.Kep"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* WhatsApp Pembekam */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Nomor WhatsApp Praktisi / Klinik
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="081234567890"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Alamat Praktisi */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Alamat Tempat Praktik / Klinik
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <MapPin className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Contoh: Jl. Sunnah No. 12, Jakarta Timur"
              className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Upload Foto Profil (Avatar) */}
        <div className="pt-2 border-t border-slate-700/60">
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Foto Profil Pembekam
          </label>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-emerald-500/40 overflow-hidden flex items-center justify-center shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Preview Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-slate-500" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <input
                type="file"
                ref={avatarFileInputRef}
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => avatarFileInputRef.current?.click()}
                className="py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Foto Profil</span>
              </button>
              <p className="text-[10px] text-slate-400">JPG, PNG atau WebP (Maks. 2MB)</p>
            </div>
          </div>
        </div>

        {/* Upload & Kustomisasi Foto Banner */}
        <div className="pt-2 border-t border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Foto Banner Header
            </label>
            <span className="text-[10px] text-emerald-400 font-semibold">Tampil di dashboard</span>
          </div>

          {/* Banner Live Preview */}
          <div className="relative h-28 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-700">
            <img
              src={bannerUrl}
              alt="Pratinjau Banner"
              className="w-full h-full object-cover opacity-80"
              style={{ objectPosition: bannerPosition }}
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[10px] text-white flex items-center gap-1">
              <Eye className="w-3 h-3 text-emerald-400" />
              <span>Pratinjau Posisi: {bannerPosition.toUpperCase()}</span>
            </div>
          </div>

          {/* Penyesuaian Posisi Gambar */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              Penyesuaian Posisi Gambar Banner:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['top', 'center', 'bottom'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => {
                    setBannerPosition(pos);
                    showToast(`Posisi banner: ${pos}`, 'info');
                  }}
                  className={`py-1.5 rounded-lg border text-xs font-semibold capitalize transition ${
                    bannerPosition === pos
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {pos === 'top' ? 'Atas' : pos === 'center' ? 'Tengah' : 'Bawah'}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Button */}
          <div className="flex gap-2">
            <input
              type="file"
              ref={bannerFileInputRef}
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => bannerFileInputRef.current?.click()}
              className="flex-1 py-2 px-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Pilih Gambar Custom</span>
            </button>
          </div>

          {/* Preset Banners */}
          <div>
            <span className="block text-[11px] font-medium text-slate-400 mb-1.5">
              Atau Pilih Tema Banner Siap Pakai:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_BANNERS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setBannerUrl(preset.url);
                    showToast(`Memilih banner ${preset.name}`, 'info');
                  }}
                  className={`relative h-14 rounded-xl overflow-hidden border transition active:scale-95 text-left ${
                    bannerUrl === preset.url
                      ? 'border-emerald-400 ring-2 ring-emerald-500/50'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-black/40 p-1.5 flex flex-col justify-end">
                    <span className="text-[10px] text-white font-bold leading-tight drop-shadow">
                      {preset.name}
                    </span>
                  </div>
                  {bannerUrl === preset.url && (
                    <div className="absolute top-1 right-1 p-0.5 bg-emerald-500 rounded-full text-slate-950">
                      <Check className="w-3 h-3 stroke-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="pt-3">
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-98 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </form>

      {/* Backup & Restore Data Section */}
      <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/80 space-y-4 shadow-xl">
        <div>
          <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            <span>Pencadangan & Pemulihan (Backup / Restore)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simpan salinan data pasien ke file JSON lokal atau pulihkan data Anda kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition active:scale-98 shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Data ke JSON</span>
          </button>

          {/* Import JSON */}
          <div>
            <input
              type="file"
              ref={jsonFileInputRef}
              accept=".json,application/json"
              onChange={handleImportJSON}
              className="hidden"
            />
            <button
              type="button"
              disabled={importing}
              onClick={() => jsonFileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-2xl bg-slate-900 border border-slate-700 hover:border-teal-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition active:scale-98 shadow-sm disabled:opacity-50"
            >
              <Upload className="w-4 h-4 text-teal-400" />
              <span>{importing ? 'Memproses...' : 'Import Data dari JSON'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PWA & System Actions */}
      <div className="space-y-3">
        {isInstallable && (
          <button
            onClick={() => {
              showToast('Membuka dialog instalasi PWA...', 'info');
              onInstall();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2 shadow-lg transition active:scale-98 text-xs"
          >
            <Smartphone className="w-4 h-4" />
            <span>Instal Aplikasi Bekam Jr. di Android</span>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/50 text-rose-300 font-bold rounded-2xl flex items-center justify-center gap-2 transition active:scale-98 text-xs"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar dari Akun (Logout)</span>
        </button>
      </div>
    </div>
  );
};
