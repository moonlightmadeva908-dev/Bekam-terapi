import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  patientName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  patientName,
  onConfirm,
  onCancel,
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    showToast('Penghapusan dibatalkan', 'info');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-sm bg-slate-900 border border-rose-900/80 rounded-3xl p-5 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-700/60 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="text-base font-bold text-white">Hapus Data Pasien?</h3>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
          Apakah Anda yakin ingin menghapus data rekam medis pasien{' '}
          <strong className="text-white">"{patientName}"</strong>? Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            type="button"
            onClick={handleCancel}
            className="py-2.5 px-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Ya, Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
};
