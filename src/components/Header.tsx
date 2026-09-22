import React, { useState } from 'react';
import {
  Search,
  Bell,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  ChevronDown,
  UserCheck,
  LogOut,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Settings,
  Lock,
  Menu,
} from 'lucide-react';
import { SCHOOL_INFO } from '../data/mockData';
import { UserSession, PushNotification } from '../types';

interface HeaderProps {
  session: UserSession | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenNotifications: () => void;
  onOpenProfile?: () => void;
  notifications?: PushNotification[];
  onSearch?: (query: string) => void;
  onNavigateTab?: (tab: string, subTab?: string) => void;
  activeTab?: string;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onOpenLogin,
  onLogout,
  onOpenNotifications,
  onOpenProfile,
  notifications = [],
  onSearch,
  onNavigateTab = () => {},
  activeTab = 'beranda',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim());
      setSearchOpen(false);
    }
  };

  const navMenuItems = [
    { id: 'beranda', label: 'BERANDA', hasDropdown: false },
    {
      id: 'profil',
      label: 'PROFIL SEKOLAH',
      hasDropdown: true,
      subItems: [
        { label: 'Sambutan Kepala Sekolah', tab: 'profil', subTab: 'sambutan' },
        { label: 'Sejarah & Kilas Balik', tab: 'profil', subTab: 'sejarah' },
        { label: 'Visi, Misi & Karakter Kristiani', tab: 'profil', subTab: 'visi-misi' },
        { label: 'Sarana & Prasarana Kampus', tab: 'profil', subTab: 'fasilitas' },
        { label: 'Identitas & Legalitas Sekolah', tab: 'profil', subTab: 'identitas' },
      ],
    },
    {
      id: 'jurusan',
      label: 'JURUSAN & AKADEMIK',
      hasDropdown: true,
      subItems: [
        { label: 'Peminatan MIPA (Sains & Riset)', tab: 'jurusan', subTab: 'mipa' },
        { label: 'Peminatan IPS (Sosial & Humaniora)', tab: 'jurusan', subTab: 'ips' },
        { label: 'Peminatan Bahasa & Budaya Flores', tab: 'jurusan', subTab: 'bahasa' },
        { label: 'Prakarya, Kewirausahaan & Kriya', tab: 'jurusan', subTab: 'kriya' },
        { label: 'Semua Peminatan & Kurikulum Merdeka', tab: 'jurusan', subTab: 'semua' },
      ],
    },
    {
      id: 'ppdb',
      label: 'PPDB 2026/2027',
      isHighlight: true,
      hasDropdown: true,
      subItems: [
        { label: 'Formulir Pendaftaran PPDB 2026/2027', tab: 'ppdb', subTab: 'daftar' },
        { label: 'Syarat & Alur Pendaftaran', tab: 'ppdb', subTab: 'syarat' },
        { label: 'Rincian Biaya Pendidikan & SPP', tab: 'ppdb', subTab: 'biaya' },
        { label: 'Beasiswa Prestasi & Keringanan Yayasan', tab: 'ppdb', subTab: 'beasiswa' },
        { label: 'Jadwal Pelaksanaan & Tes Seleksi', tab: 'ppdb', subTab: 'jadwal' },
        { label: 'Cek Status Kelulusan Berkas', tab: 'ppdb', subTab: 'status' },
      ],
    },
    {
      id: 'guru',
      label: 'DEWAN GURU & STAF',
      hasDropdown: true,
      subItems: [
        { label: 'Semua Dewan Guru & Tenaga Pendidik', tab: 'guru', subTab: 'Semua' },
        { label: 'Kepala Sekolah & Manajemen', tab: 'guru', subTab: 'Pimpinan' },
        { label: 'Guru Bidang Studi MIPA', tab: 'guru', subTab: 'MIPA' },
        { label: 'Guru Bidang Studi IPS & Bahasa', tab: 'guru', subTab: 'IPS & Bahasa' },
        { label: 'Guru Agama & Budi Pekerti', tab: 'guru', subTab: 'Agama & Budi Pekerti' },
        { label: 'Kesiswaan & Bimbingan Konseling (BK)', tab: 'guru', subTab: 'Kesiswaan & BK' },
        { label: 'Staf Administrasi & Laboratorium', tab: 'guru', subTab: 'Tata Usaha' },
      ],
    },
    {
      id: 'kehidupan',
      label: 'WARTA & KESISWAAN',
      hasDropdown: true,
      subItems: [
        { label: 'Warta & Berita Resmi Sekolah', tab: 'berita', subTab: '' },
        { label: 'Ekstrakurikuler Unggulan', tab: 'kehidupan', subTab: 'ekskul' },
        { label: 'Karya Kreatif Siswa (Cerpen & Puisi)', tab: 'kehidupan', subTab: 'karya' },
        { label: 'Organisasi Siswa (OSIS) & MPK', tab: 'kehidupan', subTab: 'osis' },
        { label: 'Asrama Siswa & Lingkungan Sekolah', tab: 'kehidupan', subTab: 'asrama' },
        { label: 'Galeri Foto & Dokumentasi Kegiatan', tab: 'kehidupan', subTab: 'galeri' },
      ],
    },
    {
      id: 'statistik',
      label: 'STATISTIK & ALUMNI',
      hasDropdown: true,
      subItems: [
        { label: 'Statistik Kelulusan & Nilai Rata-rata', tab: 'statistik', subTab: 'kelulusan' },
        { label: 'Sebaran Alumni di PTN/PTS & Karir', tab: 'statistik', subTab: 'alumni' },
        { label: 'Data Demografi Siswa & Rombel', tab: 'statistik', subTab: 'demografi' },
        { label: 'Koperasi & Perlengkapan Sekolah', tab: 'statistik', subTab: 'koperasi' },
      ],
    },
    { id: 'kontak', label: 'KONTAK', hasDropdown: false },
  ];

  return (
    <header className="w-full bg-white z-50 shadow-sm">
      {/* 1. TOP BLUE BAR DENGAN MOTTO PENDIDIKAN & SOSIAL MEDIA RESMI */}
      <div className="w-full bg-[#083b7e] text-white text-xs py-1.5 px-4 relative overflow-hidden border-b border-[#052b5e]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Sisi Kiri: Pita Motto Pendidikan Kristiani */}
          <div className="flex items-center">
            <div className="bg-[#0074d9] text-white text-[11px] font-bold px-3 py-0.5 rounded flex items-center gap-1.5 shadow-inner tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Membentuk Insan Berkarakter Kristiani, Cerdas & Berintegritas Sejak 1968</span>
            </div>
          </div>

          {/* Sisi Kanan: Tautan Sosial Media Resmi & Status Sistem */}
          <div className="hidden sm:flex items-center space-x-3 text-slate-200">
            <span className="text-[10px] text-sky-200 bg-white/10 px-2 py-0.5 rounded font-mono">
              Database MySQL Hostinger Ready
            </span>
            <div className="h-3 w-px bg-white/20" />
            <a
              href="#facebook"
              onClick={(e) => {
                e.preventDefault();
                alert('Facebook: SMA Katolik Setia Bakti Ruteng');
              }}
              className="hover:text-white transition-colors"
              title="Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a
              href="#twitter"
              onClick={(e) => {
                e.preventDefault();
                alert('Twitter: @smaksetiabaktirtg');
              }}
              className="hover:text-white transition-colors"
              title="Twitter"
            >
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a
              href="#instagram"
              onClick={(e) => {
                e.preventDefault();
                alert('Instagram: @smaksetiabaktirtg');
              }}
              className="hover:text-white transition-colors"
              title="Instagram"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a
              href="#youtube"
              onClick={(e) => {
                e.preventDefault();
                alert('YouTube: Kanal Resmi SMAK Setia Bakti');
              }}
              className="hover:text-white transition-colors"
              title="YouTube"
            >
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE ROW: LOGO RESMI SEKOLAH & 3 KOLOM KONTAK RAPI */}
      <div className="w-full bg-white py-3.5 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo Resmi Sekolah Terverifikasi (Bukan Education Web generic) */}
          <div
            onClick={() => onNavigateTab('beranda')}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#005fb8] to-[#173e75] text-white flex items-center justify-center shadow-md shadow-blue-900/15 group-hover:scale-105 transition-transform border-2 border-amber-300/40">
              <GraduationCap className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-[#005fb8] font-sans">
                  SMA KATOLIK SETIA BAKTI
                </span>
                <span className="hidden sm:inline-block text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  AKREDITASI A
                </span>
              </div>
              <p className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                RUTENG — MANGGARAI — NUSA TENGGARA TIMUR | NPSN: 50302830
              </p>
            </div>
          </div>

          {/* 3 Kolom Kontak Cepat: Rapi, Teratur & Simetris */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {/* 1. Hubungi Kami */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-blue-200 flex items-center justify-center text-blue-700 bg-blue-50/60 shadow-xs">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block leading-tight">
                  HUBUNGI KAMI
                </span>
                <a
                  href="tel:038521455"
                  className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors block leading-tight"
                >
                  +62 (0385) 21455
                </a>
              </div>
            </div>

            {/* 2. Email Resmi */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-blue-200 flex items-center justify-center text-blue-700 bg-blue-50/60 shadow-xs">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block leading-tight">
                  EMAIL RESMI
                </span>
                <a
                  href="mailto:info@smaksetiabaktirtg.sch.id"
                  className="text-xs font-bold text-slate-800 hover:text-blue-600 transition-colors block leading-tight"
                >
                  info@smaksetiabaktirtg.sch.id
                </a>
              </div>
            </div>

            {/* 3. Lokasi Kampus */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-blue-200 flex items-center justify-center text-blue-700 bg-blue-50/60 shadow-xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block leading-tight">
                  LOKASI SEKOLAH
                </span>
                <span className="text-xs font-bold text-slate-800 block leading-tight">
                  Jl. Komodo No. 1, Ruteng, NTT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN SOLID BLUE NAVIGATION BAR WITH CLEAN DROPDOWNS & PORTAL ACCESS */}
      <div className="w-full bg-[#005fb8] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Hamburger Menu Toggle on Mobile */}
          <div className="lg:hidden py-2 flex items-center justify-between w-full">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#004d99] px-3 py-1.5 rounded text-white cursor-pointer"
            >
              {mobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Menu Navigasi</span>
            </button>

            {session ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="bg-amber-400 text-slate-950 text-[11px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Dasbor</span>
                </button>
                {onOpenProfile && (
                  <button
                    onClick={onOpenProfile}
                    className="bg-[#004d99] p-1.5 rounded text-white"
                    title="Pengaturan Profil"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-white text-[#005fb8] text-[11px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm"
              >
                <Lock className="w-3 h-3" />
                <span>Masuk Portal</span>
              </button>
            )}
          </div>

          {/* Desktop Horizontal Navigation Links */}
          <nav className="hidden lg:flex items-center flex-wrap">
            {navMenuItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <div
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => {
                      if (item.id === 'kontak') {
                        const footer = document.querySelector('footer');
                        if (footer) footer.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onNavigateTab(item.id);
                      }
                    }}
                    className={`px-3.5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border-t-2 ${
                      isActive
                        ? 'bg-[#004d99] border-white text-white'
                        : 'border-transparent text-white/95 hover:bg-[#004d99] hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.isHighlight && (
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                        Buka
                      </span>
                    )}
                    {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-80" />}
                  </button>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && item.subItems && activeDropdown === item.id && (
                    <div className="absolute left-0 top-full w-64 bg-white text-slate-800 shadow-2xl border border-slate-200 py-1.5 rounded-b-xl z-50 animate-fadeIn">
                      {item.subItems.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onNavigateTab(sub.tab, sub.subTab);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer block border-b border-slate-100 last:border-0"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Controls: Search, Notification Bell, Portal */}
          <div className="hidden lg:flex items-center space-x-2 py-1.5">
            {/* Search Toggle */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                <input
                  type="text"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari jurusan, berita, guru..."
                  className="w-48 text-xs py-1.5 pl-3 pr-7 bg-white text-slate-900 rounded-full focus:outline-none shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="w-8 h-8 rounded-full hover:bg-[#004d99] flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Pencarian"
                aria-label="Cari"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative w-8 h-8 rounded-full hover:bg-[#004d99] flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
              )}
            </button>

            {/* Session / Portal Login CTA */}
            {session ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-white/20">
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="bg-[#004d99] hover:bg-[#003d7a] text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer border border-white/30"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{session.name.split(' ')[0]}</span>
                </button>

                {onOpenProfile && (
                  <button
                    onClick={onOpenProfile}
                    className="p-1.5 rounded-full bg-[#004d99] hover:bg-[#003d7a] text-white cursor-pointer"
                    title="Pengaturan Profil Saya"
                  >
                    <Settings className="w-3.5 h-3.5 text-sky-200" />
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-full hover:bg-red-600/60 text-white/90 hover:text-white cursor-pointer transition-colors"
                  title="Keluar Sesi"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-white hover:bg-slate-100 text-[#005fb8] text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Lock className="w-3.5 h-3.5 text-[#005fb8]" />
                <span>PORTAL MASUK</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Accordion Navigation Menu */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-[#004d99] border-t border-[#003d7a] px-4 py-3 space-y-1 animate-fadeIn">
            {navMenuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="border-b border-blue-800/50 last:border-0 pb-1">
                  <button
                    onClick={() => {
                      if (!item.hasDropdown) {
                        onNavigateTab(item.id);
                        setMobileNavOpen(false);
                      } else {
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-between cursor-pointer ${
                      isActive ? 'bg-white text-[#005fb8]' : 'text-white hover:bg-[#003d7a]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Sub items for mobile */}
                  {item.hasDropdown && activeDropdown === item.id && item.subItems && (
                    <div className="pl-4 pr-2 py-1 space-y-1 bg-[#003d7a] rounded-lg mt-1">
                      {item.subItems.map((sub, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => {
                            onNavigateTab(sub.tab, sub.subTab);
                            setMobileNavOpen(false);
                          }}
                          className="w-full text-left px-2 py-1.5 text-[11px] text-slate-200 hover:text-white block font-medium"
                        >
                          • {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
