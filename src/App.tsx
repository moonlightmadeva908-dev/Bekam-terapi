import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { ToastContainer } from './components/ToastContainer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { BottomNav } from './components/BottomNav';
import { PWAInstallModal } from './components/PWAInstallModal';
import { PatientFormModal } from './components/PatientFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { DashboardView } from './views/DashboardView';
import { PatientsView } from './views/PatientsView';
import { SettingsView } from './views/SettingsView';
import { GuideView } from './views/GuideView';
import { AboutView } from './views/AboutView';
import { AuthView } from './views/AuthView';
import { Patient, ActiveTab } from './types';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  subscribePatients,
  addPatient,
  updatePatient,
  deletePatient,
  togglePatientStatus,
} from './services/patientService';
import { testConnection } from './firebase';

function MainApp() {
  const { currentUser, userProfile, loading, isDemoUser, logout, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);

  // Patient Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingName, setDeletingName] = useState<string>('');

  // PWA Install Hook
  const {
    isInstallable,
    isIOS,
    showAutoPrompt,
    install,
    dismissPrompt,
    triggerPromptManually,
  } = usePWAInstall();

  // Test Firebase connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Subscribe to patients data when user is authenticated
  useEffect(() => {
    if (!currentUser) {
      setPatients([]);
      setLoadingPatients(false);
      return;
    }

    setLoadingPatients(true);
    const unsubscribe = subscribePatients(
      currentUser.uid,
      (data) => {
        setPatients(data);
        setLoadingPatients(false);
      },
      (error) => {
        console.error('Snapshot error:', error);
        setLoadingPatients(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Handle Form Submit (Add / Edit)
  const handleSavePatient = async (data: Omit<Patient, 'id' | 'userId'>) => {
    if (!currentUser) return;
    if (editingPatient) {
      await updatePatient(currentUser.uid, editingPatient.id, data);
    } else {
      await addPatient(currentUser.uid, data);
    }
  };

  // Handle Toggle Status
  const handleToggleStatus = async (id: string, currentStatus: Patient['status']) => {
    if (!currentUser) return;
    try {
      const target = patients.find((p) => p.id === id);
      const nextStatus = currentStatus === 'Sudah Bekam' ? 'Akan Bekam' : 'Sudah Bekam';
      const updateData: Partial<Patient> = { status: nextStatus };
      if (nextStatus === 'Sudah Bekam' && target) {
        updateData.cuppingCount = (target.cuppingCount || 1) + 1;
        updateData.lastCuppingDate = new Date().toISOString().split('T')[0];
      }
      await updatePatient(currentUser.uid, id, updateData);
    } catch (err: any) {
      showToast('Gagal mengubah status pasien', 'error');
    }
  };

  // Quick increment cupping session count for routine patients
  const handleIncrementSession = async (patient: Patient) => {
    if (!currentUser) return;
    try {
      const newCount = (patient.cuppingCount || 1) + 1;
      await updatePatient(currentUser.uid, patient.id, { cuppingCount: newCount });
      showToast(`Sesi berbekam ${patient.name} bertambah jadi ${newCount} kali!`, 'success');
    } catch (err: any) {
      showToast('Gagal memperbarui jumlah sesi', 'error');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setIsFormOpen(true);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingPatient(null);
    setIsFormOpen(true);
  };

  // Delete flow
  const handleRequestDelete = (id: string, name: string) => {
    setDeletingId(id);
    setDeletingName(name);
  };

  const handleConfirmDelete = async () => {
    if (!currentUser || !deletingId) return;
    try {
      await deletePatient(currentUser.uid, deletingId);
      showToast(`Data ${deletingName} berhasil dihapus`, 'success');
      setDeletingId(null);
    } catch (err: any) {
      showToast('Gagal menghapus data pasien', 'error');
    }
  };

  // Render Loading Splash
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-0.5 shadow-2xl flex items-center justify-center animate-pulse">
          <img src="/pwa-192x192.png" alt="Bekam Jr." className="w-full h-full object-cover rounded-2xl" />
        </div>
        <p className="mt-4 text-emerald-400 font-bold text-sm tracking-wide">
          Memuat Bekam Jr...
        </p>
        <p className="text-slate-400 text-xs mt-1">Solusi Rekam Terapi Thibbun Nabawi</p>
      </div>
    );
  }

  // If not logged in, show Auth View
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
        <AuthView />
        <ToastContainer />
        <OfflineIndicator />
        <PWAInstallModal
          show={showAutoPrompt}
          onClose={dismissPrompt}
          onInstall={install}
          isIOS={isIOS}
          isInstallable={isInstallable}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <OfflineIndicator />
      <ToastContainer />

      {/* Main Container - Mobile First frame */}
      <main className="max-w-md mx-auto w-full px-3.5 pt-4 pb-24 flex-1">
        {isDemoUser && (
          <div className="mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between gap-2 shadow-sm">
            <span className="font-medium text-[11px] leading-tight">
              ⚡ <strong>Mode Demo Praktisi</strong> • Data uji coba lokal aktif
            </span>
            <button
              onClick={() => {
                showToast('Keluar dari mode demo', 'info');
                logout();
              }}
              className="px-2 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[10px] shrink-0 active:scale-95 transition"
            >
              Masuk Akun
            </button>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            patients={patients}
            profile={userProfile}
            setActiveTab={setActiveTab}
            onOpenAddModal={handleOpenAdd}
            onEditPatient={handleOpenEdit}
            onDeletePatient={handleRequestDelete}
            onToggleStatus={handleToggleStatus}
            onIncrementSession={handleIncrementSession}
            isInstallable={isInstallable}
            onInstall={triggerPromptManually}
          />
        )}

        {activeTab === 'patients' && (
          <PatientsView
            patients={patients}
            profile={userProfile}
            onOpenAddModal={handleOpenAdd}
            onEditPatient={handleOpenEdit}
            onDeletePatient={handleRequestDelete}
            onToggleStatus={handleToggleStatus}
            onIncrementSession={handleIncrementSession}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            profile={userProfile}
            onRefreshData={refreshProfile}
            isInstallable={isInstallable}
            onInstall={triggerPromptManually}
          />
        )}

        {activeTab === 'guide' && <GuideView />}

        {activeTab === 'about' && <AboutView />}
      </main>

      {/* Android Ergonomic Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        patientCount={patients.length}
      />

      {/* Patient Add / Edit Modal */}
      <PatientFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSavePatient}
        initialData={editingPatient}
      />

      {/* Delete Patient Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingId}
        patientName={deletingName}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {/* PWA Android Auto Prompt Modal */}
      <PWAInstallModal
        show={showAutoPrompt}
        onClose={dismissPrompt}
        onInstall={install}
        isIOS={isIOS}
        isInstallable={isInstallable}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </AuthProvider>
  );
}
