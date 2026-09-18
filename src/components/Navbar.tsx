import React, { useState } from 'react';
import { Menu, X, Sparkles, UserCheck, ChevronRight } from 'lucide-react';
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
    { id: 'beranda', label: 'Beranda' },
    { id: 'akademik', label: 'Akademik & Peminatan' },
    { id: 'ppdb', label: 'PPDB Online 2026/2027', highlight: true },
    { id: 'galeri', label: 'Kehidupan Siswa & Ekskul' },
    { id: 'guru', label: 'Guru & Staf Pengajar' },
    { id: 'statistik', label: 'Statistik & Alumni' },
    { id: 'berita', label: 'Warta & Berita Sekolah' },
    {
      id: 'portal',
      label: session ? `Dasbor (${session.role.toUpperCase()})` : 'Portal Login Masuk',
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
    <div className="w-full lg:hidden bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Menu Navigasi
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded uppercase font-semibold">
            {activeTab}
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="bg-slate-950 border-t border-slate-800 px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.highlight ? (
                  <span className="bg-emerald-500 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Buka
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
