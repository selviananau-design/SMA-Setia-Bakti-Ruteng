import React, { useState } from 'react';
import { Menu, X, Sparkles, UserCheck, ChevronRight } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  activeTab: string;
  onSelectTab: (tab: string, subTab?: string) => void;
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
    { id: 'profil', label: 'Profil Kami' },
    { id: 'jurusan', label: 'Jurusan & Program' },
    { id: 'ppdb', label: 'PPDB Online 2026/2027', highlight: true },
    { id: 'guru', label: 'Dewan Guru & Staf' },
    { id: 'berita', label: 'Warta & Berita Sekolah' },
    { id: 'kehidupan', label: 'Kehidupan Siswa & Ekskul' },
    { id: 'statistik', label: 'Statistik & Alumni' },
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
    <div className="w-full lg:hidden bg-[#005fb8] text-white border-b border-[#004d99]">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            MENU NAVIGASI
          </span>
          <span className="text-[10px] bg-[#004d99] text-white px-2 py-0.5 rounded uppercase font-semibold">
            {activeTab}
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded bg-[#004d99] text-white hover:bg-[#003d7a] cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="bg-[#004d99] border-t border-[#003d7a] px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#005fb8] font-black'
                    : 'text-white hover:bg-[#003d7a]'
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
