import React, { useState } from 'react';
import { Patient, UserProfile } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Activity,
  Home,
  BellRing,
  Heart,
  Sparkles,
  Plus,
} from 'lucide-react';
import { generateCuppingWhatsAppUrl, formatDateIndo } from '../utils/whatsapp';
import { useToast } from '../context/ToastContext';

interface PatientCardProps {
  patient: Patient;
  therapist: UserProfile | null;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: Patient['status']) => void;
  onIncrementSession?: (patient: Patient) => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  therapist,
  onEdit,
  onDelete,
  onToggleStatus,
  onIncrementSession,
}) => {
  const { showToast } = useToast();

  const isCompleted = patient.status === 'Sudah Bekam';
  const sessionCount = patient.cuppingCount || 1;
  const isRegularPatient = sessionCount >= 3;

  // Primary WA Action:
  // - If Sudah Bekam: Reminder that it's time to cup again (Sudah Waktunya Berbekam)
  // - If Akan Bekam: Confirmation & prep for door-to-door visit
  const handleSendWA = (type?: 'post-care' | 'next-reminder') => {
    const waUrl = generateCuppingWhatsAppUrl(patient, therapist, type);
    const actionLabel =
      type === 'post-care'
        ? 'Doa & Perawatan Pasca-Bekam'
        : type === 'next-reminder'
        ? 'Pengingat Jadwal Bekam Selanjutnya'
        : isCompleted
        ? 'Doa & Perawatan Pasca-Bekam'
        : 'Konfirmasi Kunjungan Rumah';

    showToast(`Membuka WA: ${actionLabel}...`, 'success');
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleStatusToggle = () => {
    const nextStatus = isCompleted ? 'Akan Bekam' : 'Sudah Bekam';
    showToast(`Status ${patient.name} diubah ke "${nextStatus}"`, 'info');
    onToggleStatus(patient.id, patient.status);
  };

  const handleQuickAddSession = () => {
    if (onIncrementSession) {
      onIncrementSession(patient);
    }
  };

  const appointmentDate = patient.nextCuppingDate || patient.lastCuppingDate;

  return (
    <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-md hover:border-emerald-600/50 transition-all duration-200">
      {/* Header card: Name and Status */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base text-white tracking-tight">
              {patient.name}
            </h3>

            {/* Badge Pasien Tetap / Rutin */}
            <div className="inline-flex items-center gap-1">
              <span
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border ${
                  isRegularPatient
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span>
                  {isRegularPatient ? '⭐ Pasien Tetap' : 'Pasien Bekam'} (ke-{sessionCount})
                </span>
              </span>

              {onIncrementSession && (
                <button
                  type="button"
                  onClick={handleQuickAddSession}
                  className="px-1.5 py-0.5 rounded-md bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white text-[10px] font-bold border border-slate-600 flex items-center gap-0.5 transition active:scale-95"
                  title="Tambah 1 Sesi Bekam"
                >
                  <Plus className="w-2.5 h-2.5" />
                  <span>1 Sesi</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-xs text-slate-300">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-emerald-400" />
              {patient.phone}
            </span>
            {patient.address && (
              <span className="flex items-center gap-1 text-slate-400">
                • <Home className="w-3 h-3 text-emerald-400" />
                <span className="line-clamp-1 max-w-[150px]">{patient.address}</span>
              </span>
            )}
          </div>
        </div>

        {/* Status Badge with toggle ability */}
        <button
          onClick={handleStatusToggle}
          title="Klik untuk ubah status"
          className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border transition active:scale-95 ${
            isCompleted
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
              : 'bg-amber-950/90 text-amber-300 border-amber-500/50 hover:bg-amber-900'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Sudah Bekam</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 text-amber-400" />
              <span>Akan Bekam</span>
            </>
          )}
        </button>
      </div>

      {/* Dates Section - Tailored for Door-to-Door Service */}
      {isCompleted ? (
        /* Status Sudah Bekam: Info riwayat & pengingat jadwal berikutnya (sudah waktunya berbekam) */
        <div className="grid grid-cols-2 gap-2 my-3 p-2.5 bg-slate-900/60 rounded-xl border border-slate-700/50 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
              Terakhir Berbekam:
            </span>
            <div className="flex items-center gap-1 text-slate-200 mt-0.5 font-medium">
              <Calendar className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{formatDateIndo(patient.lastCuppingDate)}</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-amber-400 uppercase tracking-wider block font-bold flex items-center gap-1">
              <BellRing className="w-3 h-3" />
              <span>Jadwal Selanjutnya:</span>
            </span>
            <div className="flex items-center gap-1 text-amber-300 mt-0.5 font-black">
              <Clock className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">
                {formatDateIndo(patient.nextCuppingDate)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Status Akan Bekam: Tanggal Janji Bekam Panggilan ke Rumah */
        <div className="my-3 p-2.5 bg-amber-950/20 rounded-xl border border-amber-500/40 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold flex items-center gap-1">
              <Home className="w-3 h-3" />
              <span>Tanggal Janji Bekam (Kunjungan Rumah):</span>
            </span>
            {patient.nextCuppingTime && (
              <span className="text-[11px] font-bold text-amber-300">
                Pukul {patient.nextCuppingTime} WIB
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-white mt-1 font-bold text-sm">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{formatDateIndo(appointmentDate)}</span>
          </div>
          {patient.address && (
            <div className="flex items-center gap-1 text-slate-300 text-[11px] mt-1 line-clamp-1">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>Lokasi: {patient.address}</span>
            </div>
          )}
        </div>
      )}

      {/* Complaints and Points Preview */}
      {(patient.complaints || patient.cuppingPoints) && (
        <div className="text-xs text-slate-300 mb-3 space-y-1 bg-slate-850 p-2 rounded-xl">
          {patient.complaints && (
            <div className="flex items-start gap-1.5 text-slate-300">
              <span className="text-slate-400 font-semibold shrink-0">Keluhan:</span>
              <span className="line-clamp-2 text-slate-200">{patient.complaints}</span>
            </div>
          )}
          {patient.cuppingPoints && (
            <div className="flex items-start gap-1.5 text-emerald-300">
              <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-1 font-medium">{patient.cuppingPoints}</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60 relative">
        {/* WhatsApp Buttons */}
        {isCompleted ? (
          <div className="flex-1 flex items-center gap-1.5 min-w-0">
            <button
              onClick={() => handleSendWA('post-care')}
              className="flex-1 py-2 px-2 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow transition active:scale-98 bg-emerald-600 hover:bg-emerald-500 text-white truncate"
              title="Kirim Pesan WhatsApp: Doa & Saran Pasca-Bekam"
            >
              <Heart className="w-3.5 h-3.5 fill-white text-emerald-600 shrink-0" />
              <span className="truncate">WA Pasca-Bekam</span>
            </button>
            <button
              onClick={() => handleSendWA('next-reminder')}
              className="py-2 px-2.5 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1 shadow transition active:scale-98 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shrink-0"
              title="Kirim Pesan WhatsApp: Pengingat Jadwal Bekam Selanjutnya (Waktunya Berbekam)"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-200 shrink-0" />
              <span>Ingatkan Jadwal</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => handleSendWA()}
            className="flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-98 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600 shrink-0" />
            <span>Kirim WA: Konfirmasi Kunjungan Rumah</span>
          </button>
        )}

        {/* Edit Button */}
        <button
          onClick={() => {
            showToast(`Mengedit data ${patient.name}`, 'info');
            onEdit(patient);
          }}
          className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 transition active:scale-95"
          title="Edit Data Pasien"
        >
          <Edit2 className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => {
            showToast(`Hapus data ${patient.name}?`, 'warning');
            onDelete(patient.id, patient.name);
          }}
          className="p-2 rounded-xl bg-rose-950/50 hover:bg-rose-900 border border-rose-800/40 text-rose-300 transition active:scale-95"
          title="Hapus Data Pasien"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
