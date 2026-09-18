import React, { useState } from 'react';
import { Search, Bell, ShieldCheck, UserCheck, Phone, MapPin, Mail, LogOut } from 'lucide-react';
import { SCHOOL_INFO } from '../data/mockData';
import { UserSession, PushNotification } from '../types';

interface HeaderProps {
  session: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  onOpenEncryptionModal?: () => void;
  notifications?: PushNotification[];
  onSearch?: (query: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onOpenLogin,
  onLogout,
  onOpenNotifications,
  onOpenEncryptionModal,
  notifications = [],
  onSearch,
  onNavigateTab = () => {},
}) => {
  const [searchInput, setSearchInput] = useState('');
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim());
    }
  };

  return (
    <header className="w-full bg-white border-b border-slate-200">
      {/* Topmost Bar - Exactly matching the reference image topbar */}
      <div className="bg-[#1f1635] text-slate-200 text-xs py-2 px-4 border-b border-purple-950">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: District / Home Breadcrumb */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigateTab('beranda')}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer font-medium"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Portal Resmi SMAK Setia Bakti
            </button>
            <span className="text-purple-400 hidden md:inline">|</span>
            <div className="hidden lg:flex items-center gap-2 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              <span>{SCHOOL_INFO.address}</span>
            </div>
          </div>

          {/* Right: Contact & Quick Links */}
          <div className="flex items-center gap-4 text-slate-300">
            <div className="hidden sm:flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>Telp: {SCHOOL_INFO.phone}</span>
            </div>
            <span className="text-purple-400 hidden sm:inline">|</span>
            <button
              onClick={onOpenEncryptionModal}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50"
              title="Perlindungan Enkripsi Data 256-Bit Aktif"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px] font-medium">Data Terenkripsi (UU PDP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Branding Header - Exactly matching Norwich City School District structure */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* School Logo and Title */}
        <div
          onClick={() => onNavigateTab('beranda')}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {/* Logo Emblem styled after the purple swirling torch emblem */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#3b1d70] via-[#512b91] to-[#25104a] flex items-center justify-center shadow-md shadow-purple-950/20 text-white border-2 border-purple-200/40 overflow-hidden flex-shrink-0">
            {/* Artistic Catholic Cross & Light Rays */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-300 via-transparent to-transparent"></div>
            <div className="text-center font-serif leading-none flex flex-col items-center">
              <span className="text-amber-300 text-lg font-bold">✝</span>
              <span className="text-[10px] tracking-widest font-sans font-bold text-purple-100 uppercase mt-0.5">SB</span>
              <span className="text-[8px] text-amber-200/90 font-mono">1968</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] sm:text-xs font-semibold tracking-wider text-purple-800 uppercase font-['Plus_Jakarta_Sans']">
              Yayasan Persekolahan St. Paulus Ruteng
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#321759] tracking-tight font-['Cinzel',serif] uppercase leading-tight">
              SMAK Setia Bakti
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-purple-900 tracking-wider uppercase font-['Cinzel',serif]">
              Ruteng - Flores - NTT
            </p>
          </div>
        </div>

        {/* Search Bar, Social Icons & User Role Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto justify-end">
          {/* Search Form matching the top-right search in reference photo */}
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full sm:w-64">
            <div className="relative w-full">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari berita, agenda, siswa..."
                className="w-full pl-3 pr-8 py-1.5 text-xs bg-slate-100 border border-slate-300 rounded-l focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white text-slate-800 placeholder:text-slate-400"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#512b91] hover:bg-[#3d1d73] text-white px-3 py-1.5 rounded-r transition-colors flex items-center justify-center cursor-pointer"
              title="Cari"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Social Icons & Action Badges */}
          <div className="flex items-center gap-2">
            {/* Social media icons matching the blue circle icons in reference photo */}
            <a
              href="#facebook"
              onClick={(e) => {
                e.preventDefault();
                alert('Membuka Halaman Resmi Facebook: SMA Katolik Setia Bakti Ruteng Official');
              }}
              className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-xs font-bold hover:opacity-90 shadow-sm"
              title="Facebook SMAK Setia Bakti"
            >
              f
            </a>
            <a
              href="#twitter"
              onClick={(e) => {
                e.preventDefault();
                alert('Membuka Twitter/X: @SMAKSetiaBakti');
              }}
              className="w-7 h-7 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center text-xs font-bold hover:opacity-90 shadow-sm"
              title="Twitter/X SMAK Setia Bakti"
            >
              t
            </a>
            <a
              href="#youtube"
              onClick={(e) => {
                e.preventDefault();
                alert('Membuka Saluran YouTube: Humas SMAK Setia Bakti Ruteng');
              }}
              className="w-7 h-7 rounded-full bg-[#CD201F] text-white flex items-center justify-center text-xs font-bold hover:opacity-90 shadow-sm"
              title="YouTube SMAK Setia Bakti"
            >
              ▶
            </a>

            {/* Notification Bell with Badge */}
            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 text-slate-600 hover:text-purple-700 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer ml-1"
              title="Pemberitahuan & Notifikasi Real-Time"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Session / Login Status */}
            {session ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => onNavigateTab('portal')}
                  className="flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span className="max-w-[100px] truncate">{session.name.split(' ')[0]}</span>
                  <span className="bg-purple-700 text-white text-[10px] px-1 rounded uppercase font-mono">
                    {session.role}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-sm hover:shadow transition-all cursor-pointer flex items-center gap-1.5 ml-1"
              >
                <span>Login Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
