import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Play,
  GraduationCap,
  BookOpen,
  Globe2,
  ShieldCheck,
  ChevronRight,
  Users,
  Award,
  BookMarked,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { BANNER_SLIDES, SCHOOL_INFO } from '../data/mockData';

interface HeroSliderProps {
  onNavigateTab: (tab: string) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ onNavigateTab }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = BANNER_SLIDES[activeSlide];

  // Quick program shortcuts matching the right floating card in the reference mockup
  const programShortcuts = [
    {
      id: 'mipa',
      title: 'Peminatan MIPA (Sains Alam)',
      desc: 'Fisika, Kimia, Biologi & Laboratorium Riset',
      icon: GraduationCap,
      tab: 'akademik',
    },
    {
      id: 'ips',
      title: 'Peminatan IPS (Sosial)',
      desc: 'Ekonomi, Sosiologi & Kepemimpinan Publik',
      icon: BookOpen,
      tab: 'akademik',
    },
    {
      id: 'bahasa',
      title: 'Peminatan Bahasa & Budaya',
      desc: 'Bahasa Asing & Seni Budaya Tradisi Flores',
      icon: Globe2,
      tab: 'akademik',
    },
    {
      id: 'beasiswa',
      title: 'Beasiswa & Bantuan Pendidikan',
      desc: 'Program Afirmasi Yayasan & Beasiswa Prestasi',
      icon: ShieldCheck,
      tab: 'ppdb',
    },
  ];

  return (
    <div className="relative w-full bg-[#0b1329] text-white">
      {/* 1. CINEMATIC HERO BANNER (Matches the grand university campus hero in reference) */}
      <div className="relative w-full min-h-[520px] lg:min-h-[580px] flex items-center overflow-hidden">
        {/* Background Image with smooth transition */}
        {BANNER_SLIDES.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[8000ms]"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient vignette for high contrast reading */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1329] via-transparent to-black/30" />
          </div>
        ))}

        {/* Hero Content Grid: Left typography + Right floating card */}
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24 w-full z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (8 cols on lg): Large Serif Headline & Dual CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Golden Tracked Eyebrow */}
              <div className="inline-flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-amber-400">
                  BELAJAR. MEMIMPIN. BERTRANSFORMASI.
                </span>
              </div>

              {/* Grand Serif Display Headline matching reference */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.15]">
                Membangun Masa Depan. <br />
                <span className="text-slate-100">Mengubah Kehidupan.</span>
              </h1>

              {/* Refined Descriptive Subtitle */}
              <p className="text-sm sm:text-base text-slate-200/90 max-w-2xl leading-relaxed font-normal">
                Di SMA Katolik Setia Bakti Ruteng, kami memberdayakan akal budi, menumbuhkan
                integritas moral Kristiani, dan membina generasi pembelajar berprestasi untuk
                menghadapi tantangan global masa depan.
              </p>

              {/* Dual Action Buttons matching reference */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary Golden Pill Button */}
                <button
                  onClick={() => onNavigateTab('akademik')}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold px-6 py-3.5 rounded-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 cursor-pointer"
                >
                  <span>JELAJAHI PROGRAM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Frosted Pill Button with Play Icon */}
                <button
                  onClick={() => onNavigateTab('galeri')}
                  className="bg-slate-900/60 hover:bg-slate-900/80 text-white font-bold px-6 py-3.5 rounded-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2.5 border border-white/20 backdrop-blur-sm transition-all cursor-pointer"
                >
                  <span>TUR SEKOLAH</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 fill-white" />
                  </div>
                </button>
              </div>

              {/* Slide indicators */}
              <div className="flex items-center gap-2 pt-4">
                {BANNER_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveSlide(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      i === activeSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Column (5 cols on lg): Floating Frosted Dark Glass Card matching reference */}
            <div className="lg:col-span-5">
              <div className="bg-[#0b162c]/85 backdrop-blur-md rounded-2xl border border-white/15 p-5 sm:p-6 shadow-2xl space-y-2.5">
                <div className="border-b border-white/10 pb-3 mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                    JALUR PEMINATAN & BEASISWA
                  </span>
                  <span className="text-[10px] text-slate-400">T.A. 2026/2027</span>
                </div>

                {programShortcuts.map((prog) => {
                  const Icon = prog.icon;
                  return (
                    <button
                      key={prog.id}
                      onClick={() => onNavigateTab(prog.tab)}
                      className="w-full text-left p-3.5 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                            {prog.title}
                          </h4>
                          <p className="text-[11px] text-slate-300 line-clamp-1">{prog.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS BAR RIBBON (White pill overlapping bottom hero, matching reference) */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 -mt-8 sm:-mt-10 mb-6">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/90 py-5 px-6 sm:px-8 text-slate-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* Stat 1: Students */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  1.250+
                </p>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Siswa Aktif
                </span>
              </div>
            </div>

            {/* Stat 2: Programs */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  3 Jurusan
                </p>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Peminatan Utama
                </span>
              </div>
            </div>

            {/* Stat 3: Expert Faculty */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  42+ Guru
                </p>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Pendidik Bersertifikasi
                </span>
              </div>
            </div>

            {/* Stat 4: Success Rate */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  98.8%
                </p>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Kelulusan & PTN
                </span>
              </div>
            </div>

            {/* Stat 5: Established Years */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:px-3 col-span-2 sm:col-span-1">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
                  1958
                </p>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tahun Pengabdian
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
