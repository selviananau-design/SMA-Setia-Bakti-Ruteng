import React, { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  session: UserSession | null;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  session,
  onOpenLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'beranda', label: 'BERANDA' },
    { id: 'akademik', label: 'AKADEMIK' },
    { id: 'berita', label: 'BERITA & AGENDA' },
    { id: 'galeri', label: 'GALERI SISWA' },
    { id: 'ppdb', label: 'PPDB ONLINE', highlight: true },
    { id: 'guru', label: 'PROFIL GURU & PEGAWAI' },
    { id: 'statistik', label: 'STATISTIK & ALUMNI' },
    {
      id: 'portal',
      label: session ? `DASBOR (${session.role.toUpperCase()})` : 'PORTAL LOGIN',
      special: true,
    },
  ];

  const handleItemClick = (id: string) => {
    if (id === 'portal' && !session) {
      onOpenLogin();
    } else {
      onSelectTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="w-full bg-[#3d1e70] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-1 w-full justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`px-3.5 py-3 text-xs md:text-[13px] font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer relative flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#29114f] text-amber-300 border-b-2 border-amber-400'
                    : 'text-purple-100 hover:bg-[#4d288c] hover:text-white'
                } ${item.special ? 'bg-amber-500/20 text-amber-200 hover:bg-amber-500/30' : ''}`}
              >
                {item.label}
                {item.highlight && (
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Buka
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Header Bar */}
        <div className="lg:hidden flex items-center justify-between w-full py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Menu Navigasi
            </span>
            {activeTab && (
              <span className="text-[11px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded uppercase font-semibold">
                {activeTab}
              </span>
            )}
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded bg-[#4d288c] text-white hover:bg-[#5b32a3] focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#301659] border-t border-purple-800 px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#1e0c3b] text-amber-300 font-extrabold'
                    : 'text-purple-100 hover:bg-[#43207d] hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Buka
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
};
