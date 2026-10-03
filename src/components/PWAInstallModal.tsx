import React from 'react';
import { Download, X, Smartphone, ShieldCheck, Share, PlusSquare } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface PWAInstallModalProps {
  show: boolean;
  onClose: () => void;
  onInstall: () => Promise<boolean>;
  isIOS: boolean;
  isInstallable: boolean;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  show,
  onClose,
  onInstall,
  isIOS,
  isInstallable,
}) => {
  const { showToast } = useToast();

  if (!show) return null;

  const handleInstallClick = async () => {
    showToast('Membuka dialog instalasi Android...', 'info');
    const success = await onInstall();
    if (success) {
      showToast('Aplikasi Bekam Jr. berhasil diinstal!', 'success');
      onClose();
    }
  };

  const handleClose = () => {
    showToast('Instalasi dilewati', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 shadow-2xl border border-emerald-500/30 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-lg shadow-emerald-900/50 flex items-center justify-center overflow-hidden">
            <img src="/pwa-192x192.png" alt="Bekam Jr. Logo" className="w-full h-full object-cover rounded-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">Instal Bekam Jr.</h3>
            <p className="text-xs text-emerald-300 font-medium">Aplikasi Web Android (PWA)</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          Pasang aplikasi di layar utama ponsel Android Anda untuk akses instan tanpa peramban, performa lebih cepat, dan pengalaman native.
        </p>

        <div className="space-y-2 mb-5 bg-slate-800/50 rounded-xl p-3 border border-emerald-900/50 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Data aman & terisolasi per akun praktisi</span>
          </div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Dirancang ergonomis untuk operasi satu tangan</span>
          </div>
        </div>

        {isInstallable && (
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 active:scale-98 transition"
            >
              <Download className="w-5 h-5" />
              <span>Instal Sekarang di Android</span>
            </button>
            <button
              onClick={handleClose}
              className="w-full py-2.5 px-4 text-xs font-medium text-slate-400 hover:text-slate-200 transition text-center"
            >
              Nanti Saja
            </button>
          </div>
        )}

        {isIOS && !isInstallable && (
          <div className="bg-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 border border-slate-700 space-y-2">
            <p className="font-semibold text-white">Panduan Pasang di iOS / Safari:</p>
            <div className="flex items-center gap-2">
              <Share className="w-4 h-4 text-teal-400 shrink-0" />
              <span>1. Ketuk tombol <strong>Share / Bagikan</strong> di bilah browser Safari.</span>
            </div>
            <div className="flex items-center gap-2">
              <PlusSquare className="w-4 h-4 text-teal-400 shrink-0" />
              <span>2. Gulir ke bawah lalu ketuk <strong>Tambah ke Layar Utama</strong>.</span>
            </div>
            <button
              onClick={handleClose}
              className="w-full mt-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition"
            >
              Saya Mengerti
            </button>
          </div>
        )}

        {!isInstallable && !isIOS && (
          <div className="text-center py-2">
            <p className="text-xs text-slate-400">
              Aplikasi ini siap digunakan langsung di browser atau melalui menu titik tiga peramban "Tambahkan ke Layar Utama".
            </p>
            <button
              onClick={handleClose}
              className="mt-3 w-full py-2.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-700 transition"
            >
              Lanjutkan
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
