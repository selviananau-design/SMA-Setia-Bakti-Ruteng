import React, { useState } from 'react';
import {
  Search,
  Bell,
  Phone,
  Mail,
  Compass,
  FileEdit,
  Users,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  LogOut,
  ArrowRight,
  Sparkles,
  X,
} from 'lucide-react';
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
  activeTab?: string;
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
  activeTab = 'beranda',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim());
      setSearchOpen(false);
    }
  };

  return (
    <header className="w-full bg-white z-50">
      {/* 1. TOP ANNOUNCEMENT BANNER (Matches top promo banner in reference) */}
      <div className="w-full bg-[#170e28] text-white text-xs py-2 px-4 border-b border-purple-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              PPDB 2026/2027
            </span>
            <span className="text-slate-200 text-xs font-medium hidden sm:inline">
              Penerimaan Peserta Didik Baru Telah Dibuka! Buka Peluang Masa Depan Terbaikmu.
            </span>
            <span className="text-slate-200 text-xs font-medium sm:hidden">
              Penerimaan Siswa Baru Dibuka!
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('ppdb')}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold px-3 py-1 rounded text-[11px] flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <span>DAFTAR SEKARANG</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 2. TOP UTILITY BAR (Matches clean utility row in reference) */}
      <div className="w-full bg-[#f8fafc] border-b border-slate-200 text-slate-600 text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Utility Links */}
          <div className="flex items-center space-x-6 text-[11px] font-semibold">
            <button
              onClick={() => onNavigateTab('akademik')}
              className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Tur Sekolah</span>
            </button>
            <button
              onClick={() => onNavigateTab('ppdb')}
              className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer text-purple-900 font-bold"
            >
              <FileEdit className="w-3.5 h-3.5 text-purple-700" />
              <span>Daftar PPDB</span>
            </button>
            <button
              onClick={() => onNavigateTab('statistik')}
              className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>Siswa & Alumni</span>
            </button>
            <button
              onClick={() => onNavigateTab('guru')}
              className="flex items-center gap-1.5 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              <span>Guru & Staf</span>
            </button>
          </div>

          {/* Right Contact Info & Security */}
          <div className="flex items-center space-x-5 text-[11px]">
            <a
              href="tel:038521455"
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors font-medium text-slate-600"
            >
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+62 (0385) 21455</span>
            </a>
            <span className="text-slate-300">|</span>
            <a
              href="mailto:info@smaksetiabaktirtg.sch.id"
              className="flex items-center gap-1.5 hover:text-slate-900 transition-colors font-medium text-slate-600"
            >
              <Mail className="w-3 h-3 text-slate-400" />
              <span>info@smaksetiabaktirtg.sch.id</span>
            </a>
            {onOpenEncryptionModal && (
              <>
                <span className="text-slate-300">|</span>
                <button
                  onClick={onOpenEncryptionModal}
                  className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors cursor-pointer"
                  title="Enkripsi Data 256-Bit Aktif Sesuai UU PDP"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Data Terenkripsi</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN STICKY NAVIGATION BAR (Matches sleek university navbar in reference) */}
      <div className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & School Name */}
          <div
            onClick={() => onNavigateTab('beranda')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Elegant Crest Logo (Square navy badge with gold heraldic star/cross) */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-[#0f172a] text-[#f59e0b] flex items-center justify-center border border-amber-400/40 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent pointer-events-none" />
              <div className="text-center flex flex-col items-center">
                <span className="text-amber-400 font-serif font-black text-lg leading-none">✦</span>
                <span className="text-[9px] font-sans font-extrabold tracking-widest text-slate-200 uppercase mt-0.5">
                  SB
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-serif uppercase leading-tight group-hover:text-purple-900 transition-colors">
                SMAK SETIA BAKTI
              </h1>
              <p className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                RUTENG — FLORES — NTT
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            <button
              onClick={() => onNavigateTab('beranda')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer pb-1 ${
                activeTab === 'beranda'
                  ? 'text-[#0f172a] border-b-2 border-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => onNavigateTab('akademik')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer pb-1 ${
                activeTab === 'akademik'
                  ? 'text-[#0f172a] border-b-2 border-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Akademik
            </button>
            <button
              onClick={() => onNavigateTab('ppdb')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer pb-1 flex items-center gap-1.5 ${
                activeTab === 'ppdb'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <span>PPDB Online</span>
              <span className="bg-emerald-500 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase">
                Buka
              </span>
            </button>
            <button
              onClick={() => onNavigateTab('galeri')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer pb-1 ${
                activeTab === 'galeri'
                  ? 'text-[#0f172a] border-b-2 border-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Kehidupan Siswa
            </button>
            <button
              onClick={() => onNavigateTab('guru')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer pb-1 ${
                activeTab === 'guru'
                  ? 'text-[#0f172a] border-b-2 border-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Guru & Staf
            </button>
            <button
              onClick={() => onNavigateTab('berita')}
              className={`text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer pb-1 ${
                activeTab === 'berita'
                  ? 'text-[#0f172a] border-b-2 border-[#0f172a]'
                  : 'text-slate-600 hover:text-[#0f172a]'
              }`}
            >
              Warta & Agenda
            </button>
          </nav>

          {/* Right Action Controls: Search, Notification, Apply Button */}
          <div className="flex items-center space-x-3">
            {/* Search Trigger / Inline Expandable */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    autoFocus
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Cari berita, agenda, siswa..."
                    className="w-48 sm:w-60 text-xs py-1.5 pl-3 pr-8 bg-slate-100 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2.5 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Buka Pencarian"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notifikasi & Pengumuman"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
              )}
            </button>

            {/* Session / Portal Login Pill */}
            {session ? (
              <div className="flex items-center gap-1.5 pl-1">
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-purple-700" />
                  <span className="hidden sm:inline">{session.name.split(' ')[0]}</span>
                  <span className="bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase">
                    {session.role}
                  </span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="hidden sm:inline-block text-xs font-bold text-slate-700 hover:text-slate-950 px-2 py-1.5 transition-colors cursor-pointer"
              >
                Masuk
              </button>
            )}

            {/* Primary Navy Pill Button: DAFTAR PPDB -> (Matches APPLY NOW -> in mockup) */}
            <button
              onClick={() => onNavigateTab('ppdb')}
              className="bg-[#0f172a] hover:bg-slate-800 text-white text-xs font-extrabold px-4 sm:px-5 py-2.5 rounded-md flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap"
            >
              <span>DAFTAR PPDB</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
