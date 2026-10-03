import React, { useState, useMemo } from 'react';
import { Patient, UserProfile, CuppingStatus } from '../types';
import {
  Search,
  Filter,
  UserPlus,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import { PatientCard } from '../components/PatientCard';
import { useToast } from '../context/ToastContext';

interface PatientsViewProps {
  patients: Patient[];
  profile: UserProfile | null;
  onOpenAddModal: () => void;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (id: string, name: string) => void;
  onToggleStatus: (id: string, currentStatus: CuppingStatus) => void;
  onIncrementSession: (patient: Patient) => void;
}

type FilterStatus = 'Semua' | 'Akan Bekam' | 'Sudah Bekam' | 'Hari Ini' | 'Pasien Tetap';
type SortOption = 'jadwal' | 'nama' | 'riwayat';

export const PatientsView: React.FC<PatientsViewProps> = ({
  patients,
  profile,
  onOpenAddModal,
  onEditPatient,
  onDeletePatient,
  onToggleStatus,
  onIncrementSession,
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('Semua');
  const [sortOption, setSortOption] = useState<SortOption>('jadwal');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredPatients = useMemo(() => {
    let result = [...patients];

    // Status filter
    if (statusFilter === 'Akan Bekam') {
      result = result.filter((p) => p.status === 'Akan Bekam');
    } else if (statusFilter === 'Sudah Bekam') {
      result = result.filter((p) => p.status === 'Sudah Bekam');
    } else if (statusFilter === 'Hari Ini') {
      result = result.filter((p) => p.nextCuppingDate === todayStr);
    } else if (statusFilter === 'Pasien Tetap') {
      result = result.filter((p) => (p.cuppingCount || 1) >= 3);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.complaints && p.complaints.toLowerCase().includes(q)) ||
          (p.cuppingPoints && p.cuppingPoints.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'nama') {
        return a.name.localeCompare(b.name);
      } else if (sortOption === 'riwayat') {
        return (b.lastCuppingDate || '').localeCompare(a.lastCuppingDate || '');
      } else {
        // default: Jadwal Terdekat
        return (a.nextCuppingDate || '9999').localeCompare(b.nextCuppingDate || '9999');
      }
    });

    return result;
  }, [patients, statusFilter, searchQuery, sortOption, todayStr]);

  const handleFilterClick = (filter: FilterStatus) => {
    setStatusFilter(filter);
    showToast(`Filter: ${filter}`, 'info');
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortOption(newSort);
    const label = newSort === 'jadwal' ? 'Jadwal Terdekat' : newSort === 'nama' ? 'Nama Pasien A-Z' : 'Riwayat Terbaru';
    showToast(`Urutkan: ${label}`, 'info');
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>Data Pasien & Kunjungan</span>
          </h1>
          <p className="text-xs text-slate-400">Total {patients.length} data pasien terkelola</p>
        </div>

        <button
          onClick={() => {
            showToast('Membuka formulir tambah pasien', 'info');
            onOpenAddModal();
          }}
          className="py-2.5 px-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 active:scale-95 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama, WhatsApp, keluhan, alamat..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              showToast('Pencarian dibersihkan', 'info');
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
          >
            Hapus
          </button>
        )}
      </div>

      {/* Status Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          onClick={() => handleFilterClick('Semua')}
          className={`py-1.5 px-3 rounded-xl font-bold whitespace-nowrap transition active:scale-95 ${
            statusFilter === 'Semua'
              ? 'bg-emerald-500 text-slate-950'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Semua ({patients.length})
        </button>

        <button
          onClick={() => handleFilterClick('Akan Bekam')}
          className={`py-1.5 px-3 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 ${
            statusFilter === 'Akan Bekam'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-800 text-amber-300/80 hover:text-amber-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Janji Bekam ({patients.filter((p) => p.status === 'Akan Bekam').length})</span>
        </button>

        <button
          onClick={() => handleFilterClick('Sudah Bekam')}
          className={`py-1.5 px-3 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 ${
            statusFilter === 'Sudah Bekam'
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-800 text-emerald-300/80 hover:text-emerald-200'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Sudah Bekam ({patients.filter((p) => p.status === 'Sudah Bekam').length})</span>
        </button>

        <button
          onClick={() => handleFilterClick('Hari Ini')}
          className={`py-1.5 px-3 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 ${
            statusFilter === 'Hari Ini'
              ? 'bg-teal-500 text-slate-950'
              : 'bg-slate-800 text-teal-300/80 hover:text-teal-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Hari Ini ({patients.filter((p) => p.nextCuppingDate === todayStr).length})</span>
        </button>

        <button
          onClick={() => handleFilterClick('Pasien Tetap')}
          className={`py-1.5 px-3 rounded-xl font-bold whitespace-nowrap flex items-center gap-1.5 transition active:scale-95 ${
            statusFilter === 'Pasien Tetap'
              ? 'bg-amber-500 text-slate-950'
              : 'bg-slate-800 text-amber-300/80 hover:text-amber-200'
          }`}
        >
          <span>⭐ Pasien Tetap ({patients.filter((p) => (p.cuppingCount || 1) >= 3).length})</span>
        </button>
      </div>

      {/* Sorting bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Menampilkan {filteredPatients.length} pasien</span>
        </div>

        <div className="flex items-center gap-1">
          <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
          <select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="bg-slate-800 text-slate-200 rounded-lg px-2 py-1 text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="jadwal">Jadwal Terdekat</option>
            <option value="nama">Nama A-Z</option>
            <option value="riwayat">Riwayat Terakhir</option>
          </select>
        </div>
      </div>

      {/* Patient List */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/40 rounded-2xl border border-dashed border-slate-700 p-6">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-semibold">Tidak Ada Pasien Ditemukan</p>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery
              ? 'Tidak ada data pasien yang cocok dengan kata kunci pencarian.'
              : 'Belum ada data untuk kategori filter ini.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('Semua');
                showToast('Reset filter dan pencarian', 'info');
              }}
              className="mt-3 text-xs text-emerald-400 font-bold hover:underline"
            >
              Reset Pencarian & Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPatients.map((patient) => (
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
  );
};
