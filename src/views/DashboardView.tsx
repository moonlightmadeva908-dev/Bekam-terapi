import React from 'react';
import { Patient, UserProfile, ActiveTab } from '../types';
import {
  Users,
  CalendarDays,
  CheckCircle2,
  Clock,
  UserPlus,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { HeaderBanner } from '../components/HeaderBanner';
import { PatientCard } from '../components/PatientCard';
import { useToast } from '../context/ToastContext';

interface DashboardViewProps {
  patients: Patient[];
  profile: UserProfile | null;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: Patient['status']) => void;
  onIncrementSession: (patient: Patient) => void;
  isInstallable: boolean;
  onInstall: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  profile,
  setActiveTab,
  onOpenAddModal,
  onEditPatient,
  onDeletePatient,
  onToggleStatus,
  onIncrementSession,
  isInstallable,
  onInstall,
}) => {
  const { showToast } = useToast();

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculation of statistics
  const totalPatients = patients.length;
  const completedPatients = patients.filter((p) => p.status === 'Sudah Bekam').length;
  const upcomingPatients = patients.filter((p) => p.status === 'Akan Bekam').length;
  const todayPatients = patients.filter((p) => p.nextCuppingDate === todayStr);
  const regularPatients = patients.filter((p) => (p.cuppingCount || 1) >= 3).length;

  // Recent patients
  const recentPatients = [...patients].slice(0, 5);

  return (
    <div className="space-y-5 pb-6">
      {/* Header Banner & Practitioner Identity */}
      <HeaderBanner
        profile={profile}
        onEditProfile={() => setActiveTab('settings')}
        isInstallable={isInstallable}
        onInstall={onInstall}
      />

      {/* Ringkasan Informasi / Statistik Cards */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Statistik Terapi</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Update realtime</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card Total Pasien */}
          <div
            onClick={() => {
              showToast(`Total terdaftar: ${totalPatients} pasien`, 'info');
              setActiveTab('patients');
            }}
            className="p-3.5 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-slate-700 hover:border-emerald-500/50 shadow-sm cursor-pointer transition active:scale-98"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold text-slate-300">Total Pasien</span>
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-black text-white">{totalPatients}</div>
            <p className="text-[10px] text-slate-400 mt-1">Data tersimpan aman</p>
          </div>

          {/* Card Jadwal Hari Ini */}
          <div
            onClick={() => {
              showToast(`Ada ${todayPatients.length} jadwal kunjungan bekam hari ini`, 'info');
              setActiveTab('patients');
            }}
            className="p-3.5 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-amber-600/40 hover:border-amber-400 shadow-sm cursor-pointer transition active:scale-98 relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-semibold text-slate-300">Kunjungan Hari Ini</span>
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/40">
                <CalendarDays className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-300">{todayPatients.length}</div>
            <p className="text-[10px] text-amber-400/80 mt-1 font-medium">Perlu dikonfirmasi</p>
          </div>

          {/* Card Sudah Bekam */}
          <div
            onClick={() => {
              showToast(`${completedPatients} pasien berstatus Sudah Bekam`, 'success');
              setActiveTab('patients');
            }}
            className="p-3.5 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-slate-700 hover:border-emerald-500/50 shadow-sm cursor-pointer transition active:scale-98"
          >
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-semibold text-slate-300">Sudah Dibekam</span>
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400">{completedPatients}</div>
            <p className="text-[10px] text-slate-400 mt-1">Selesai diterapi</p>
          </div>

          {/* Card Akan Bekam */}
          <div
            onClick={() => {
              showToast(`${upcomingPatients} pasien dengan status Janji Bekam`, 'warning');
              setActiveTab('patients');
            }}
            className="p-3.5 bg-gradient-to-br from-slate-800 to-slate-850 rounded-2xl border border-slate-700 hover:border-amber-500/50 shadow-sm cursor-pointer transition active:scale-98"
          >
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-semibold text-slate-300">Janji Bekam</span>
              <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-800/40">
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div className="text-2xl font-black text-amber-300">{upcomingPatients}</div>
            <p className="text-[10px] text-slate-400 mt-1">Menunggu kunjungan</p>
          </div>
        </div>
      </div>

      {/* Quick Action Button */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/60 via-slate-800 to-teal-950 border border-emerald-600/40 shadow-lg flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white">Bekam Panggilan (Door-to-Door)</h3>
          <p className="text-xs text-emerald-300/80">Jadwalkan janji temu & kirim konfirmasi WA</p>
        </div>
        <button
          onClick={() => {
            showToast('Membuka formulir janji pasien baru...', 'info');
            onOpenAddModal();
          }}
          className="py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Janji</span>
        </button>
      </div>

      {/* Jadwal Hari Ini Section */}
      {todayPatients.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-amber-300 tracking-wide uppercase flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Jadwal Kunjungan Hari Ini ({todayPatients.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {todayPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                therapist={profile}
                onEdit={onEditPatient}
                onDelete={onDeletePatient}
                onToggleStatus={onToggleStatus}
                onIncrementSession={onIncrementSession}
              />
            ))}
          </div>
        </div>
      )}

      {/* Pasien Terbaru Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Daftar Pasien Terbaru</span>
          </h2>
          {patients.length > 0 && (
            <button
              onClick={() => {
                showToast('Membuka seluruh daftar pasien', 'info');
                setActiveTab('patients');
              }}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <span>Lihat Semua ({patients.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentPatients.length === 0 ? (
          <div className="text-center py-10 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 p-6">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">Belum Ada Data Pasien</p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              Mulai catat pasien bekam Anda dengan menekan tombol Tambah Pasien di atas.
            </p>
            <button
              onClick={() => {
                showToast('Membuka formulir pasien baru', 'info');
                onOpenAddModal();
              }}
              className="mt-4 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
            >
              + Tambah Pasien Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPatients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                therapist={profile}
                onEdit={onEditPatient}
                onDelete={onDeletePatient}
                onToggleStatus={onToggleStatus}
                onIncrementSession={onIncrementSession}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
