import React, { useState } from 'react';
import {
  BookOpen,
  UserCheck,
  CalendarCheck,
  MessageCircle,
  HardDriveDownload,
  ShieldAlert,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Home,
  BellRing,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { SUNNAH_CUPPING_POINTS } from '../types';

export const GuideView: React.FC = () => {
  const { showToast } = useToast();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
    showToast(`Membuka panduan langkah ${index + 1}`, 'info');
  };

  const steps = [
    {
      title: '1. Atur Profil Pembekam Panggilan',
      icon: UserCheck,
      content:
        'Buka menu "Pengaturan" untuk melengkapi Nama Pembekam, Nomor WhatsApp aktif, serta wilayah operasional/alamat Anda. Identitas ini akan otomatis tercantum pada kop pesan WhatsApp yang dikirimkan saat konfirmasi kunjungan ke rumah pasien.',
    },
    {
      title: '2. Input Janji Bekam & Alamat Kunjungan Pasien',
      icon: Home,
      content:
        'Ketuk tombol "Tambah Pasien". Pilih status "Akan Bekam", masukkan Nama Pasien, Nomor WhatsApp, Alamat Lengkap / Patokan Rumah untuk dikunjungi, serta tentukan "Tanggal Janji Bekam" dan estimasi jam kedatangan Anda di rumah pasien.',
    },
    {
      title: '3. Kirim Konfirmasi Kunjungan Rumah (Door-to-Door)',
      icon: MessageCircle,
      content:
        'Untuk pasien berstatus "Akan Bekam", ketuk tombol "Kirim WA (Konfirmasi Kunjungan Rumah)". Aplikasi otomatis menyusun pesan pengingat tanggal, jam tiba, serta 5 persiapan fisik & ruangan di rumah pasien sebelum terapis tiba.',
    },
    {
      title: '4. Pengingat "Sudah Waktunya Berbekam" Saat Sesi Selesai',
      icon: BellRing,
      content:
        'Setelah terapi di rumah pasien selesai, ubah status pasien menjadi "Sudah Bekam" dan tentukan tanggal jadwal bekam berikutnya. Tombol WhatsApp akan otomatis berubah menjadi "Kirim WA: Sudah Waktunya Berbekam!" untuk mempermudah Anda mengajak pasien menjadwalkan kunjungan rutin selanjutnya.',
    },
    {
      title: '5. Backup & Restore Data Kunjungan Berkala',
      icon: HardDriveDownload,
      content:
        'Gunakan fitur "Export Data ke JSON" di menu Pengaturan untuk menyimpan salinan seluruh rekam pasien dan jadwal kunjungan Anda. Data dapat dipulihkan kembali kapan saja dengan fitur "Import Data dari JSON".',
    },
  ];

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span>Panduan Bekam Panggilan</span>
        </h1>
        <p className="text-xs text-slate-400">
          SOP Praktisi Bekam Door-to-Door & Pengoperasian Aplikasi Bekam Jr.
        </p>
      </div>

      {/* Step by step guide */}
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isOpen = activeAccordion === idx;
          return (
            <div
              key={idx}
              className="bg-slate-800/80 rounded-2xl border border-slate-700/80 overflow-hidden shadow-sm transition"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(idx)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left transition hover:bg-slate-750"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-sm text-white">{step.title}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-700/50">
                  {step.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* SOP Terapis Bekam Door-to-Door */}
      <div className="bg-slate-800/80 rounded-3xl p-5 border border-amber-600/40 space-y-3">
        <h2 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>SOP Praktisi Bekam Panggilan (Door-to-Door)</span>
        </h2>
        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li><strong>Konfirmasi H-1 atau Pagi Hari:</strong> Kirim WA konfirmasi jam tiba dan minta pasien memastikan perut tidak kekenyangan.</li>
          <li><strong>Peralatan Mobile Steril:</strong> Selalu bawa tas khusus terpisah antara peralatan bersih (steril) dan wadah pembuangan.</li>
          <li><strong>Alas Bersih / Perlak Disposable:</strong> Selalu siapkan alas/perlak higienis agar kasur atau lantai pasien di rumah tetap bersih terjaga.</li>
          <li><strong>Jarum Baru Sekali Pakai (Single Use):</strong> Wajib membuka segel jarum lancet di depan pasien sebagai bukti sterilitas.</li>
          <li><strong>Bawa Pulang Limbah Medis:</strong> Seluruh kapas darah dan jarum bekas wajib dimasukkan ke wadah safety box/kantong biohazard dan dibawa pulang untuk dimusnahkan dengan benar (tidak dibuang di tempat sampah rumah pasien).</li>
        </ul>
      </div>

      {/* Titik Bekam Sunnah Reference */}
      <div className="bg-slate-800/80 rounded-3xl p-5 border border-slate-700/80 space-y-3">
        <h2 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Titik Bekam Sunnah Utama (Thibbun Nabawi)</span>
        </h2>
        <p className="text-xs text-slate-400">
          Titik-titik utama yang diajarkan dalam sunnah Rasulullah SAW:
        </p>

        <div className="space-y-2 pt-1">
          {SUNNAH_CUPPING_POINTS.map((pt) => (
            <div
              key={pt.id}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex flex-col gap-0.5"
            >
              <span className="font-bold text-emerald-400">{pt.name}</span>
              <span className="text-slate-300 text-[11px]">{pt.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
