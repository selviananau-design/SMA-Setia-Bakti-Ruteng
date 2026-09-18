import React, { useState, useEffect } from 'react';
import { Bell, X, ShieldAlert, Sparkles, Check, ChevronRight } from 'lucide-react';
import { PushNotification } from '../types';

interface PushNotificationBannerProps {
  notifications: PushNotification[];
  onMarkAsRead: (id: string) => void;
  onNavigateToPPDB: () => void;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  notifications,
  onMarkAsRead,
  onNavigateToPPDB,
}) => {
  const [activePopup, setActivePopup] = useState<PushNotification | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(true);

  useEffect(() => {
    // Show the most recent unread notification with priority 'urgent' or first item after 1.5s
    const unread = notifications.find((n) => !n.isRead);
    if (unread) {
      const timer = setTimeout(() => {
        setActivePopup(unread);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!activePopup) return null;

  const handleDismiss = () => {
    onMarkAsRead(activePopup.id);
    setActivePopup(null);
  };

  const handleActionClick = () => {
    if (activePopup.link) {
      onNavigateToPPDB();
    }
    handleDismiss();
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-slideUp">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-purple-300 p-4 overflow-hidden relative">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              activePopup.priority === 'urgent'
                ? 'bg-rose-100 text-rose-700'
                : activePopup.priority === 'akademik'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <Bell className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                Notifikasi Push Real-Time
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{activePopup.timestamp}</span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug">
              {activePopup.title}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
              {activePopup.message}
            </p>

            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100">
              {activePopup.link ? (
                <button
                  onClick={handleActionClick}
                  className="text-xs font-bold text-white bg-[#432874] hover:bg-[#341b5e] px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Buka Informasi</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : null}

              <button
                onClick={handleDismiss}
                className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
