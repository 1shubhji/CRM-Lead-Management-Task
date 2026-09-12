'use client';

import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-2xl border backdrop-blur-md transition-all duration-300 animate-slide-in-right ${
        isSuccess
          ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
          : 'bg-rose-950/80 border-rose-500/30 text-rose-200'
      }`}
    >
      <div className="flex-shrink-0">
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-400" />
        )}
      </div>
      <div className="text-sm font-medium pr-2 max-w-[300px] leading-relaxed">
        {message}
      </div>
      <button
        onClick={onClose}
        className={`p-1 rounded-lg transition-colors hover:bg-white/10 ${
          isSuccess ? 'text-emerald-400' : 'text-rose-400'
        }`}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
