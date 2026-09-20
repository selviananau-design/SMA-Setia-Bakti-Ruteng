import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plane,
  User,
  Users,
  Award,
  BookMarked,
  GraduationCap,
} from 'lucide-react';

interface HeroSliderProps {
  onNavigateTab: (tab: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigateTab }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // High quality hero backgrounds featuring classical university campus architecture with green tree branches
  const heroBackgrounds = [
    {
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80',
      title: 'Kampus Utama SMA Katolik Setia Bakti',
    },
    {
      url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2000&q=80',
      title: 'Pusat Keunggulan Akademik',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroBackgrounds.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroBackgrounds.length]);

  return (
    <div className="relative w-full bg-[#0b1329] text-white">
      {/* 1. CINEMATIC HERO BANNER (Exact match to reference image) */}
      <div className="relative w-full min-h-[500px] lg:min-h-[560px] flex flex-col justify-between overflow-hidden">
        {/* Background Image with smooth transition */}
        {heroBackgrounds.map((bg, idx) => (
          <div
            key={idx}
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
            <div className="absolute inset-0 bg-black/25" />
          </div>
        ))}

        {/* Hero Content (Left-aligned bold typography exactly like in the picture) */}
        <div className="relative max-w-7xl mx-auto px-4 pt-16 sm:pt-24 pb-8 w-full z-20 flex-grow flex items-center">
          <div className="max-w-2xl space-y-4">
            {/* Eyebrow in uppercase bold white font */}
            <p className="text-sm sm:text-base font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-sm">
              BUTUH INFORMASI & BANTUAN?
            </p>

            {/* Huge bold headline: SELAMAT DATANG DI SMAK SETIA BAKTI */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.05] drop-shadow-md">
              SELAMAT DATANG DI <br />
              <span className="text-white">KAMPUS KAMI</span>
            </h1>

            {/* School subtitle for context */}
            <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-200 uppercase pt-1">
              SMA KATOLIK SETIA BAKTI RUTENG — MENGINSPIRASI MASA DEPAN
            </p>

            {/* Blue Action Button (Matches BACA SELENGKAPNYA ▶) */}
            <div className="pt-4">
              <button
                onClick={() => onNavigateTab('akademik')}
                className="bg-[#0074d9] hover:bg-[#005fb8] text-white font-bold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-none shadow-md inline-flex items-center gap-2.5 transition-all cursor-pointer hover:shadow-lg"
              >
                <span>BACA SELENGKAPNYA</span>
                <span className="text-[11px] leading-none">▶</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. THREE TRANSLUCENT BOTTOM CARDS (Exact match to 3 horizontal cards in reference picture) */}
        <div className="relative z-30 w-full bg-black/60 backdrop-blur-md border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15">
            {/* Card 1: JURUSAN IPS & BISNIS */}
            <button
              onClick={() => onNavigateTab('akademik')}
              className="py-5 px-6 flex items-center gap-4 text-left hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-[#00a8ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Briefcase className="w-6 h-6 text-[#00a8ff]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#00a8ff] transition-colors">
                  JURUSAN IPS & BISNIS
                </h3>
                <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-0.5">
                  <span>Pelajari Selengkapnya</span>
                  <span className="text-[10px]">&gt;</span>
                </span>
              </div>
            </button>

            {/* Card 2: BAHASA & PARIWISATA */}
            <button
              onClick={() => onNavigateTab('akademik')}
              className="py-5 px-6 flex items-center gap-4 text-left hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-[#00a8ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Plane className="w-6 h-6 text-[#00a8ff]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#00a8ff] transition-colors">
                  BAHASA & PARIWISATA
                </h3>
                <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-0.5">
                  <span>Pelajari Selengkapnya</span>
                  <span className="text-[10px]">&gt;</span>
                </span>
              </div>
            </button>

            {/* Card 3: MIPA & SAINS TEKNOLOGI */}
            <button
              onClick={() => onNavigateTab('akademik')}
              className="py-5 px-6 flex items-center gap-4 text-left hover:bg-white/10 transition-colors group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 text-[#00a8ff] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <User className="w-6 h-6 text-[#00a8ff]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white group-hover:text-[#00a8ff] transition-colors">
                  MIPA & SAINS RISET
                </h3>
                <span className="text-xs text-slate-300 group-hover:text-white flex items-center gap-1 mt-0.5">
                  <span>Pelajari Selengkapnya</span>
                  <span className="text-[10px]">&gt;</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 3. COMPACT STATS BAR */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 py-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 py-4 px-6 text-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-center sm:text-left">
            <div className="flex items-center gap-3 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-tight">1.250+ Siswa</p>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Aktif & Berprestasi</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-tight">3 Jurusan</p>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">MIPA, IPS, Bahasa</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-tight">42+ Pendidik</p>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Guru Bersertifikasi</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-extrabold text-slate-900 leading-tight">Akreditasi A</p>
                <span className="text-[10px] font-semibold text-slate-500 uppercase">Unggul Nasional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
