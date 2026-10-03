import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4">
      {toasts.map((toast) => {
        const bgColors = {
          success: 'bg-emerald-600 text-white shadow-emerald-900/30',
          info: 'bg-teal-700 text-white shadow-teal-900/30',
          warning: 'bg-amber-600 text-white shadow-amber-900/30',
          error: 'bg-rose-600 text-white shadow-rose-900/30',
        }[toast.type];

        const Icon = {
          success: CheckCircle2,
          info: Info,
          warning: AlertTriangle,
          error: XCircle,
        }[toast.type];

        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg border border-white/20 backdrop-blur-md transition-all duration-200 animate-in fade-in slide-in-from-top-3 text-sm font-medium ${bgColors}`}
            style={{ maxWidth: '90vw' }}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="leading-snug">{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
