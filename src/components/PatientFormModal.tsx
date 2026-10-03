import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Phone, MapPin, User, FileText, CheckCircle2, BookmarkPlus } from 'lucide-react';
import { Patient, CuppingStatus, SUNNAH_CUPPING_POINTS } from '../types';
import { useToast } from '../context/ToastContext';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Patient, 'id' | 'userId'>) => Promise<void>;
  initialData?: Patient | null;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [lastCuppingDate, setLastCuppingDate] = useState('');
  const [nextCuppingDate, setNextCuppingDate] = useState('');
  const [nextCuppingTime, setNextCuppingTime] = useState('09:00');
  const [status, setStatus] = useState<CuppingStatus>('Akan Bekam');
  const [complaints, setComplaints] = useState('');
  const [cuppingPoints, setCuppingPoints] = useState('');
  const [cuppingCount, setCuppingCount] = useState<number>(1);

  // Populate form if initialData is provided
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setAddress(initialData.address || '');
      setPhone(initialData.phone || '');
      setLastCuppingDate(initialData.lastCuppingDate || '');
      setNextCuppingDate(initialData.nextCuppingDate || '');
      setNextCuppingTime(initialData.nextCuppingTime || '09:00');
      setStatus(initialData.status || 'Akan Bekam');
      setComplaints(initialData.complaints || '');
      setCuppingPoints(initialData.cuppingPoints || '');
      setCuppingCount(initialData.cuppingCount || 1);
    } else {
      // Default dates
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      setName('');
      setAddress('');
      setPhone('');
      setLastCuppingDate(today);
      setNextCuppingDate(nextMonth);
      setNextCuppingTime('09:00');
      setStatus('Akan Bekam');
      setComplaints('');
      setCuppingPoints('');
      setCuppingCount(1);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddPointChip = (pointName: string) => {
    if (!cuppingPoints.includes(pointName)) {
      const updated = cuppingPoints ? `${cuppingPoints}, ${pointName}` : pointName;
      setCuppingPoints(updated);
      showToast(`Menambahkan titik ${pointName}`, 'info');
    } else {
      showToast(`Titik ${pointName} sudah ada`, 'warning');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Nama pasien wajib diisi!', 'warning');
      return;
    }
    if (!phone.trim()) {
      showToast('Nomor WhatsApp wajib diisi!', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        name: name.trim(),
        address: address.trim(),
        phone: phone.trim(),
        lastCuppingDate,
        nextCuppingDate,
        nextCuppingTime,
        status,
        complaints: complaints.trim(),
        cuppingPoints: cuppingPoints.trim(),
        cuppingCount,
      });
      showToast(initialData ? 'Data pasien berhasil diperbarui!' : 'Pasien baru berhasil disimpan!', 'success');
      onClose();
    } catch (error: any) {
      showToast(`Gagal menyimpan: ${error?.message || 'Terjadi kesalahan'}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-emerald-900/80 rounded-t-3xl sm:rounded-3xl shadow-2xl text-white max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-emerald-900/40 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-md rounded-t-3xl z-10">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookmarkPlus className="w-5 h-5 text-emerald-400" />
              <span>{initialData ? 'Edit Data Pasien' : 'Tambah Pasien Baru'}</span>
            </h2>
            <p className="text-xs text-slate-400">Pencatatan rekam terapi bekam thibbun nabawi</p>
          </div>
          <button
            onClick={() => {
              showToast('Form ditutup', 'info');
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Status Pasien Saat Ini *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setStatus('Akan Bekam');
                  showToast('Status dipilih: Akan Bekam', 'info');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  status === 'Akan Bekam'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Akan Bekam (Jadwal)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus('Sudah Bekam');
                  showToast('Status dipilih: Sudah Bekam', 'info');
                }}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  status === 'Sudah Bekam'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Sudah Bekam (Selesai)</span>
              </button>
            </div>
          </div>

          {/* Nama Pasien */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nama Lengkap Pasien *
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
                placeholder="Contoh: Bpk. Muhammad Ilham"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Nomor WhatsApp */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Nomor WhatsApp Pasien * (Format: 08xxx atau 628xxx)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Alamat Rumah Pasien (Door to Door) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Alamat Lengkap Rumah Pasien / Patokan (Tujuan Bekam Panggilan)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Contoh: Jl. Merdeka No. 45, RT 02/05 (Depan Masjid Al-Ikhlas)"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tanggal Janji Bekam / Tanggal Riwayat Bekam */}
          {status === 'Akan Bekam' ? (
            /* Mode Akan Bekam: Tanggal Janji Bekam */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-950/20 border border-amber-500/30 rounded-2xl">
              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Tanggal Janji Bekam (Kunjungan Rumah) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    required
                    value={nextCuppingDate || lastCuppingDate}
                    onChange={(e) => {
                      setNextCuppingDate(e.target.value);
                      setLastCuppingDate(e.target.value);
                    }}
                    className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-amber-500/50 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-300 mb-1">
                  Estimasi Jam Tiba di Rumah Pasien
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="time"
                    value={nextCuppingTime}
                    onChange={(e) => setNextCuppingTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-amber-500/50 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Mode Sudah Bekam: Tanggal Terakhir Dibekam & Jadwal Bekam Selanjutnya */
            <div className="space-y-3 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1">
                    Tanggal Terakhir Dibekam
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      value={lastCuppingDate}
                      onChange={(e) => setLastCuppingDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-300 mb-1">
                    Jadwal Bekam Selanjutnya *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      required
                      value={nextCuppingDate}
                      onChange={(e) => setNextCuppingDate(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Rencana Jam Kunjungan Selanjutnya (WIB)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <input
                    type="time"
                    value={nextCuppingTime}
                    onChange={(e) => setNextCuppingTime(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Riwayat Berapa Kali Berbekam (Pasien Tetap / Rutin) */}
          <div className="p-3 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-200">
                Riwayat Sesi: Sudah Berapa Kali Pasien Berbekam?
              </label>
              {cuppingCount >= 3 ? (
                <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-500/50 flex items-center gap-1 shadow-sm">
                  <span>⭐ Pasien Tetap</span>
                </span>
              ) : (
                <span className="text-[10px] text-slate-400">
                  (≥ 3x = Pasien Tetap Rutin)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const newVal = Math.max(1, cuppingCount - 1);
                  setCuppingCount(newVal);
                  showToast(`Jumlah sesi: ${newVal} kali`, 'info');
                }}
                className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-black text-lg flex items-center justify-center transition active:scale-90 shrink-0"
              >
                -
              </button>

              <div className="flex-1 py-2 px-3 bg-slate-900 rounded-xl border border-slate-700/80 text-center">
                <span className="text-base font-black text-white">{cuppingCount}</span>
                <span className="text-xs text-emerald-400 font-semibold ml-1.5">Kali Berbekam</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newVal = cuppingCount + 1;
                  setCuppingCount(newVal);
                  showToast(`Jumlah sesi ditambah: ${newVal} kali!`, 'success');
                }}
                className="w-10 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg flex items-center justify-center transition active:scale-90 shrink-0 shadow-md shadow-emerald-950/40"
              >
                +
              </button>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Aplikasi otomatis mengenali pasien tetap bila sudah menjalani minimal 3 sesi bekam.
            </p>
          </div>

          {/* Keluhan Pasien / Anamnesa */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Keluhan & Gejala Pasien
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </div>
              <textarea
                rows={2}
                value={complaints}
                onChange={(e) => setComplaints(e.target.value)}
                placeholder="Contoh: Sering pusing tengkuk, kolesterol tinggi, pegal linu di kedua bahu..."
                className="w-full pl-10 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Titik Bekam */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-300">
                Titik Bekam / Rekomendasi Titik
              </label>
              <span className="text-[10px] text-emerald-400 font-semibold">Klik chip untuk tambah</span>
            </div>

            <textarea
              rows={2}
              value={cuppingPoints}
              onChange={(e) => setCuppingPoints(e.target.value)}
              placeholder="Contoh: Al-Kahil, Al-Akhda'ain, Ummu Mughits..."
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 mb-2"
            />

            {/* Quick Sunnah Points Chips */}
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800">
              {SUNNAH_CUPPING_POINTS.map((pt) => (
                <button
                  type="button"
                  key={pt.id}
                  onClick={() => handleAddPointChip(pt.name.split(' (')[0])}
                  className="px-2 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/40 text-[11px] text-emerald-300 active:scale-95 transition"
                  title={pt.desc}
                >
                  + {pt.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 pb-2 border-t border-slate-800 flex gap-2">
            <button
              type="button"
              onClick={() => {
                showToast('Batal menyimpan data', 'info');
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold hover:bg-slate-700 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-bold shadow-lg shadow-emerald-900/40 transition active:scale-98 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : initialData ? 'Perbarui Data' : 'Simpan Pasien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
