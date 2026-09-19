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
  Share2,
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
  notifications = [],
  onSearch,
  onNavigateTab = () => {},
  activeTab = 'beranda',
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && onSearch) {
      onSearch(searchInput.trim());
      setSearchOpen(false);
    }
  };

  const navMenuItems = [
    { id: 'beranda', label: 'HOME', hasDropdown: false },
    { id: 'akademik', label: 'ABOUT US', hasDropdown: false },
    {
      id: 'courses',
      label: 'OUR COURSES',
      hasDropdown: true,
      subItems: [
        { label: 'Business Courses (IPS & Ekonomi)', tab: 'akademik' },
        { label: 'Science & Tech (MIPA & Fisika)', tab: 'akademik' },
        { label: 'Travel & Tourism (Bahasa & Budaya)', tab: 'akademik' },
        { label: 'Fashion & Art Courses', tab: 'akademik' },
      ],
    },
    {
      id: 'ppdb',
      label: 'PAGE LAYOUTS',
      hasDropdown: true,
      subItems: [
        { label: 'PPDB Online 2026/2027', tab: 'ppdb' },
        { label: 'Biaya & Persyaratan Masuk', tab: 'ppdb' },
        { label: 'Jalur Beasiswa Prestasi', tab: 'ppdb' },
        { label: 'Pengumuman Kelulusan', tab: 'ppdb' },
      ],
    },
    {
      id: 'guru',
      label: 'OUR TEAM',
      hasDropdown: true,
      subItems: [
        { label: 'Dewan Guru & Pendidik', tab: 'guru' },
        { label: 'Kepala Sekolah & Manajemen', tab: 'guru' },
        { label: 'Staf Administrasi & Laboratorium', tab: 'guru' },
      ],
    },
    { id: 'berita', label: 'BLOGS', hasDropdown: false },
    {
      id: 'galeri',
      label: 'SHORTCODES',
      hasDropdown: true,
      subItems: [
        { label: 'Kehidupan Siswa & Ekskul', tab: 'galeri' },
        { label: 'Fasilitas & Asrama Putra/Putri', tab: 'galeri' },
        { label: 'Galeri Foto & Video Kampus', tab: 'galeri' },
      ],
    },
    {
      id: 'statistik',
      label: 'SHOP',
      hasDropdown: true,
      subItems: [
        { label: 'Statistik & Data Alumni', tab: 'statistik' },
        { label: 'Koperasi & Seragam Sekolah', tab: 'statistik' },
      ],
    },
    { id: 'kontak', label: 'CONTACT US', hasDropdown: false },
  ];

  return (
    <header className="w-full bg-white z-50 shadow-sm">
      {/* 1. TOP BLUE BAR WITH ANGLE RIBBON & SOCIAL ICONS (Exact match to reference image) */}
      <div className="w-full bg-[#083b7e] text-white text-xs py-1.5 px-4 relative overflow-hidden border-b border-[#052b5e]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Ribbon / Slanted Badge */}
          <div className="flex items-center">
            <div className="bg-[#0074d9] text-white text-[11px] font-bold px-4 py-1 relative flex items-center shadow-inner tracking-wide clip-ribbon">
              <span>Join with us and be a part of the success</span>
            </div>
          </div>

          {/* Right Social Icons matching reference: Facebook, Twitter, Google+, Instagram, Pinterest, LinkedIn, YouTube */}
          <div className="flex items-center space-x-3 text-slate-200">
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
              href="#googleplus"
              onClick={(e) => {
                e.preventDefault();
                alert('Google+: Official Education Web Network');
              }}
              className="hover:text-white transition-colors font-bold text-[11px] leading-none"
              title="Google+"
            >
              G+
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
              href="#pinterest"
              onClick={(e) => {
                e.preventDefault();
                alert('Pinterest: Galeri Kreatif Siswa');
              }}
              className="hover:text-white transition-colors font-serif font-black text-[11px] leading-none"
              title="Pinterest"
            >
              P
            </a>
            <a
              href="#linkedin"
              onClick={(e) => {
                e.preventDefault();
                alert('LinkedIn: Alumni SMA Katolik Setia Bakti');
              }}
              className="hover:text-white transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
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

      {/* 2. MIDDLE HEADER ROW: LOGO & 3 CONTACT CIRCLES (Exact match to reference image) */}
      <div className="w-full bg-white py-4 px-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo with Cap & Diploma Icon */}
          <div
            onClick={() => onNavigateTab('beranda')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#0060b8] text-white flex items-center justify-center shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-[#0060b8] font-sans">
                  Education
                </span>
                <span className="text-2xl font-bold tracking-tight text-slate-800 font-sans">
                  Web
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                SMAK SETIA BAKTI RUTENG — FLORES NTT
              </p>
            </div>
          </div>

          {/* Right: 3 Contact Columns with Circular Icons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6 sm:gap-8">
            {/* 1. CALL US */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 bg-slate-50/50">
                <Phone className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  CALL US
                </span>
                <a
                  href="tel:038521455"
                  className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors block leading-tight"
                >
                  +01 (213) 471-7207
                </a>
              </div>
            </div>

            {/* 2. EMAIL US */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 bg-slate-50/50">
                <Mail className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  EMAIL US
                </span>
                <a
                  href="mailto:support@offshorethemes.com"
                  className="text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors block leading-tight"
                >
                  support@offshorethemes.com
                </a>
              </div>
            </div>

            {/* 3. LOCATE US */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 bg-slate-50/50">
                <MapPin className="w-4 h-4 text-slate-700" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                  LOCATE US
                </span>
                <span className="text-xs font-semibold text-slate-800 block leading-tight">
                  210 Wells Fargo Drive, Houston
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SOLID ROYAL BLUE NAVIGATION BAR WITH DROPDOWNS (Exact match to reference image) */}
      <div className="w-full bg-[#005fb8] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Horizontal Navigation Menu Links */}
          <nav className="flex items-center flex-wrap">
            {navMenuItems.map((item) => {
              const isActive =
                activeTab === item.id ||
                (item.id === 'courses' && activeTab === 'akademik') ||
                (item.id === 'ppdb' && activeTab === 'ppdb') ||
                (item.id === 'galeri' && activeTab === 'galeri') ||
                (item.id === 'guru' && activeTab === 'guru') ||
                (item.id === 'statistik' && activeTab === 'statistik') ||
                (item.id === 'berita' && activeTab === 'berita');

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
                        onNavigateTab(item.id === 'courses' ? 'akademik' : item.id);
                      }
                    }}
                    className={`px-3.5 py-3 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border-t-2 ${
                      isActive
                        ? 'bg-[#004d99] border-white text-white'
                        : 'border-transparent text-white/95 hover:bg-[#004d99] hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-80" />}
                  </button>

                  {/* Dropdown Menu */}
                  {item.hasDropdown && item.subItems && activeDropdown === item.id && (
                    <div className="absolute left-0 top-full w-60 bg-white text-slate-800 shadow-xl border border-slate-200 py-2 rounded-b-md z-50">
                      {item.subItems.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            onNavigateTab(sub.tab);
                            setActiveDropdown(null);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors cursor-pointer block border-b border-slate-100 last:border-0"
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
          <div className="flex items-center space-x-2 py-1.5">
            {/* Search Button */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center relative">
                <input
                  type="text"
                  autoFocus
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Cari program, berita, tim..."
                  className="w-44 text-xs py-1 pl-3 pr-7 bg-white text-slate-900 rounded focus:outline-none"
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
                className="w-8 h-8 rounded hover:bg-[#004d99] flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Pencarian"
                aria-label="Cari"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative w-8 h-8 rounded hover:bg-[#004d99] flex items-center justify-center text-white transition-colors cursor-pointer"
              title="Notifikasi"
              aria-label="Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full" />
              )}
            </button>

            {/* Portal Login / Session */}
            {session ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="bg-[#004d99] hover:bg-[#003d7a] text-white text-[11px] font-bold px-2.5 py-1.5 rounded flex items-center gap-1 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{session.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-white/80 hover:text-white cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-[#004d99] hover:bg-[#003d7a] text-white text-[11px] font-bold px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer"
              >
                <span>LOGIN</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

