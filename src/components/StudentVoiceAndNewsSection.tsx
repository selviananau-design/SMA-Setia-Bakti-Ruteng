import React, { useState } from 'react';
import {
  Quote,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Download,
  Calendar,
} from 'lucide-react';
import { NewsItem, SchoolEvent } from '../types';

interface StudentVoiceAndNewsSectionProps {
  newsList: NewsItem[];
  events: SchoolEvent[];
  onNavigateTab: (tab: string) => void;
}

export const StudentVoiceAndNewsSection: React.FC<StudentVoiceAndNewsSectionProps> = ({
  newsList,
  events,
  onNavigateTab,
}) => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      quote:
        'SMAK Setia Bakti membentuk saya menjadi pribadi yang berani berpikir kritis, disiplin dalam belajar, dan teguh memegang integritas iman. Bimbingan para guru di sini sungguh luar biasa!',
      name: 'Maria Fransiska Jelita',
      role: 'Alumni MIPA 2024 / Mahasiswi FK UNAIR',
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 2,
      quote:
        'Fasilitas laboratorium sains modern dan iklim asrama yang sejuk di Ruteng memberikan ketenangan ekstra untuk fokus meraih juara Olimpiade Sains dan lolos seleksi PTN.',
      name: 'Yohanes Kevin Jebarus',
      role: 'Siswa Kelas XII MIPA / Juara 1 OSN Fisika NTT',
      avatar:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 3,
      quote:
        'Persaudaraan di sekolah ini sangat tulus. Selain ilmu pengetahuan umum, kami diajarkan etika hidup Kristiani dan kecintaan mendalam pada budaya luhur Manggarai.',
      name: 'Theresia Avilla Ndua',
      role: 'Ketua OSIS 2025/2026',
      avatar:
        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    },
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const t = testimonials[currentTestimonial];

  // Latest 3 news items with formatted date badges
  const displayNews = newsList.slice(0, 3);

  return (
    <section className="w-full py-14 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* COLUMN 1 (3 cols on lg): Student Testimonial */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 block mb-3">
                TESTIMONI SISWA
              </span>
              <div className="text-amber-500 mb-3">
                <Quote className="w-8 h-8 opacity-80" />
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic mb-6">
                "{t.quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{t.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{t.role}</p>
                </div>
              </div>

              {/* Slider Chevrons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={prevTestimonial}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer transition-colors"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* COLUMN 2 (6 cols on lg): Latest News & Events */}
          <div className="lg:col-span-6 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400">
                WARTA & AGENDA TERBARU
              </span>
              <button
                onClick={() => onNavigateTab('berita')}
                className="text-xs font-bold text-slate-700 hover:text-purple-950 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {displayNews.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab('berita')}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="relative h-28 w-full overflow-hidden bg-slate-100">
                      <img
                        src={
                          item.imageUrl ||
                          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80'
                        }
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-center shadow">
                        <span className="text-[9px] font-black text-slate-900 block leading-none">
                          {item.date.slice(0, 6)}
                        </span>
                      </div>
                    </div>

                    <div className="p-3">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 pt-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 group-hover:text-slate-950">
                      <span>BACA</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 3 (3 cols on lg): Dark Navy CTA Callout Card */}
          <div className="lg:col-span-3 bg-[#0c162c] text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-amber-400 block">
                LANGKAH BERIKUTNYA
              </span>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white leading-snug">
                Siap Memulai Langkah Anda?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bergabunglah bersama keluarga besar pembelajar dan pemimpin berkarakter luhur di SMAK Setia
                Bakti Ruteng.
              </p>
            </div>

            <div className="space-y-3 pt-6">
              <button
                onClick={() => onNavigateTab('ppdb')}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold py-3 px-4 rounded-md text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow cursor-pointer"
              >
                <span>DAFTAR PPDB SEKARANG</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  alert(
                    'Mengunduh Brosur PPDB & Informasi Akademik Resmi SMA Katolik Setia Bakti Ruteng (PDF)...'
                  );
                }}
                className="w-full text-center text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 py-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Brosur Informasi</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
