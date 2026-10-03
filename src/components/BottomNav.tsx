import React from 'react';
import { LayoutDashboard, Users, BookOpen, Settings, Info } from 'lucide-react';
import { ActiveTab } from '../types';
import { useToast } from '../context/ToastContext';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  patientCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, patientCount }) => {
  const { showToast } = useToast();

  const handleTabClick = (tab: ActiveTab, label: string) => {
    setActiveTab(tab);
    showToast(`Membuka menu ${label}`, 'info');
  };

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Beranda', icon: LayoutDashboard },
    { id: 'patients' as ActiveTab, label: 'Pasien', icon: Users, badge: patientCount },
    { id: 'guide' as ActiveTab, label: 'Panduan', icon: BookOpen },
    { id: 'settings' as ActiveTab, label: 'Pengaturan', icon: Settings },
    { id: 'about' as ActiveTab, label: 'Tentang', icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-emerald-900/60 safe-bottom">
      <div className="max-w-md mx-auto px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id, item.label)}
              className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-150 relative ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-emerald-400' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-emerald-500 text-slate-950 text-[10px] font-black rounded-full px-1.5 py-0.2 min-w-4 text-center leading-tight">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight ${isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-5 h-1 bg-emerald-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
