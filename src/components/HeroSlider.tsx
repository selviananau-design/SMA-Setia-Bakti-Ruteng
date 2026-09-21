import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plane,
  User,
  Users,
  Award,
  BookMarked,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Edit3,
} from 'lucide-react';
import { HomepageConfig } from '../types';

interface HeroSliderProps {
  onNavigateTab: (tab: string) => void;
  config?: HomepageConfig;
  onOpenCustomizer?: () => void;
  isAdmin?: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
  onNavigateTab,
  config,
  onOpenCustomizer,
  isAdmin = false,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Background slides (dinamis dari config atau fallback)
  const heroBackgrounds =
    config?.heroSlides && config.heroSlides.length > 0
      ? config.heroSlides
      : [
          {
            id: 's-1',
            url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80',
            title: 'Kampus Utama SMA Katolik Setia Bakti',
          },
          {
            id: 's-2',
            url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=80',
            title: 'Pusat Keunggulan Akademik',
          },
        ];

  // Tulisan-tulisan dinamis
  const heroEyebrow = config?.heroEyebrow || 'BUTUH INFORMASI & BANTUAN?';
  const heroHeadline = config?.heroHeadline || 'SELAMAT DATANG DI';
  const heroHeadlineHighlight = config?.heroHeadlineHighlight || 'KAMPUS KAMI';
  const heroSubtitle =
    config?.heroSubtitle || 'SMA KATOLIK SETIA BAKTI RUTENG — MENGINSPIRASI MASA DEPAN';
  const heroCtaText = config?.heroCtaText || 'BACA SELENGKAPNYA';
  const heroCtaTab = config?.heroCtaTab || 'akademik';

  // Feature cards & Stats
  const featureCards = config?.featureCards || [
    {
      id: 'fc-1',
      title: 'JURUSAN IPS & BISNIS',
      subtitle: 'Pelajari Selengkapnya',
      iconType: 'briefcase',
      targetTab: 'akademik',
    },
    {
      id: 'fc-2',
      title: 'BAHASA & PARIWISATA',
      subtitle: 'Pelajari Selengkapnya',
      iconType: 'plane',
      targetTab: 'akademik',
    },
    {
      id: 'fc-3',
      title: 'MIPA & SAINS RISET',
      subtitle: 'Pelajari Selengkapnya',
      iconType: 'user',
      targetTab: 'akademik',
    },
  ];

  const quickStats = config?.quickStats || [
    { id: 'qs-1', value: '1.250+ Siswa', label: 'Siswa', sublabel: 'Aktif & Berprestasi', iconType: 'users' },
    { id: 'qs-2', value: '3 Jurusan', label: 'Jurusan', sublabel: 'MIPA, IPS, Bahasa', iconType: 'book' },
    { id: 'qs-3', value: '42+ Pendidik', label: 'Pendidik', sublabel: 'Guru Bersertifikasi', iconType: 'grad' },
    { id: 'qs-4', value: 'Akreditasi A', label: 'Akreditasi', sublabel: 'Unggul Nasional', iconType: 'award' },
  ];

  // Announcement bar
  const announcement = config?.announcementBar;

  useEffect(() => {
    if (heroBackgrounds.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBackgrounds.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroBackgrounds.length]);

  const renderCardIcon = (iconType: string) => {
    switch (iconType) {
      case 'plane':
        return <Plane className="w-6 h-6 text-[#00a8ff]" />;
      case 'user':
        return <User className="w-6 h-6 text-[#00a8ff]" />;
      case 'book':
        return <BookMarked className="w-6 h-6 text-[#00a8ff]" />;
      case 'grad':
        return <GraduationCap className="w-6 h-6 text-[#00a8ff]" />;
      case 'award':
        return <Award className="w-6 h-6 text-[#00a8ff]" />;
      case 'briefcase':
      default:
        return <Briefcase className="w-6 h-6 text-[#00a8ff]" />;
    }
  };

  const renderStatIcon = (iconType: string) => {
    switch (iconType) {
      case 'book':
        return <BookMarked className="w-5 h-5" />;
      case 'grad':
        return <GraduationCap className="w-5 h-5" />;
      case 'award':
        return <Award className="w-5 h-5" />;
      case 'users':
      default:
        return <Users className="w-5 h-5" />;
    }
  };

  const getStatBg = (index: number) => {
    const colors = [
      'bg-blue-50 text-blue-700',
      'bg-indigo-50 text-indigo-700',
      'bg-emerald-50 text-emerald-700',
      'bg-amber-50 text-amber-700',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="relative w-full bg-[#0b1329] text-white">
      {/* 0. PITA PENGUMUMAN BERJALAN (JIKA DIAKTIFKAN) */}
      {announcement && announcement.enabled && (
        <div className="relative z-40 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white px-4 py-2 text-xs font-semibold shadow-inner border-b border-amber-400/40">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-grow overflow-hidden">
              <span className="px-2 py-0.5 rounded bg-white text-amber-900 font-black text-[10px] uppercase tracking-wider flex items-center gap-1 flex-shrink-0 shadow-xs">
                <Megaphone className="w-3 h-3 text-amber-600" />
                <span>{announcement.badgeText || 'PENGUMUMAN'}</span>
              </span>
              <p className="truncate text-white/95 text-xs font-medium">
                {announcement.message}
              </p>
            </div>
            {announcement.linkText && (
              <button
                type="button"
                onClick={() => onNavigateTab(announcement.targetTab || 'ppdb')}
                className="px-2.5 py-1 bg-black/20 hover:bg-black/35 rounded text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1 flex-shrink-0 cursor-pointer transition-colors"
              >
                <span>{announcement.linkText}</span>
                <span className="text-[10px]">→</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ADMIN EDIT FLOATING SHORTCUT */}
      {isAdmin && onOpenCustomizer && (
        <div className="absolute top-4 right-4 z-40">
          <button
            type="button"
            onClick={onOpenCustomizer}
            className="px-3.5 py-2 bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
            title="Kelola & Ganti Foto Slider dan Tulisan Halaman Utama"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Ganti Gambar & Tulisan Beranda</span>
          </button>
        </div>
      )}

      {/* 1. CINEMATIC HERO BANNER */}
      <div className="relative w-full min-h-[500px] lg:min-h-[560px] flex flex-col justify-between overflow-hidden">
        {/* Background Image with smooth transition */}
        {heroBackgrounds.map((bg, idx) => (
          <div
            key={bg.id || idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={bg.url}
              alt={bg.title}
              className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-[10000ms]"
              referrerPolicy="no-referrer"
            />
            {/* Dark vignette to guarantee readability of white text */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        {/* Hero Slider Nav Arrows (jika lebih dari 1 slide) */}
        {heroBackgrounds.length > 1 && (
          <div className="absolute right-4 bottom-24 z-30 hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveSlide((prev) => (prev === 0 ? heroBackgrounds.length - 1 : prev - 1))
              }
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
              title="Slide Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setActiveSlide((prev) => (prev + 1) % heroBackgrounds.length)}
              className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
              title="Slide Berikutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Hero Content (Left-aligned bold typography) */}
        <div className="relative max-w-7xl mx-auto px-4 pt-16 sm:pt-24 pb-8 w-full z-20 flex-grow flex items-center">
          <div className="max-w-2xl space-y-4">
            {/* Eyebrow */}
            <p className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-xs">
              {heroEyebrow}
            </p>

            {/* Huge bold headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.05] drop-shadow-md">
              {heroHeadline} <br />
              <span className="text-white">{heroHeadlineHighlight}</span>
            </h1>

            {/* School subtitle for context */}
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-200 uppercase pt-1 drop-shadow-xs">
              {heroSubtitle}
            </p>

            {/* Action Button */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateTab(heroCtaTab)}
                className="bg-[#0074d9] hover:bg-[#005fb8] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-none shadow-md inline-flex items-center gap-2.5 transition-all cursor-pointer hover:shadow-lg active:scale-95"
              >
                <span>{heroCtaText}</span>
                <span className="text-[11px] leading-none">▶</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('ppdb')}
                className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-5 py-3 rounded-none backdrop-blur-xs border border-white/30 inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Daftar PPDB Online</span>
                <span className="text-[10px]">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. THREE TRANSLUCENT BOTTOM CARDS */}
        <div className="relative z-30 w-full bg-black/60 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15">
            {featureCards.map((card, idx) => (
              <button
                key={card.id || idx}
                type="button"
                onClick={() => onNavigateTab(card.targetTab || 'akademik')}
                className="py-5 px-6 flex items-center gap-4 text-left hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-[#00a8ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  {renderCardIcon(card.iconType)}
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#00a8ff] transition-colors">
                    {card.title}
                  </h3>
                  <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-0.5">
                    <span>{card.subtitle}</span>
                    <span className="text-[10px]">&gt;</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. COMPACT STATS BAR */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-4 px-6 text-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center sm:text-left">
            {quickStats.map((st, idx) => (
              <div
                key={st.id || idx}
                className={`flex items-center gap-3 ${
                  idx === 0 ? 'sm:px-3' : 'pt-3 sm:pt-0 sm:px-3'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getStatBg(
                    idx
                  )}`}
                >
                  {renderStatIcon(st.iconType)}
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900 leading-tight">{st.value}</p>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">
                    {st.sublabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
