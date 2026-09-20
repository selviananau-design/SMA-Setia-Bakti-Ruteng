import React, { useState } from 'react';
import {
  ArrowRight,
  Trophy,
  Sparkles,
  Calendar,
  Home,
  Users,
  Feather,
  BookOpen,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { Extracurricular, StudentWork } from '../types';
import { INITIAL_EXTRACURRICULARS, INITIAL_STUDENT_WORKS } from '../data/mockData';

interface CampusLifeSectionProps {
  onNavigateTab: (tab: string) => void;
  extracurriculars?: Extracurricular[];
  studentWorks?: StudentWork[];
}

export const CampusLifeSection: React.FC<CampusLifeSectionProps> = ({
  onNavigateTab,
  extracurriculars = INITIAL_EXTRACURRICULARS,
  studentWorks = INITIAL_STUDENT_WORKS,
}) => {
  const [selectedWork, setSelectedWork] = useState<StudentWork | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('semua');

  const highlights = [
    {
      id: 'clubs',
      title: 'Klub & Jurnalistik',
      desc: '15+ Ekstrakurikuler minat & bakat serta majalah dinding',
      icon: Users,
      badge: '15+ Ekskul',
    },
    {
      id: 'athletics',
      title: 'Olahraga & Atletik',
      desc: 'Basket, futsal, voli & bela diri berprestasi',
      icon: Trophy,
      badge: 'Kompetisi Resmi',
    },
    {
      id: 'events',
      title: 'Pentas Seni & Tradisi',
      desc: 'Festival budaya Manggarai & pentas tahunan',
      icon: Calendar,
      badge: 'Sepanjang Tahun',
    },
    {
      id: 'housing',
      title: 'Asrama & Kehidupan Sejuk',
      desc: 'Fasilitas asrama terpadu di kota sejuk Ruteng',
      icon: Home,
      badge: 'Asrama Putra/Putri',
    },
  ];

  const filteredWorks = studentWorks.filter((w) => {
    if (activeCategoryFilter === 'semua') return true;
    return w.category === activeCategoryFilter;
  });

  return (
    <section className="w-full py-12 sm:py-16 bg-slate-50 space-y-12">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Dark Navy Rounded Container matching the reference mockup */}
        <div className="bg-[#091326] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column (4 cols on lg) */}
            <div className="lg:col-span-4 space-y-5">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-amber-400">
                KEHIDUPAN KAMPUS DINAMIS
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight text-white leading-tight">
                Pengalaman Lebih dari Sekadar Pendidikan Kelas
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Dari riset ilmiah, panggung paduan suara, liputan jurnalistik siswa, hingga kompetisi olahraga dan
                pembinaan rohani di asrama, SMAK Setia Bakti memberikan ribuan peluang untuk bertumbuh seutuhnya.
              </p>
              <div>
                <button
                  onClick={() => onNavigateTab('galeri')}
                  className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold px-5 py-3 rounded-md text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>JELAJAHI KEGIATAN SISWA</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle Column (4 cols on lg): Large Student Photo */}
            <div className="lg:col-span-4 h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80"
                alt="Kehidupan Siswa SMAK Setia Bakti"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Persaudaraan & Solidaritas
                </span>
                <p className="text-xs font-semibold text-white mt-1 drop-shadow">
                  Membina kebersamaan penuh kasih dan persahabatan sejati
                </p>
              </div>
            </div>

            {/* Right Column (4 cols on lg): 2x2 Feature Grid */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
              {highlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => onNavigateTab('galeri')}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-all hover:border-white/20 cursor-pointer flex items-start gap-3.5 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 2: KARYA SASTRA & JURNALISTIK SISWA (CERITA, PUISI, ARTIKEL) */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
                Kreativitas & Literasi Siswa
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#321759] font-serif mt-2">
                Karya Siswa: Cerita, Puisi & Jurnalistik
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Wadah apresiasi karya tulis siswa SMA Katolik Setia Bakti dalam bidang sastra, cerpen reflektif,
                puisi kearifan Manggarai, dan liputan berita jurnalistik sekolah.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {['semua', 'Cerita', 'Puisi', 'Jurnalistik', 'Esai'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-[#3b1d70] text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  {cat === 'semua' ? 'Semua Karya' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredWorks.slice(0, 4).map((work) => (
              <div
                key={work.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-purple-300 transition-all group"
              >
                {work.coverImage && (
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={work.coverImage}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#211142]/85 backdrop-blur-sm text-amber-300">
                      {work.category}
                    </span>
                  </div>
                )}

                <div className="p-5 flex-1 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>{work.date}</span>
                      <span className="font-semibold text-slate-600">{work.authorClass}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-1 leading-snug group-hover:text-purple-900 transition-colors line-clamp-2">
                      {work.title}
                    </h4>

                    <p className="text-xs text-slate-500 mt-1 font-semibold">
                      Oleh: <strong className="text-slate-800">{work.author}</strong>
                    </p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                      "{work.excerpt}"
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedWork(work)}
                    className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Baca Selengkapnya</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: DAFTAR EKSTRAKURIKULER UNGGULAN */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
                Pengembangan Diri
              </span>
              <h3 className="text-2xl font-bold text-[#321759] font-serif mt-2">
                Ragam Pilihan Ekstrakurikuler Siswa
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Menyalurkan potensi minat, bakat sains, seni, kepemimpinan & olahraga
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extracurriculars.map((eskul) => (
              <div
                key={eskul.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-blue-50 text-blue-800">
                    {eskul.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{eskul.membersCount} Anggota</span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{eskul.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{eskul.description}</p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Pembina: <strong>{eskul.coach}</strong></span>
                  <span className="text-blue-700 font-semibold">{eskul.schedule.split(',')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL BACA LENGKAP KARYA SISWA */}
      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
            <div className="bg-[#211142] text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                  Karya Siswa: {selectedWork.category}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedWork.title}</h3>
              </div>
              <button
                onClick={() => setSelectedWork(null)}
                className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                <div>
                  <p className="font-bold text-slate-900 text-sm">{selectedWork.author}</p>
                  <p className="text-slate-500">Kelas {selectedWork.authorClass} • SMAK Setia Bakti Ruteng</p>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{selectedWork.date}</span>
              </div>

              {selectedWork.coverImage && (
                <div className="h-48 w-full rounded-xl overflow-hidden">
                  <img
                    src={selectedWork.coverImage}
                    alt={selectedWork.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="whitespace-pre-line text-slate-800 font-serif text-sm leading-relaxed p-5 bg-slate-50 rounded-xl border border-slate-200">
                {selectedWork.content}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Diterbitkan secara resmi oleh Redaksi Portal SMAK Setia Bakti
              </span>
              <button
                onClick={() => setSelectedWork(null)}
                className="px-4 py-2 bg-[#3b1d70] hover:bg-[#2e1557] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
